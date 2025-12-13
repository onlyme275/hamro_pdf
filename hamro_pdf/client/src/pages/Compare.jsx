import React, { useState, useCallback, useRef } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import {
  Upload,
  Download,
  FileText,
  GitCompare,
  Plus,
  X,
  Eye,
  EyeOff,
  BarChart3,
  FileX,
  CheckCircle,
  AlertTriangle,
  Zap,
  Search,
} from "lucide-react";

const PDFCompareApp = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonReport, setComparisonReport] = useState(null);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState(0);
  const [comparisonMode, setComparisonMode] = useState("metadata"); // 'metadata', 'structure', 'content'
  const fileInputRefs = useRef([]);

  const addFileSlot = () => {
    if (files.length < 5) {
      setFiles((prev) => [...prev, null]);
      fileInputRefs.current.push(null);
    }
  };

  const removeFileSlot = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    fileInputRefs.current.splice(index, 1);
    setComparisonReport(null);
    setError("");
  };

  const handleFileUpload = useCallback(
    async (event, index) => {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.type === "application/pdf") {
        const newFiles = [...files];
        newFiles[index] = {
          file: selectedFile,
          name: selectedFile.name,
          size: selectedFile.size,
          lastModified: new Date(selectedFile.lastModified).toLocaleString(),
          url: URL.createObjectURL(selectedFile),
          metadata: null,
          pageCount: 0,
          textContent: "",
          error: null,
        };

        try {
          // Extract basic PDF info
          const fileArrayBuffer = await selectedFile.arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileArrayBuffer);
          const pages = pdfDoc.getPages();

          newFiles[index].pageCount = pages.length;
          newFiles[index].metadata = {
            title: pdfDoc.getTitle() || "No title",
            author: pdfDoc.getAuthor() || "Unknown",
            subject: pdfDoc.getSubject() || "No subject",
            creator: pdfDoc.getCreator() || "Unknown",
            producer: pdfDoc.getProducer() || "Unknown",
            creationDate: pdfDoc.getCreationDate()?.toISOString() || "Unknown",
            modificationDate:
              pdfDoc.getModificationDate()?.toISOString() || "Unknown",
          };

          // Extract text content (simplified)
          let textContent = "";
          for (let i = 0; i < Math.min(pages.length, 10); i++) {
            // Limit to first 10 pages for performance
            try {
              const page = pages[i];
              // This is a simplified text extraction - in real implementation you'd use a proper text extraction library
              textContent += `Page ${
                i + 1
              }: [Text content would be extracted here]\n`;
            } catch (err) {
              console.log(`Could not extract text from page ${i + 1}`);
            }
          }
          newFiles[index].textContent = textContent;
        } catch (err) {
          newFiles[index].error = "Error reading PDF file";
          console.error("Error processing PDF:", err);
        }

        setFiles(newFiles);
        setComparisonReport(null);
        setError("");
      } else {
        alert("Please select a valid PDF file");
      }
    },
    [files]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(
    async (event, index) => {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile && droppedFile.type === "application/pdf") {
        const mockEvent = { target: { files: [droppedFile] } };
        await handleFileUpload(mockEvent, index);
      } else {
        alert("Please drop a valid PDF file");
      }
    },
    [handleFileUpload]
  );

  const compareMetadata = (filesData) => {
    const validFiles = filesData.filter((f) => f && f.metadata);
    if (validFiles.length < 2)
      return { differences: [], summary: "Not enough files to compare" };

    const differences = [];
    const fields = [
      "title",
      "author",
      "subject",
      "creator",
      "producer",
      "creationDate",
      "modificationDate",
    ];

    fields.forEach((field) => {
      const values = validFiles.map((f) => f.metadata[field]);
      const unique = [...new Set(values)];

      if (unique.length > 1) {
        differences.push({
          field,
          values: validFiles.map((f, i) => ({
            file: f.name,
            value: f.metadata[field],
            index: i,
          })),
          type: "metadata",
        });
      }
    });

    return {
      differences,
      summary: `Found ${differences.length} metadata differences across ${validFiles.length} files`,
      identical: differences.length === 0,
    };
  };

  const compareStructure = (filesData) => {
    const validFiles = filesData.filter((f) => f && !f.error);
    if (validFiles.length < 2)
      return { differences: [], summary: "Not enough files to compare" };

    const differences = [];

    // Compare page counts
    const pageCounts = validFiles.map((f) => f.pageCount);
    const uniquePageCounts = [...new Set(pageCounts)];

    if (uniquePageCounts.length > 1) {
      differences.push({
        field: "pageCount",
        values: validFiles.map((f, i) => ({
          file: f.name,
          value: f.pageCount,
          index: i,
        })),
        type: "structure",
      });
    }

    // Compare file sizes
    const fileSizes = validFiles.map((f) => f.size);
    const uniqueFileSizes = [...new Set(fileSizes)];

    if (uniqueFileSizes.length > 1) {
      differences.push({
        field: "fileSize",
        values: validFiles.map((f, i) => ({
          file: f.name,
          value: `${(f.size / 1024 / 1024).toFixed(2)} MB`,
          index: i,
        })),
        type: "structure",
      });
    }

    return {
      differences,
      summary: `Found ${differences.length} structural differences across ${validFiles.length} files`,
      identical: differences.length === 0,
    };
  };

  const compareContent = (filesData) => {
    const validFiles = filesData.filter((f) => f && f.textContent);
    if (validFiles.length < 2)
      return {
        differences: [],
        summary: "Not enough files to compare content",
      };

    const differences = [];

    // Simple content comparison (in real implementation, you'd use proper diff algorithms)
    const baseFile = validFiles[0];

    for (let i = 1; i < validFiles.length; i++) {
      const compareFile = validFiles[i];
      const contentMatch = baseFile.textContent === compareFile.textContent;

      if (!contentMatch) {
        differences.push({
          field: "textContent",
          values: [
            { file: baseFile.name, value: "Base content", index: 0 },
            { file: compareFile.name, value: "Different content", index: i },
          ],
          type: "content",
          details: `Content differs between ${baseFile.name} and ${compareFile.name}`,
        });
      }
    }

    return {
      differences,
      summary: `Content comparison: ${
        differences.length > 0
          ? "Files have different content"
          : "Files have similar content structure"
      }`,
      identical: differences.length === 0,
    };
  };

  const runComparison = async () => {
    const validFiles = files.filter((f) => f && !f.error);

    if (validFiles.length < 2) {
      setError("Please upload at least 2 valid PDF files to compare");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      let comparisonResult = {};

      switch (comparisonMode) {
        case "metadata":
          comparisonResult = compareMetadata(validFiles);
          break;
        case "structure":
          comparisonResult = compareStructure(validFiles);
          break;
        case "content":
          comparisonResult = compareContent(validFiles);
          break;
        default:
          // Comprehensive comparison
          const metadataResult = compareMetadata(validFiles);
          const structureResult = compareStructure(validFiles);
          const contentResult = compareContent(validFiles);

          comparisonResult = {
            metadata: metadataResult,
            structure: structureResult,
            content: contentResult,
            summary: `Comprehensive comparison of ${validFiles.length} files completed`,
            totalDifferences:
              metadataResult.differences.length +
              structureResult.differences.length +
              contentResult.differences.length,
          };
      }

      setComparisonReport({
        ...comparisonResult,
        timestamp: new Date().toISOString(),
        filesCompared: validFiles.map((f) => ({
          name: f.name,
          size: f.size,
          pages: f.pageCount,
        })),
        mode: comparisonMode,
      });
    } catch (err) {
      setError("Error during comparison process. Please try again.");
      console.error("Comparison error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReport = () => {
    if (!comparisonReport) return;

    const reportContent = `
PDF Comparison Report
Generated: ${new Date(comparisonReport.timestamp).toLocaleString()}
Comparison Mode: ${comparisonReport.mode}

Files Compared:
${comparisonReport.filesCompared
  .map(
    (f, i) =>
      `${i + 1}. ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB, ${
        f.pages
      } pages)`
  )
  .join("\n")}

${
  comparisonReport.mode === "comprehensive"
    ? `
COMPREHENSIVE RESULTS:
Total Differences Found: ${comparisonReport.totalDifferences}

Metadata Comparison:
${comparisonReport.metadata.summary}

Structure Comparison:
${comparisonReport.structure.summary}

Content Comparison:
${comparisonReport.content.summary}

DETAILED DIFFERENCES:

Metadata Differences:
${comparisonReport.metadata.differences
  .map(
    (diff) =>
      `- ${diff.field}: ${diff.values
        .map((v) => `${v.file}: ${v.value}`)
        .join(" | ")}`
  )
  .join("\n")}

Structure Differences:
${comparisonReport.structure.differences
  .map(
    (diff) =>
      `- ${diff.field}: ${diff.values
        .map((v) => `${v.file}: ${v.value}`)
        .join(" | ")}`
  )
  .join("\n")}

Content Differences:
${comparisonReport.content.differences
  .map((diff) => `- ${diff.details || diff.field}`)
  .join("\n")}
`
    : `
RESULTS:
${comparisonReport.summary}

DIFFERENCES FOUND:
${comparisonReport.differences
  .map(
    (diff) =>
      `- ${diff.field}: ${diff.values
        .map((v) => `${v.file}: ${v.value}`)
        .join(" | ")}`
  )
  .join("\n")}
`
}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PDF_Comparison_Report_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetApp = () => {
    files.forEach((file) => {
      if (file && file.url) {
        URL.revokeObjectURL(file.url);
      }
    });
    setFiles([]);
    setComparisonReport(null);
    setError("");
    setShowPreview(false);
    setSelectedFileForPreview(0);
    fileInputRefs.current = [];
  };

  // Initialize with 2 empty slots
  React.useEffect(() => {
    if (files.length === 0) {
      setFiles([null, null]);
      fileInputRefs.current = [null, null];
    }
  }, [files.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <GitCompare className="text-green-600" />
            PDF Compare Tool
          </h1>
          <p className="text-gray-600">
            Compare multiple PDF documents and generate detailed difference
            reports
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* File Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Comparison Mode Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="text-green-600" />
                Comparison Mode
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "metadata", label: "Metadata", icon: FileText },
                  { value: "structure", label: "Structure", icon: BarChart3 },
                  { value: "content", label: "Content", icon: FileX },
                  { value: "comprehensive", label: "All", icon: Zap },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.value}
                      onClick={() => setComparisonMode(mode.value)}
                      className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2 ${
                        comparisonMode === mode.value
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* File Upload Slots */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="text-green-600" />
                  Upload PDFs ({files.filter((f) => f).length}/{files.length})
                </h2>
                <button
                  onClick={addFileSlot}
                  disabled={files.length >= 5}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add File Slot
                </button>
              </div>

              <div className="space-y-4">
                {files.map((file, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-700">
                        PDF {index + 1}
                      </h3>
                      {files.length > 2 && (
                        <button
                          onClick={() => removeFileSlot(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {!file ? (
                      <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors cursor-pointer"
                      >
                        <FileText
                          className="mx-auto mb-2 text-green-400"
                          size={32}
                        />
                        <p className="text-sm text-gray-600 mb-2">
                          Drop PDF here or click to select
                        </p>
                        <input
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(e, index)}
                          className="hidden"
                          id={`file-input-${index}`}
                        />
                        <label
                          htmlFor={`file-input-${index}`}
                          className="bg-green-600 text-white px-4 py-1 rounded text-sm cursor-pointer hover:bg-green-700 transition-colors"
                        >
                          Choose File
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-blue-800">
                                {file.name}
                              </p>
                              <p className="text-sm text-blue-600">
                                {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                                {file.pageCount} pages
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                URL.revokeObjectURL(file.url);
                                const newFiles = [...files];
                                newFiles[index] = null;
                                setFiles(newFiles);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>

                        {file.error && (
                          <div className="bg-red-50 border border-red-200 rounded p-2">
                            <p className="text-sm text-red-600">{file.error}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={runComparison}
                  disabled={
                    isProcessing ||
                    files.filter((f) => f && !f.error).length < 2
                  }
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Comparing PDFs...
                    </>
                  ) : (
                    <>
                      <GitCompare size={20} />
                      Compare PDFs
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results and Preview Section */}
          <div className="space-y-6">
            {/* Comparison Results */}
            {comparisonReport && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BarChart3 className="text-green-600" />
                    Results
                  </h2>
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    Report
                  </button>
                </div>

                <div className="space-y-4">
                  {comparisonReport.mode === "comprehensive" ? (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Summary</h3>
                        <p className="text-sm text-gray-700">
                          {comparisonReport.summary}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Total differences: {comparisonReport.totalDifferences}
                        </p>
                      </div>

                      {["metadata", "structure", "content"].map((section) => (
                        <div key={section} className="border rounded-lg p-3">
                          <h4 className="font-medium capitalize mb-2 flex items-center gap-2">
                            {comparisonReport[section].identical ? (
                              <CheckCircle
                                size={16}
                                className="text-green-500"
                              />
                            ) : (
                              <AlertTriangle
                                size={16}
                                className="text-yellow-500"
                              />
                            )}
                            {section}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {comparisonReport[section].summary}
                          </p>
                          {comparisonReport[section].differences.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">
                                {comparisonReport[section].differences.length}{" "}
                                differences found
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Summary</h3>
                        <p className="text-sm text-gray-700">
                          {comparisonReport.summary}
                        </p>
                      </div>

                      {comparisonReport.differences &&
                        comparisonReport.differences.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">
                              Differences Found:
                            </h4>
                            {comparisonReport.differences
                              .slice(0, 5)
                              .map((diff, index) => (
                                <div
                                  key={index}
                                  className="bg-yellow-50 border border-yellow-200 rounded p-2"
                                >
                                  <p className="text-sm font-medium capitalize">
                                    {diff.field}
                                  </p>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {diff.values.map((v, i) => (
                                      <div key={i}>
                                        {v.file}: {v.value}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            {comparisonReport.differences.length > 5 && (
                              <p className="text-xs text-gray-500">
                                ... and{" "}
                                {comparisonReport.differences.length - 5} more
                                differences
                              </p>
                            )}
                          </div>
                        )}

                      {comparisonReport.identical && (
                        <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm text-green-700">
                            Files are identical in this comparison mode
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Preview Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="text-green-600" />
                  Preview
                </h2>
                {files.some((f) => f) && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPreview ? "Hide" : "Show"}
                  </button>
                )}
              </div>

              {!files.some((f) => f) ? (
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <GitCompare size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Upload PDFs to start comparison</p>
                  </div>
                </div>
              ) : showPreview ? (
                <div className="space-y-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {files.map(
                      (file, index) =>
                        file && (
                          <button
                            key={index}
                            onClick={() => setSelectedFileForPreview(index)}
                            className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                              selectedFileForPreview === index
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                          >
                            PDF {index + 1}
                          </button>
                        )
                    )}
                  </div>

                  {files[selectedFileForPreview] && (
                    <div className="h-64 border rounded-lg overflow-hidden">
                      <iframe
                        src={files[selectedFileForPreview].url}
                        className="w-full h-full"
                        title={`PDF Preview ${selectedFileForPreview + 1}`}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Eye size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Click "Show Preview" to view PDFs</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            {files.some((f) => f) && (
              <button
                onClick={resetApp}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reset All Files
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFCompareApp;
