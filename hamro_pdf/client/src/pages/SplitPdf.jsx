// client/src/pages/SplitPdf.jsx
import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFSplitterPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitMode, setSplitMode] = useState("pages");
  const [pageRanges, setPageRanges] = useState("");
  const [specificPages, setSpecificPages] = useState("");
  const [pagesPerChunk, setPagesPerChunk] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(async (files) => {
    const file = files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setPdfDocument(pdf);
        setTotalPages(pdf.getPageCount());
      } catch (error) {
        console.error("Error loading PDF:", error);
        alert("Error loading PDF. Please ensure the file is a valid PDF document.");
        setSelectedFile(null);
        setPdfDocument(null);
        setTotalPages(0);
      }
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFileSelect(files);
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

  const parsePageNumbers = (input) => {
    const pages = [];
    const parts = input.split(",");

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) if (i >= 1 && i <= totalPages) pages.push(i - 1);
        }
      } else {
        const pageNum = parseInt(trimmed);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) pages.push(pageNum - 1);
      }
    }
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const downloadPDF = async (pages, filename) => {
    try {
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDocument, pages);
      copiedPages.forEach((p) => newPdf.addPage(p));
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating PDF:", error);
      throw error;
    }
  };

  const splitPDF = async () => {
    if (!pdfDocument || !selectedFile) {
      alert("Please select a PDF file first");
      return;
    }

    setIsProcessing(true);
    try {
      const baseName = selectedFile.name.replace(".pdf", "");
      switch (splitMode) {
        case "individual":
          for (let i = 0; i < totalPages; i++) await downloadPDF([i], `${baseName}_page_${i + 1}.pdf`);
          break;

        case "pages":
          if (!specificPages.trim()) return alert("Please enter page numbers to extract");
          const pagesToExtract = parsePageNumbers(specificPages);
          if (pagesToExtract.length === 0) return alert("No valid page numbers found");
          await downloadPDF(pagesToExtract, `${baseName}_pages_${specificPages.replace(/[,\s-]/g, "_")}.pdf`);
          break;

        case "ranges":
          if (!pageRanges.trim()) return alert("Please enter page ranges");
          const ranges = pageRanges.split(";").map((r) => r.trim()).filter(Boolean);
          for (let i = 0; i < ranges.length; i++) {
            const pages = parsePageNumbers(ranges[i]);
            if (pages.length > 0) await downloadPDF(pages, `${baseName}_range_${i + 1}.pdf`);
          }
          break;

        case "chunks":
          const chunkSize = parseInt(pagesPerChunk);
          if (isNaN(chunkSize) || chunkSize < 1) return alert("Please enter a valid number of pages per chunk");
          for (let i = 0; i < totalPages; i += chunkSize) {
            const endPage = Math.min(i + chunkSize - 1, totalPages - 1);
            const pages = [];
            for (let j = i; j <= endPage; j++) pages.push(j);
            await downloadPDF(pages, `${baseName}_chunk_${Math.floor(i / chunkSize) + 1}.pdf`);
          }
          break;

        default:
          alert("Please select a split mode");
          return;
      }
      alert("PDF split successfully! Check your downloads.");
    } catch (error) {
      console.error(error);
      alert("Error splitting PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPdfDocument(null);
    setTotalPages(0);
    setPageRanges("");
    setSpecificPages("");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Split PDF</h1>
          <p className="text-gray-600 mt-2 text-lg">Easily split your PDF into separate files</p>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg bg-white p-10 text-center transition-all duration-300 shadow-sm ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📄</div>
            <h3 className="text-xl font-semibold text-gray-700">Drop a PDF file here or click below</h3>
            <p className="text-gray-500 text-sm">Supports only PDF files</p>
            <label className="inline-block">
              <input type="file" accept=".pdf,application/pdf" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md cursor-pointer transition-colors">
                Browse PDF
              </span>
            </label>
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Selected File</h3>
              <button onClick={clearFile} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </div>
            <div className="flex items-center space-x-4 bg-gray-50 rounded-md p-4">
              <div className="text-red-500 text-3xl">📄</div>
              <div>
                <p className="font-medium text-gray-800">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)} • {totalPages} pages</p>
              </div>
            </div>
          </div>
        )}

        {/* Split Options */}
        {selectedFile && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Choose Split Mode</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: "pages", title: "Extract Pages", desc: "Choose specific pages to extract" },
                { value: "ranges", title: "Split by Ranges", desc: "Split into multiple PDFs using ranges" },
                { value: "individual", title: "Each Page Separately", desc: "Create individual PDFs for each page" },
                { value: "chunks", title: "Split in Chunks", desc: "Divide into fixed-size chunks" },
              ].map((m) => (
                <label
                  key={m.value}
                  className={`flex items-start space-x-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50 ${
                    splitMode === m.value ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="splitMode"
                    value={m.value}
                    checked={splitMode === m.value}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{m.title}</div>
                    <div className="text-sm text-gray-500">{m.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Mode Specific Inputs */}
            {splitMode === "pages" && (
              <div className="mt-6">
                <label className="block">
                  <span className="font-medium text-gray-700">Pages to Extract</span>
                  <input
                    type="text"
                    value={specificPages}
                    onChange={(e) => setSpecificPages(e.target.value)}
                    placeholder="e.g. 1,3,5-8"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate pages with commas. Use dash for ranges.</p>
                </label>
              </div>
            )}

            {splitMode === "ranges" && (
              <div className="mt-6">
                <label className="block">
                  <span className="font-medium text-gray-700">Page Ranges</span>
                  <input
                    type="text"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="e.g. 1-5; 6-10; 11-15"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate each range with a semicolon (;).</p>
                </label>
              </div>
            )}

            {splitMode === "chunks" && (
              <div className="mt-6">
                <label className="block">
                  <span className="font-medium text-gray-700">Pages per Chunk</span>
                  <input
                    type="number"
                    value={pagesPerChunk}
                    onChange={(e) => setPagesPerChunk(e.target.value)}
                    min="1"
                    max={totalPages}
                    className="mt-2 w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Specify how many pages each chunk should have.</p>
                </label>
              </div>
            )}

            {splitMode === "individual" && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
                This will create {totalPages} separate PDF files — one for each page.
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {selectedFile && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8 text-center space-x-4">
            <button
              onClick={clearFile}
              disabled={isProcessing}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              Clear File
            </button>
            <button
              onClick={splitPDF}
              disabled={isProcessing}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  ✂️ <span>Split PDF</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
