// client/src/pages/WordToPdf.jsx
import { useState, useCallback } from "react";
import mammoth from "mammoth";
import jsPDF from "jspdf";

export default function WordToPDFPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [conversionOptions, setConversionOptions] = useState({
    pageSize: "a4", // a4, letter, legal
    orientation: "portrait", // portrait, landscape
    margin: 20,
    fontSize: 12,
    fontFamily: "helvetica", // helvetica, times, courier
    includeImages: true,
    preserveFormatting: true
  });
  const [previewText, setPreviewText] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelect = useCallback(async (files) => {
    const file = files[0];
    if (file && (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
                 file.type === "application/msword" ||
                 file.name.endsWith('.docx') || 
                 file.name.endsWith('.doc'))) {
      setSelectedFile(file);
      try {
        // Extract text for preview
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setPreviewText(result.value.substring(0, 500) + (result.value.length > 500 ? "..." : ""));
      } catch (error) {
        console.error("Error reading Word document:", error);
        alert("Error reading Word document. Please ensure the file is a valid Word document.");
        setSelectedFile(null);
        setPreviewText("");
      }
    } else {
      alert("Please select a valid Word document (.docx or .doc file)");
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files);
      }
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

  const convertToPDF = async () => {
    if (!selectedFile) {
      alert("Please select a Word document first");
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      // Extract HTML content from Word document
      const result = await mammoth.convertToHtml({ 
        arrayBuffer,
        convertImage: conversionOptions.includeImages ? mammoth.images.imgElement(function(image) {
          return image.read("base64").then(function(imageBuffer) {
            return {
              src: "data:" + image.contentType + ";base64," + imageBuffer
            };
          });
        }) : undefined
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: conversionOptions.orientation,
        unit: 'mm',
        format: conversionOptions.pageSize
      });

      // Set up page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = conversionOptions.margin;
      const maxWidth = pageWidth - (margin * 2);
      const maxHeight = pageHeight - (margin * 2);

      // Set font
      pdf.setFont(conversionOptions.fontFamily);
      pdf.setFontSize(conversionOptions.fontSize);

      // Convert HTML to text and add to PDF
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = result.value;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      // Split text into lines that fit the page width
      const lines = pdf.splitTextToSize(textContent, maxWidth);
      
      let yPosition = margin;
      const lineHeight = conversionOptions.fontSize * 0.353; // Convert pt to mm

      lines.forEach((line, index) => {
        // Check if we need a new page
        if (yPosition + lineHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      // Generate filename
      const baseName = selectedFile.name.replace(/\.(docx?|doc)$/i, '');
      const fileName = `${baseName}_converted.pdf`;

      // Save the PDF
      pdf.save(fileName);

      alert("Word document converted to PDF successfully!");

    } catch (error) {
      console.error("Error converting to PDF:", error);
      alert("Error converting document. Please try again or check if the file is corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewText("");
    setShowPreview(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Word to PDF Converter
          </h1>
          <p className="text-gray-600 text-lg">
            Convert Microsoft Word documents to PDF format with customizable options
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <div className="text-6xl text-gray-400 mb-4">📄</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop a Word document here or click to browse
                </h3>
                <p className="text-gray-500">
                  Supports .docx and .doc files
                </p>
              </div>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer inline-block transition-colors">
                  Browse File
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Selected File
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
                <button
                  onClick={clearFile}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
              <div className="text-blue-600 text-3xl">📄</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            {/* Preview */}
            {showPreview && previewText && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Document Preview:</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{previewText}</p>
              </div>
            )}
          </div>
        )}

        {/* Conversion Options */}
        {selectedFile && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Conversion Options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Page Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Size
                </label>
                <select
                  value={conversionOptions.pageSize}
                  onChange={(e) => setConversionOptions(prev => ({ ...prev, pageSize: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orientation
                </label>
                <select
                  value={conversionOptions.orientation}
                  onChange={(e) => setConversionOptions(prev => ({ ...prev, orientation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={conversionOptions.fontFamily}
                  onChange={(e) => setConversionOptions(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="helvetica">Helvetica</option>
                  <option value="times">Times</option>
                  <option value="courier">Courier</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <input
                  type="number"
                  value={conversionOptions.fontSize}
                  onChange={(e) => setConversionOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  min="8"
                  max="24"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Margin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margin (mm)
                </label>
                <input
                  type="number"
                  value={conversionOptions.margin}
                  onChange={(e) => setConversionOptions(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                  min="10"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mt-6 space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionOptions.includeImages}
                  onChange={(e) => setConversionOptions(prev => ({ ...prev, includeImages: e.target.checked }))}
                  className="text-blue-600"
                />
                <span className="text-gray-700">Include images (experimental)</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={conversionOptions.preserveFormatting}
                  onChange={(e) => setConversionOptions(prev => ({ ...prev, preserveFormatting: e.target.checked }))}
                  className="text-blue-600"
                />
                <span className="text-gray-700">Preserve formatting (basic)</span>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedFile && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={clearFile}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Clear File
              </button>

              <button
                onClick={convertToPDF}
                disabled={isProcessing}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>Convert to PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}