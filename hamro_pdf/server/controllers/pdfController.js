// controllers/pdfController.js - SIMPLE FOCUSED SOLUTION
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse/lib/pdf-parse.js");
const ExcelJS = require("exceljs");

// Temporary storage for analyzed data
const tempStorage = new Map();

/**
 * Extract table from PDF - WITH SMART CELL SPLITTING
 */
function extractTableFromPdf(text) {
  console.log("[EXTRACT] Starting table extraction...");

  // Split into lines
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 5);

  console.log(`[EXTRACT] Found ${lines.length} lines`);

  // Try Method 1: Structured tables (with clear separators)
  const structuredRows = lines.filter((line) => /\s{2,}|\t/.test(line));

  if (structuredRows.length >= 2) {
    console.log("[EXTRACT] Found structured table with separators");
    return extractStructuredTable(structuredRows);
  }

  // Method 2: Smart split for contact-like data (mashed together)
  console.log("[EXTRACT] No separators found, trying smart split...");
  return extractSmartSplit(lines);
}

/**
 * Extract structured table (with tabs or multiple spaces)
 */
function extractStructuredTable(lines) {
  const rows = lines.map((line) => {
    if (line.includes("\t")) {
      return line
        .split("\t")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      return line
        .split(/\s{2,}/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  });

  // Find most common column count
  const columnCounts = {};
  rows.forEach((row) => {
    columnCounts[row.length] = (columnCounts[row.length] || 0) + 1;
  });

  const mostCommon = parseInt(
    Object.keys(columnCounts).sort(
      (a, b) => columnCounts[b] - columnCounts[a]
    )[0]
  );

  const validRows = rows.filter((row) => row.length === mostCommon);

  return {
    columns: validRows[0],
    rows: validRows.slice(1),
  };
}

/**
 * Smart split for mashed-together data
 */
function extractSmartSplit(lines) {
  console.log("[EXTRACT] Using smart split for contact data...");

  // Skip header line if exists
  let dataLines = lines.filter((line) => {
    return line.length > 20 && !/^(name|address|phone|state)/i.test(line);
  });

  const rows = [];

  for (const line of dataLines) {
    const cells = smartSplitLine(line);
    if (cells) {
      rows.push(cells);
      console.log(
        `[EXTRACT] Split: "${line.substring(0, 50)}..." → ${cells.length} cells`
      );
    }
  }

  if (rows.length === 0) {
    throw new Error(
      "Could not extract any data. PDF might not be in a supported format."
    );
  }

  // Determine headers based on data
  const firstRow = rows[0];
  let columns;

  if (firstRow.length === 3 && /\+?\d/.test(firstRow[2])) {
    columns = ["Name", "Address", "Phone"];
  } else if (firstRow.length === 4) {
    columns = ["Column 1", "Column 2", "Column 3", "Column 4"];
  } else {
    columns = firstRow.map((_, i) => `Column ${i + 1}`);
  }

  console.log(`[EXTRACT] Headers:`, columns);
  console.log(`[EXTRACT] Data rows: ${rows.length}`);

  return { columns, rows };
}

/**
 * Split a single line intelligently
 */
function smartSplitLine(line) {
  // Pattern 1: Find phone number (most reliable anchor)
  const phonePattern = /(\+\d{1,4}[-\s]?\d{3,4}[-\s]?\d{4,})/;
  const phoneMatch = line.match(phonePattern);

  if (phoneMatch) {
    const phone = phoneMatch[0].trim();
    const beforePhone = line.substring(0, line.indexOf(phone)).trim();

    // Split name and address by finding first digit
    const firstDigit = beforePhone.search(/\d/);

    if (firstDigit > 0) {
      const name = beforePhone.substring(0, firstDigit).trim();
      const address = beforePhone.substring(firstDigit).trim();
      return [name, address, phone];
    }

    // Fallback: split by multiple spaces
    if (beforePhone.includes("  ")) {
      const parts = beforePhone.split(/\s{2,}/);
      return [parts[0].trim(), parts.slice(1).join(" ").trim(), phone];
    }

    // Last resort: first 2 words = name
    const words = beforePhone.split(/\s+/);
    if (words.length >= 3) {
      return [words.slice(0, 2).join(" "), words.slice(2).join(" "), phone];
    }

    return [beforePhone, "", phone];
  }

  // Pattern 2: Split by tabs or multiple spaces
  if (/\t|\s{3,}/.test(line)) {
    return line
      .split(/\t|\s{3,}/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Pattern 3: Split by commas (CSV-like)
  if (line.split(",").length >= 3) {
    return line
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return null;
}

/**
 * Step 1: Analyze PDF
 */
const analyzePdf = async (req, res) => {
  let pdfPath = null;

  try {
    console.log("\n" + "=".repeat(50));
    console.log("STEP 1: ANALYZE PDF");
    console.log("=".repeat(50));

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
      });
    }

    pdfPath = req.file.path;
    console.log(`[INFO] File: ${req.file.originalname}`);
    console.log(`[INFO] Size: ${(req.file.size / 1024).toFixed(2)} KB`);

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "No text found in PDF",
      });
    }

    console.log(`[INFO] Extracted ${text.length} characters`);

    // Extract table
    const { columns, rows } = extractTableFromPdf(text);

    // Generate analysis ID
    const analysisId = `analysis_${Date.now()}`;

    // Store data (expires in 10 minutes)
    tempStorage.set(analysisId, {
      columns,
      allRows: rows,
      timestamp: Date.now(),
    });

    // Clean up PDF
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    console.log("=".repeat(50));
    console.log(`✅ ANALYSIS COMPLETE`);
    console.log(`Columns: ${columns.length}`);
    console.log(`Rows: ${rows.length}`);
    console.log("=".repeat(50) + "\n");

    // Return preview
    res.status(200).json({
      success: true,
      message: "PDF analyzed successfully",
      data: {
        analysisId,
        columns,
        sampleRows: rows.slice(0, 5),
        totalRows: rows.length,
      },
    });
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);

    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze PDF",
      hint: "Make sure your PDF contains a table with clear column structure",
    });
  }
};

