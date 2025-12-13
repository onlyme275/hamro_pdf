// client/src/pages/PageNumberPdf.jsx
import { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FileText, UploadCloud } from "lucide-react";

export default function PDFPageNumber() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [position, setPosition] = useState("center");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInputRef.current.files = dataTransfer.files;
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const addPageNumbers = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file first.");
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      pages.forEach((page, index) => {
        const { width } = page.getSize();
        const pageNumber = `${index + 1} / ${totalPages}`;
        const textWidth = font.widthOfTextAtSize(pageNumber, 12);
        let x = position === "left" ? 30 : position === "center" ? width / 2 - textWidth / 2 : width - textWidth - 30;

        page.drawText(pageNumber, { x, y: 20, size: 12, font, color: rgb(0, 0, 0) });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "numbered-document.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to add page numbers. Make sure your file is a valid PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FileText className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              PDF <span className="text-blue-600">Page Numbers</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Upload a PDF and insert page numbers at your preferred position.
          </p>
        </div>

        {/* Drag & Drop / File Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 w-full text-center transition ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
          } mb-6`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="w-12 h-12 mx-auto text-blue-600 mb-3" />
          <p className="text-gray-700 font-medium mb-1">Drag & drop your PDF file here</p>
          <p className="text-sm text-gray-500 mb-4">or click below to select a file</p>

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files[0])}
            id="pdfInput"
          />
          <label
            htmlFor="pdfInput"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md cursor-pointer transition"
          >
            Browse File
          </label>

          {selectedFile && (
            <p className="mt-2 text-xs text-gray-500 truncate">
              📄 {selectedFile.name}
            </p>
          )}
        </div>

        {/* Position Selector */}
        <div className="flex justify-center space-x-4 mb-6">
          {["left", "center", "right"].map((pos) => (
            <label key={pos} className="flex items-center space-x-2">
              <input
                type="radio"
                value={pos}
                checked={position === pos}
                onChange={(e) => setPosition(e.target.value)}
              />
              <span className="text-gray-700">
                {pos === "left" ? "Bottom Left" : pos === "center" ? "Bottom Center" : "Bottom Right"}
              </span>
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={addPageNumbers}
          disabled={!selectedFile || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Add Page Numbers"}
        </button>
      </div>
    </div>
  );
}
