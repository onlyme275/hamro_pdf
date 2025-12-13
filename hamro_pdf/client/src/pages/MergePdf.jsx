// client/src/pages/MergePdf.jsx
import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFMergerPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((files) => {
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );
    setSelectedFiles((prev) => [...prev, ...pdfFiles]);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex, toIndex) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      const [moved] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, moved);
      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (selectedFiles.length < 2) {
      alert("Please select at least 2 PDF files to merge");
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged-document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error merging PDFs:", err);
      alert("Error merging PDFs. Please check your files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            Merge PDF Files
          </h1>
          <p className="text-gray-600">
            Combine multiple PDF files into a single document quickly and easily.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="text-6xl text-gray-400">📄</div>
            <h3 className="text-lg font-medium text-gray-800">
              Select PDF Files
            </h3>
            <p className="text-gray-500 text-sm">
              or drag and drop your PDF files here
            </p>
            <label>
              <input
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md cursor-pointer transition-colors">
                Choose PDF Files
              </span>
            </label>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selected Files ({selectedFiles.length})
            </h2>
            <div className="space-y-3">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border rounded-lg px-4 py-2 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <span className="text-red-500 text-xl">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">#{idx + 1}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => idx > 0 && moveFile(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() =>
                        idx < selectedFiles.length - 1 &&
                        moveFile(idx, idx + 1)
                      }
                      disabled={idx === selectedFiles.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-40"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeFile(idx)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSelectedFiles([])}
                disabled={isProcessing}
                className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={mergePDFs}
                disabled={selectedFiles.length < 2 || isProcessing}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Merging...</span>
                  </>
                ) : (
                  <span>Merge PDFs</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
