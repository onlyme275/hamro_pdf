// client/src/pages/ProtectPdf.jsx
import { useState, useRef } from "react";
import { Shield, Lock, Key, UploadCloud } from "lucide-react";

export default function PDFProtectPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
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

  const protectPDF = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userPassword", userPassword);
    formData.append("ownerPassword", ownerPassword);

    try {
      setIsProcessing(true);
      const res = await fetch("http://localhost:5000/api/pdf-protect", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Server error:", errorData?.details || res.statusText);
        alert(
          "Error protecting PDF. " +
            (errorData?.details ? `Warnings/Errors: ${errorData.details}` : "")
        );
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedFile.name.replace(".pdf", "")}_protected.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      alert("PDF protected successfully! ⚡");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error protecting PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-10 h-10 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Mc-PDF <span className="text-orange-600">Protect</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Secure your PDF with strong encryption. Add <b>User</b> & <b>Owner</b> passwords easily.
          </p>
        </div>

        {/* Upload Section */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition 
            ${dragOver ? "border-orange-400 bg-orange-50" : "border-gray-300 bg-white"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="w-12 h-12 mx-auto text-orange-500 mb-3" />
          <p className="text-gray-700 font-medium">Drag & drop your PDF file here</p>
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
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded-md cursor-pointer transition"
          >
            Browse File
          </label>

          {selectedFile && (
            <p className="mt-2 text-xs text-gray-500 truncate">
              📄 {selectedFile.name}
            </p>
          )}
        </div>

        {/* Password Inputs */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              <Lock className="inline w-4 h-4 mr-1 text-orange-600" />
              User Password (open PDF)
            </label>
            <input
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Enter user password"
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              <Key className="inline w-4 h-4 mr-1 text-orange-600" />
              Owner Password (change permissions)
            </label>
            <input
              type="password"
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
              placeholder="Enter owner password"
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Protect Button */}
        <button
          onClick={protectPDF}
          disabled={isProcessing}
          className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Protect PDF"}
        </button>

        {/* How to Use Instructions */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            How to Use
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full mx-auto flex items-center justify-center font-bold mb-2">
                1
              </div>
              <p className="text-sm text-gray-600">Upload your PDF file</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full mx-auto flex items-center justify-center font-bold mb-2">
                2
              </div>
              <p className="text-sm text-gray-600">Set User & Owner passwords</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full mx-auto flex items-center justify-center font-bold mb-2">
                3
              </div>
              <p className="text-sm text-gray-600">Click Protect & download</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
