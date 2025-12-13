import { useState, useCallback } from "react";
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import { jsPDF } from "jspdf";

export default function JpgToPdfPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") &&
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        )
    );

    if (imageFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...imageFiles]);
      setError("");
      setPdfUrl("");
    } else {
      setError("Please select valid image files (JPG, PNG, WebP)");
    }
    event.target.value = "";
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") &&
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        )
    );

    if (imageFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...imageFiles]);
      setError("");
      setPdfUrl("");
    } else {
      setError("Please drop valid image files (JPG, PNG, WebP)");
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex, toIndex) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  };

  const convertToPdf = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image file.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      // Create PDF instance - same as successful test
      const pdf = new jsPDF();
      let isFirstPage = true;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        try {
          // Convert file to base64
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          // Create image to get dimensions
          const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = base64;
          });

          // Calculate dimensions to fit page
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          let imgWidth = img.width;
          let imgHeight = img.height;

          // Scale image to fit page while maintaining aspect ratio
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          imgWidth *= ratio;
          imgHeight *= ratio;

          // Center the image
          const x = (pdfWidth - imgWidth) / 2;
          const y = (pdfHeight - imgHeight) / 2;

          if (!isFirstPage) {
            pdf.addPage();
          }

          // Determine format
          let format = "JPEG";
          if (file.type.includes("png")) {
            format = "PNG";
          }

          pdf.addImage(base64, format, x, y, imgWidth, imgHeight);
          isFirstPage = false;
        } catch (fileErr) {
          console.error(`Error processing file ${file.name}:`, fileErr);
        }
      }

      // Generate and save PDF
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      console.error("Conversion error:", err);
      setError(`Failed to convert images to PDF: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `converted-images-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setPdfUrl("");
    setError("");
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JPG to PDF</h1>
          <p className="text-gray-600">Convert images to PDF documents</p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? "border-orange-400 bg-orange-50"
                : selectedFiles.length > 0
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} image(s) selected`
                  : "Drop your images here or click to browse"}
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, WebP files
              </p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-block mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Images
            </label>

            {selectedFiles.length > 0 && (
              <button
                onClick={clearAll}
                className="ml-3 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Images ({selectedFiles.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}-${file.size}`}
                  className="relative group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p
                    className="text-xs text-gray-600 mt-1 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <div className="flex justify-center mt-1 space-x-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveFile(index, index - 1)}
                        className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    {index < selectedFiles.length - 1 && (
                      <button
                        onClick={() => moveFile(index, index + 1)}
                        className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Convert Button */}
        {selectedFiles.length > 0 && (
          <div className="text-center mb-6">
            <button
              onClick={convertToPdf}
              disabled={isConverting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert to PDF"
              )}
            </button>
          </div>
        )}

        {/* Download Result */}
        {pdfUrl && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              PDF Ready!
            </h3>
            <p className="text-gray-600 mb-4">
              Your images have been successfully converted to PDF
            </p>
            <button
              onClick={downloadPdf}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
