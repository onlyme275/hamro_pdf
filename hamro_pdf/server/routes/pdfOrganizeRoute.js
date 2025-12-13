const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

// POST /api/pdf-organize
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { pages } = req.body;
    if (!pages) return res.status(400).json({ error: "No pages order provided" });

    let pageOrder;
    try {
      pageOrder = JSON.parse(pages);
      if (!Array.isArray(pageOrder) || pageOrder.length === 0) throw new Error();
    } catch {
      return res.status(400).json({ error: "Invalid pages format" });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(os.tmpdir(), `${Date.now()}_reordered.pdf`);

    // QPDF page selection: e.g., "2,1,3" for pages
    const pageOrderStr = pageOrder.join(",");

    const args = [inputPath, "--pages", inputPath, pageOrderStr, "--", outputPath];

    const qpdf = spawn("qpdf", args);

    qpdf.stderr.on("data", (data) => {
      console.error("qpdf warning/error:", data.toString());
    });

    qpdf.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "Failed to reorder PDF" });
      }

      const pdfBuffer = fs.readFileSync(outputPath);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reordered.pdf");
      res.send(pdfBuffer);

      // Cleanup
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
