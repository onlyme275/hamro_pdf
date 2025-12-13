// client/src/pages/OrganizePDFPage.jsx
import { useState, useRef } from "react";
import { Document, pdfjs } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import { FileText } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function OrganizePDFPage() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageOrder, setPageOrder] = useState([]);
  const [pageThumbnails, setPageThumbnails] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInputRef.current.files = dataTransfer.files;
    setFile(file);
    setPageThumbnails([]);
    setPageOrder([]);
    setSelectedPage(null);
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

  const onDocumentLoadSuccess = async (pdf) => {
    setNumPages(pdf.numPages);
    setPageOrder(Array.from({ length: pdf.numPages }, (_, i) => i + 1));

    const thumbs = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
      thumbs.push(canvas.toDataURL());
    }
    setPageThumbnails(thumbs);
  };

  const handlePageClick = (index) => {
    if (selectedPage === null) {
      setSelectedPage(index);
    } else {
      const newOrder = [...pageOrder];
      [newOrder[selectedPage], newOrder[index]] = [
        newOrder[index],
        newOrder[selectedPage],
      ];
      setPageOrder(newOrder);
      setSelectedPage(null);
    }
  };

  const reorderAndDownload = async () => {
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    const orderZeroIndexed = pageOrder.map((n) => n - 1);
    for (let i = 0; i < orderZeroIndexed.length; i++) {
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [orderZeroIndexed[i]]);
      newPdf.addPage(copiedPage);
    }

    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name.replace(".pdf", "")}_organized.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FileText className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Organize <span className="text-blue-600">PDF</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Click one page, then click another to swap their positions.
          </p>
        </div>

        {/* Upload Section */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition 
            ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-gray-700 font-medium mb-2">Drag & drop your PDF file here</p>
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
            className="inline-block bg-blue-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-md cursor-pointer transition"
          >
            Browse File
          </label>

          {file && (
            <p className="mt-2 text-xs text-gray-500 truncate">
              📄 {file.name}
            </p>
          )}
        </div>

        {/* Render PDF for thumbnails (hidden) */}
        {file && <Document file={file} onLoadSuccess={onDocumentLoadSuccess} className="hidden" />}

        {/* Thumbnails */}
        {file && pageThumbnails.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6">
            {pageThumbnails.map((thumb, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-1 cursor-pointer transition transform hover:scale-105 ${
                  selectedPage === idx
                    ? "border-blue-600 shadow-lg"
                    : "border-gray-300"
                }`}
                onClick={() => handlePageClick(idx)}
              >
                <img
                  src={thumb}
                  alt={`Page ${idx + 1}`}
                  className="w-full h-auto rounded"
                />
                <div className="text-center text-xs mt-1 font-semibold text-gray-700">
                  {pageOrder[idx]}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Download Button */}
        {file && pageOrder.length > 0 && (
          <button
            onClick={reorderAndDownload}
            className="w-full bg-blue-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md transition"
          >
            Download Reordered PDF
          </button>
        )}
      </div>
    </div>
  );
}
