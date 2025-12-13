import React, { useState } from "react";
import {
  FileUp,
  Download,
  AlertCircle,
  CheckCircle,
  Wrench,
  XCircle,
} from "lucide-react";

const PDFRepairTool = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [diagnostics, setDiagnostics] = useState([]);
  const [repairedPdfUrl, setRepairedPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const analyzePDF = async (arrayBuffer) => {
    const issues = [];
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdfString = new TextDecoder("latin1").decode(uint8Array);

    // Check for PDF header
    if (!pdfString.startsWith("%PDF-")) {
      issues.push({
        type: "error",
        message: "Missing or corrupted PDF header",
      });
    } else {
      issues.push({ type: "success", message: "PDF header found" });
    }

    // Check for EOF marker
    if (!pdfString.includes("%%EOF")) {
      issues.push({ type: "warning", message: "Missing EOF marker" });
    } else {
      issues.push({ type: "success", message: "EOF marker found" });
    }

    // Check for xref table
    if (!pdfString.includes("xref")) {
      issues.push({ type: "error", message: "Missing cross-reference table" });
    } else {
      issues.push({ type: "success", message: "Cross-reference table found" });
    }

    // Check for trailer
    if (!pdfString.includes("trailer")) {
      issues.push({ type: "warning", message: "Missing trailer dictionary" });
    } else {
      issues.push({ type: "success", message: "Trailer dictionary found" });
    }

    // Check file size
    const sizeKB = (arrayBuffer.byteLength / 1024).toFixed(2);
    issues.push({ type: "info", message: `File size: ${sizeKB} KB` });

    return issues;
  };

  const repairPDF = async (arrayBuffer) => {
    try {
      let uint8Array = new Uint8Array(arrayBuffer);
      let modified = false;

      // Convert to string for manipulation
      let pdfString = new TextDecoder("latin1").decode(uint8Array);

      // Repair 1: Fix PDF header if missing or corrupted
      if (!pdfString.startsWith("%PDF-")) {
        pdfString = "%PDF-1.4\n" + pdfString;
        modified = true;
      }

      // Repair 2: Ensure EOF marker exists
      if (!pdfString.trim().endsWith("%%EOF")) {
        pdfString = pdfString.trim() + "\n%%EOF";
        modified = true;
      }

      // Repair 3: Remove null bytes and other problematic characters
      const cleanedString = pdfString.replace(/\0/g, "");
      if (cleanedString.length !== pdfString.length) {
        pdfString = cleanedString;
        modified = true;
      }

      // Repair 4: Fix common encoding issues in text
      pdfString = pdfString.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

      // Repair 5: Try to fix basic structure issues
      if (!pdfString.includes("startxref")) {
        // Add a basic startxref if missing
        const lastXref = pdfString.lastIndexOf("xref");
        if (lastXref !== -1) {
          pdfString += `\nstartxref\n${lastXref}\n%%EOF`;
          modified = true;
        }
      }

      if (!modified) {
        return arrayBuffer;
      }

      // Convert back to ArrayBuffer
      const encoder = new TextEncoder();
      const utf8Array = encoder.encode(pdfString);

      // For PDF, we need to preserve binary data, so use latin1
      const latin1Array = new Uint8Array(pdfString.length);
      for (let i = 0; i < pdfString.length; i++) {
        latin1Array[i] = pdfString.charCodeAt(i) & 0xff;
      }

      return latin1Array.buffer;
    } catch (err) {
      throw new Error(`Repair failed: ${err.message}`);
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setFile(uploadedFile);
    setStatus("analyzing");
    setError(null);
    setDiagnostics([]);
    setRepairedPdfUrl(null);

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();

      // Analyze the PDF
      const issues = await analyzePDF(arrayBuffer);
      setDiagnostics(issues);

      // Attempt repair
      setStatus("repairing");
      const repairedBuffer = await repairPDF(arrayBuffer);

      // Create download URL
      const blob = new Blob([repairedBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setRepairedPdfUrl(url);

      setStatus("complete");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!repairedPdfUrl) return;

    const link = document.createElement("a");
    link.href = repairedPdfUrl;
    link.download = `repaired_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFile(null);
    setStatus("idle");
    setDiagnostics([]);
    setError(null);
    if (repairedPdfUrl) {
      URL.revokeObjectURL(repairedPdfUrl);
      setRepairedPdfUrl(null);
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Wrench className="w-8 h-8" />
              <h1 className="text-3xl font-bold">PDF Repair Tool</h1>
            </div>
            <p className="text-blue-100">
              Upload a corrupted PDF file and we'll attempt to repair it
            </p>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {status === "idle" && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <FileUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Upload PDF File
                  </p>
                  <p className="text-gray-500">
                    Click to browse or drag and drop your corrupted PDF here
                  </p>
                </label>
              </div>
            )}

            {status === "analyzing" && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg font-semibold text-gray-700">
                  Analyzing PDF...
                </p>
              </div>
            )}

            {status === "repairing" && (
              <div className="text-center py-12">
                <div className="animate-pulse">
                  <Wrench className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  Repairing PDF...
                </p>
              </div>
            )}

            {status === "complete" && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">
                      Repair Complete
                    </h3>
                  </div>
                  <p className="text-green-700">
                    Your PDF has been processed. Download the repaired version
                    below.
                  </p>
                </div>

                {/* Diagnostics */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Diagnostic Report
                  </h3>
                  <div className="space-y-3">
                    {diagnostics.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {getStatusIcon(item.type)}
                        <p className="text-sm text-gray-700">{item.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download Repaired PDF
                  </button>
                  <button
                    onClick={resetTool}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Upload Another
                  </button>
                </div>
              </div>
            )}

            {status === "error" && error && (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-900">
                      Error Occurred
                    </h3>
                  </div>
                  <p className="text-red-700">{error}</p>
                </div>

                {diagnostics.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Diagnostic Report
                    </h3>
                    <div className="space-y-3">
                      {diagnostics.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {getStatusIcon(item.type)}
                          <p className="text-sm text-gray-700">
                            {item.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={resetTool}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Try Another File
                </button>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-gray-700">
                What this tool can repair:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Missing or corrupted PDF headers</li>
                <li>Missing EOF markers</li>
                <li>Null bytes and problematic characters</li>
                <li>Basic structural issues</li>
                <li>Line ending inconsistencies</li>
              </ul>
              <p className="mt-4 text-xs text-gray-500">
                Note: Severely corrupted PDFs with missing content or damaged
                object streams may require professional recovery tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFRepairTool;
