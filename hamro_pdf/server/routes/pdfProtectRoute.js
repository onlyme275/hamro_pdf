const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { userPassword = "", ownerPassword = "" } = req.body;
  const inputPath = req.file.path;
  const outputPath = path.join(os.tmpdir(), `${Date.now()}_protected.pdf`);

  const qpdfArgs = [
    "--encrypt",
    userPassword,
    ownerPassword || userPassword,
    "256",
    "--",
    inputPath,
    outputPath,
  ];

  console.log("Running qpdf with args:", qpdfArgs);

  const qpdf = spawn("qpdf", qpdfArgs);

  let stderrData = "";
  qpdf.stderr.on("data", (data) => {
    const text = data.toString();
    stderrData += text;
    console.warn("qpdf warning/error:", text);
  });

  qpdf.on("close", (code) => {
    // Only fail if exit code is non-zero
    if (code !== 0) {
      fs.unlink(inputPath, () => {});
      fs.unlink(outputPath, () => {});
      return res.status(500).json({ error: "Failed to protect PDF", details: stderrData });
    }

    try {
      const pdfBuffer = fs.readFileSync(outputPath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${req.file.originalname.replace(".pdf", "_protected.pdf")}`
      );
      res.send(pdfBuffer);
    } catch (err) {
      return res.status(500).json({ error: "Error reading protected PDF" });
    } finally {
      fs.unlink(inputPath, () => {});
      fs.unlink(outputPath, () => {});
    }
  });
});

module.exports = router;
