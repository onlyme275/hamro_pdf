// client/src/pages/RotatePdf.jsx
import { useState, useCallback, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Upload,
  Download,
  FileText,
  RotateCw,
  RotateCcw,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PDFRotateApp = () => {
  const [file, setFile] = useState(null);
  const [rotatedPdf, setRotatedPdf] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageRotations, setPageRotations] = useState({});
  const [currentPreviewPage, setCurrentPreviewPage] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [previewPdf, setPreviewPdf] = useState(null);

  const handleFileUpload = useCallback(async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setRotatedPdf(null);
      setShowPreview(false);

      try {
        // Get page count
        const fileArrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileArrayBuffer);
        const pages = pdfDoc.getPages();
        setPageCount(pages.length);

        // Initialize rotations to 0 for all pages
        const initialRotations = {};
        for (let i = 1; i <= pages.length; i++) {
          initialRotations[i] = 0;
        }
        setPageRotations(initialRotations);
        setCurrentPreviewPage(1);

        // Create preview URL
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error reading PDF:", error);
        alert("Error reading PDF file. Please try again.");
      }
    } else {
      alert("Please select a valid PDF file");
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setRotatedPdf(null);
      setShowPreview(false);

      try {
        const fileArrayBuffer = await droppedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileArrayBuffer);
        const pages = pdfDoc.getPages();
        setPageCount(pages.length);

        const initialRotations = {};
        for (let i = 1; i <= pages.length; i++) {
          initialRotations[i] = 0;
        }
        setPageRotations(initialRotations);
        setCurrentPreviewPage(1);

        const url = URL.createObjectURL(droppedFile);
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error reading PDF:", error);
        alert("Error reading PDF file. Please try again.");
      }
    } else {
      alert("Please drop a valid PDF file");
    }
  }, []);

  const rotatePage = (pageNumber, degrees) => {
    setPageRotations((prev) => ({
      ...prev,
      [pageNumber]: (prev[pageNumber] + degrees) % 360,
    }));
    setRotatedPdf(null); // Reset processed PDF when rotations change
  };

  const rotateAllPages = (degrees) => {
    const newRotations = {};
    for (let i = 1; i <= pageCount; i++) {
      newRotations[i] = (pageRotations[i] + degrees) % 360;
    }
    setPageRotations(newRotations);
    setRotatedPdf(null);
  };

  const resetAllRotations = () => {
    const resetRotations = {};
    for (let i = 1; i <= pageCount; i++) {
      resetRotations[i] = 0;
    }
    setPageRotations(resetRotations);
    setRotatedPdf(null);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const applyRotations = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const fileArrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const pageNumber = index + 1;
        const rotation = pageRotations[pageNumber];
        if (rotation !== 0) {
          page.setRotation({ type: "degrees", angle: rotation });
        }
      });

      const pdfBytes = await pdfDoc.save();
      setRotatedPdf(pdfBytes);
    } catch (error) {
      console.error("Error rotating PDF:", error);
      alert("Error processing PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadRotatedPdf = () => {
    if (!rotatedPdf) return;

    const blob = new Blob([rotatedPdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rotated_${file?.name || "document.pdf"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetApp = () => {
    setFile(null);
    setRotatedPdf(null);
    setPageCount(0);
    setPageRotations({});
    setCurrentPreviewPage(1);
    setShowPreview(false);
    setSelectAll(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const hasRotations = Object.values(pageRotations).some(
    (rotation) => rotation !== 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <RotateCw className="text-purple-600" />
            PDF Rotation Tool
          </h1>
          <p className="text-gray-600">
            Rotate individual pages or entire PDF documents
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upload and Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="text-purple-600" />
                Upload PDF
              </h2>

              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                >
                  <FileText
                    className="mx-auto mb-4 text-purple-400"
                    size={48}
                  />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your PDF file here, or click to select
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
                  >
                    Choose File
                  </label>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-green-800">{file.name}</p>
                      <p className="text-sm text-green-600">
                        {pageCount} pages •{" "}
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={resetApp}
                      className="text-red-600 hover:text-red-700 px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Global Controls */}
            {file && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <RefreshCw className="text-purple-600" />
                  Bulk Actions
                </h2>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => rotateAllPages(90)}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <RotateCw size={16} />
                      Rotate All 90°
                    </button>
                    <button
                      onClick={() => rotateAllPages(-90)}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <RotateCcw size={16} />
                      Rotate All -90°
                    </button>
                  </div>

                  <button
                    onClick={resetAllRotations}
                    disabled={!hasRotations}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Reset All Rotations
                  </button>

                  <button
                    onClick={applyRotations}
                    disabled={isProcessing || !hasRotations}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <RotateCw size={20} />
                        Apply Rotations
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Download */}
            {rotatedPdf && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Download className="text-green-600" />
                  Download
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium">
                    ✅ Rotations applied successfully!
                  </p>
                  <p className="text-sm text-green-600">
                    Your PDF is ready for download.
                  </p>
                </div>

                <button
                  onClick={downloadRotatedPdf}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Rotated PDF
                </button>
              </div>
            )}
          </div>

          {/* Page Controls */}
          {file && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="text-purple-600" />
                  Page Controls
                </h2>

                <div className="max-h-96 overflow-y-auto space-y-3">
                  {Array.from({ length: pageCount }, (_, index) => {
                    const pageNumber = index + 1;
                    const rotation = pageRotations[pageNumber] || 0;

                    return (
                      <div key={pageNumber} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">
                            Page {pageNumber}
                          </span>
                          <span className="text-sm text-gray-500">
                            {rotation}°
                          </span>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => rotatePage(pageNumber, -90)}
                            className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded text-sm transition-colors"
                          >
                            <RotateCcw size={14} />
                            -90°
                          </button>
                          <button
                            onClick={() => rotatePage(pageNumber, 90)}
                            className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded text-sm transition-colors"
                          >
                            <RotateCw size={14} />
                            +90°
                          </button>
                          <button
                            onClick={() =>
                              setPageRotations((prev) => ({
                                ...prev,
                                [pageNumber]: 0,
                              }))
                            }
                            disabled={rotation === 0}
                            className="flex-1 bg-red-100 hover:bg-red-200 disabled:bg-gray-50 disabled:text-gray-400 py-1 px-2 rounded text-sm transition-colors"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="text-purple-600" />
                  Preview
                </h2>
                {previewUrl && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPreview ? "Hide" : "Show"}
                  </button>
                )}
              </div>

              {!file ? (
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Upload a PDF to see preview</p>
                  </div>
                </div>
              ) : showPreview && previewUrl ? (
                <div>
                  <div className="h-80 border rounded-lg overflow-hidden mb-4 flex items-center justify-center bg-gray-50">
                    <div
                      style={{
                        transform: `rotate(${
                          pageRotations[currentPreviewPage] || 0
                        }deg)`,
                        transition: "transform 0.3s ease-in-out",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <iframe
                        src={`${previewUrl}#page=${currentPreviewPage}&view=FitH`}
                        className="w-full h-full border-0"
                        title="PDF Preview"
                        style={{
                          maxWidth:
                            pageRotations[currentPreviewPage] % 180 !== 0
                              ? "70%"
                              : "100%",
                          maxHeight:
                            pageRotations[currentPreviewPage] % 180 !== 0
                              ? "70%"
                              : "100%",
                        }}
                      />
                    </div>
                  </div>

                  {pageCount > 1 && (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() =>
                          setCurrentPreviewPage(
                            Math.max(1, currentPreviewPage - 1)
                          )
                        }
                        disabled={currentPreviewPage === 1}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>

                      <span className="text-sm text-gray-600">
                        Page {currentPreviewPage} of {pageCount}
                        {pageRotations[currentPreviewPage] !== 0 && (
                          <span className="ml-2 text-purple-600 font-medium">
                            ({pageRotations[currentPreviewPage]}°)
                          </span>
                        )}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPreviewPage(
                            Math.min(pageCount, currentPreviewPage + 1)
                          )
                        }
                        disabled={currentPreviewPage === pageCount}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  <div className="mt-3 text-center">
                    <div className="text-xs text-gray-500">
                      Real-time preview • Rotations:{" "}
                      {
                        Object.values(pageRotations).filter((r) => r !== 0)
                          .length
                      }{" "}
                      pages modified
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Eye size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Click "Show Preview" to view your PDF</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFRotateApp;