/**
 * Step 2: Generate Excel with selected columns
 */
const generateExcel = async (req, res) => {
  try {
    console.log("\n" + "=".repeat(50));
    console.log("STEP 2: GENERATE EXCEL");
    console.log("=".repeat(50));

    const { analysisId, selectedColumns } = req.body;

    if (!analysisId || !selectedColumns || !Array.isArray(selectedColumns)) {
      return res.status(400).json({
        success: false,
        message: "Missing analysisId or selectedColumns",
      });
    }

    // Retrieve stored data
    const stored = tempStorage.get(analysisId);
    if (!stored) {
      return res.status(404).json({
        success: false,
        message: "Session expired. Please upload PDF again.",
      });
    }

    const { columns, allRows } = stored;

    console.log(`[INFO] Creating Excel with ${selectedColumns.length} columns`);

    // Filter columns
    const selectedIndices = selectedColumns.map((col) => columns.indexOf(col));
    const filteredRows = allRows.map((row) =>
      selectedIndices.map((idx) => row[idx] || "")
    );

    // Create Excel file
    const fileName = `converted_${Date.now()}.xlsx`;
    const outputPath = path.join(__dirname, "../uploads", fileName);

    await createExcel(selectedColumns, filteredRows, outputPath);

    // Clean up temp storage
    tempStorage.delete(analysisId);

    console.log("=".repeat(50));
    console.log(`✅ EXCEL CREATED`);
    console.log(`File: ${fileName}`);
    console.log(`Rows: ${filteredRows.length}`);
    console.log("=".repeat(50) + "\n");

    res.status(200).json({
      success: true,
      message: "Excel generated successfully",
      downloadUrl: `/uploads/${fileName}`,
      stats: {
        totalRows: filteredRows.length,
        columns: selectedColumns.length,
        fileName,
      },
    });
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate Excel",
    });
  }
};

/**
 * Create Excel file
 */
async function createExcel(headers, rows, outputPath) {
  console.log("[EXCEL] Creating file...");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Add headers
  const headerRow = worksheet.addRow(headers);
  headerRow.height = 25;
  headerRow.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4472C4" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  // Add data
  rows.forEach((row, i) => {
    const dataRow = worksheet.addRow(row);
    if (i % 2 === 0) {
      dataRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF2F2F2" },
        };
      });
    }
  });

  // Auto-size columns
  worksheet.columns.forEach((col, i) => {
    let maxLength = headers[i]?.length || 10;
    rows.forEach((row) => {
      maxLength = Math.max(maxLength, (row[i]?.toString() || "").length);
    });
    col.width = Math.min(Math.max(maxLength + 2, 12), 50);
  });

  await workbook.xlsx.writeFile(outputPath);
  console.log("[EXCEL] ✓ Saved\n");
}

/**
 * Download Excel
 */
const downloadExcel = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.download(filePath, "data.xlsx");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Download failed",
    });
  }
};

// Clean up expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of tempStorage.entries()) {
    if (now - data.timestamp > 10 * 60 * 1000) {
      // 10 minutes
      tempStorage.delete(id);
      console.log(`[CLEANUP] Removed expired session: ${id}`);
    }
  }
}, 5 * 60 * 1000);

console.log("✅ Simple PDF to Excel Controller loaded");

module.exports = {
  analyzePdf,
  generateExcel,
  downloadExcel,
};
