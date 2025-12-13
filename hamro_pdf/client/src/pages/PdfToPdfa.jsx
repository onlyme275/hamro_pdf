// client/src/pages/PdfToPdfa.jsx
import { useState, useRef } from "react";
import { FileText, UploadCloud } from "lucide-react";

export default function PdfToPdfaPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(selectedFile);
    fileInputRef.current.files = dataTransfer.files;
    setFile(selectedFile);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/pdf-to-pdfa", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(".pdf", "")}-pdfa.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        alert("PDF converted to PDF/A successfully!");
      } else {
        alert("Conversion failed!");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during conversion.");
    } finally {
      setLoading(false);
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
              PDF → <span className="text-blue-600">PDF/A</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Upload your PDF and convert it to PDF/A format for long-term archiving.
          </p>
        </div>

        {/* Drag & Drop / File Upload */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-6"
        >
          <div
            className={`border-2 border-dashed rounded-lg p-6 w-full text-center transition ${
              dragOver ? "border-blue-400 bg-green-50" : "border-gray-300 bg-white"
            }`}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-blue-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Converting..." : "Convert to PDF/A"}
          </button>
          {/* Instructions */}
         <div className="mt-8 border-t pt-6">
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center border border-blue-100">
    <div className="flex items-center justify-center gap-2 mb-3">
      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800">Under Optimization</h3>
    </div>
    <p className="text-gray-600 font-medium mb-2">
      This page is currently being optimized
    </p>
    <p className="text-sm text-gray-500">
      We're working hard to bring you an enhanced experience. Stay tuned for updates!
    </p>
    <div className="mt-4 flex items-center justify-center gap-1">
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
    </div>
  </div>
         </div>
        </form>
      </div>
    </div>
  );
}
