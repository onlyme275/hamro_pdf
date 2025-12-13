// client/src/pages/ExcelToPdf.jsx
import { useState, useRef } from "react";
import { FileType, UploadCloud, Download } from "lucide-react";

export default function ExcelToPdf() {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    fileInputRef.current.files = null; // reset previous files
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInputRef.current.files = dataTransfer.files;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) return alert("Please upload an Excel file");

    setLoading(true);
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append("excel", file);

    try {
      const res = await fetch("http://localhost:5000/api/excel/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to process Excel");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert("Error uploading Excel");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FileType className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Excel <span className="text-green-600">to PDF</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Quickly convert your Excel files into professional PDFs.
          </p>
        </div>

        {/* Upload Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition 
              ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadCloud className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <p className="text-gray-700 font-medium">Drag & drop your Excel file here</p>
            <p className="text-sm text-gray-500 mb-4">or click below to select a file</p>

            <input
              type="file"
              name="excel"
              accept=".xlsx,.xls"
              className="hidden"
              ref={fileInputRef}
              id="excelInput"
            />
            <label
              htmlFor="excelInput"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md cursor-pointer transition"
            >
              Browse File
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Convert to PDF"}
          </button>
        </form>

        {/* Download Section */}
        {downloadUrl && (
          <div className="mt-6 text-center">
            <a
              href={downloadUrl}
              download="output.pdf"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
          </div>
        )}

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
      </div>
       </div>
  );
}
