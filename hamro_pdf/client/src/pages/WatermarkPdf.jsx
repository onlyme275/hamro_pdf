// client/src/pages/WatermarkPdf.jsx
import React, { useState, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Upload,
  Download,
  FileText,
  Droplets,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";

const PDFWatermarkApp = () => {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkedPdf, setWatermarkedPdf] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Watermark customization options
  const [watermarkOptions, setWatermarkOptions] = useState({
    fontSize: 50,
    opacity: 0.3,
    rotation: 45,
    color: "#FF0000",
    position: "center",
  });

  const handleFileUpload = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setWatermarkedPdf(null);
      setPreviewUrl(null);
      setShowPreview(false);

      // Create preview URL for original PDF
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      alert("Please select a valid PDF file");
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setWatermarkedPdf(null);
      setPreviewUrl(null);
      setShowPreview(false);

      const url = URL.createObjectURL(droppedFile);
      setPreviewUrl(url);
    } else {
      alert("Please drop a valid PDF file");
    }
  }, []);

  const addWatermark = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const fileArrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const pages = pdfDoc.getPages();

      // Get font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Convert hex color to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
            }
          : { r: 1, g: 0, b: 0 };
      };

      const color = hexToRgb(watermarkOptions.color);

      pages.forEach((page) => {
        const { width, height } = page.getSize();

        // Calculate position based on selection
        let x, y;
        switch (watermarkOptions.position) {
          case "center":
            x = width / 2;
            y = height / 2;
            break;
          case "top-left":
            x = 100;
            y = height - 100;
            break;
          case "top-right":
            x = width - 100;
            y = height - 100;
            break;
          case "bottom-left":
            x = 100;
            y = 100;
            break;
          case "bottom-right":
            x = width - 100;
            y = 100;
            break;
          default:
            x = width / 2;
            y = height / 2;
        }

        page.drawText(watermarkText, {
          x: x,
          y: y,
          size: watermarkOptions.fontSize,
          font: font,
          color: rgb(color.r, color.g, color.b),
          opacity: watermarkOptions.opacity,
          rotate: {
            type: "degrees",
            angle: watermarkOptions.rotation,
          },
        });
      });

      const pdfBytes = await pdfDoc.save();
      setWatermarkedPdf(pdfBytes);
    } catch (error) {
      console.error("Error adding watermark:", error);
      alert("Error processing PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadWatermarkedPdf = () => {
    if (!watermarkedPdf) return;

    const blob = new Blob([watermarkedPdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `watermarked_${file?.name || "document.pdf"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetApp = () => {
    setFile(null);
    setWatermarkedPdf(null);
    setPreviewUrl(null);
    setShowPreview(false);
    setWatermarkText("CONFIDENTIAL");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Droplets className="text-blue-600" />
            PDF Watermark Tool
          </h1>
          <p className="text-gray-600">
            Add custom watermarks to your PDF documents
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload and Controls */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="text-blue-600" />
                Upload PDF
              </h2>

              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                >
                  <FileText className="mx-auto mb-4 text-blue-400" size={48} />
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
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </label>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">{file.name}</p>
                      <p className="text-sm text-green-600">
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

            {/* Watermark Settings */}
            {file && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Settings className="text-blue-600" />
                  Watermark Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter watermark text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size: {watermarkOptions.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={watermarkOptions.fontSize}
                        onChange={(e) =>
                          setWatermarkOptions((prev) => ({
                            ...prev,
                            fontSize: parseInt(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opacity: {Math.round(watermarkOptions.opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={watermarkOptions.opacity}
                        onChange={(e) =>
                          setWatermarkOptions((prev) => ({
                            ...prev,
                            opacity: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rotation: {watermarkOptions.rotation}°
                      </label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={watermarkOptions.rotation}
                        onChange={(e) =>
                          setWatermarkOptions((prev) => ({
                            ...prev,
                            rotation: parseInt(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="color"
                        value={watermarkOptions.color}
                        onChange={(e) =>
                          setWatermarkOptions((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="w-full h-10 rounded border border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <select
                      value={watermarkOptions.position}
                      onChange={(e) =>
                        setWatermarkOptions((prev) => ({
                          ...prev,
                          position: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="center">Center</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>

                  <button
                    onClick={addWatermark}
                    disabled={isProcessing || !watermarkText.trim()}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Droplets size={20} />
                        Add Watermark
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Download */}
            {watermarkedPdf && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Download className="text-green-600" />
                  Download
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium">
                    ✅ Watermark added successfully!
                  </p>
                  <p className="text-sm text-green-600">
                    Your PDF is ready for download.
                  </p>
                </div>

                <button
                  onClick={downloadWatermarkedPdf}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Watermarked PDF
                </button>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="text-blue-600" />
                Preview
              </h2>
              {previewUrl && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPreview ? "Hide" : "Show"} Preview
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
              <div className="h-96 border rounded-lg overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
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
  );
};

export default PDFWatermarkApp;
