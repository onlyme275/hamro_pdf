// client/src/pages/PdfToJpg.jsx
import { useState, useCallback, useEffect } from "react";
import {
  Upload,
  Download,
  FileImage,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function PdfToJpgPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState([]);
  const [error, setError] = useState("");
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load PDF.js from CDN
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // Load PDF.js from CDN
        if (typeof window !== "undefined") {
          // Check if already loaded
          if (window.pdfjsLib) {
            setPdfjsLib(window.pdfjsLib);
            setIsLoading(false);
            return;
          }

          // Load PDF.js script
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.async = true;

          script.onload = () => {
            if (window.pdfjsLib) {
              // Set worker
              window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

              setPdfjsLib(window.pdfjsLib);
              setIsLoading(false);
            } else {
              throw new Error("PDF.js failed to load");
            }
          };

          script.onerror = () => {
            throw new Error("Failed to load PDF.js script");
          };

          document.head.appendChild(script);

          // Cleanup function
          return () => {
            if (document.head.contains(script)) {
              document.head.removeChild(script);
            }
          };
        }
      } catch (err) {
        console.error("Failed to load PDF.js:", err);
        setError(
          "Failed to load PDF processing library. Please refresh the page and try again."
        );
        setIsLoading(false);
      }
    };

    loadPdfJs();
  }, []);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError("");
      setConvertedImages([]);
    } else {
      setError("Please select a valid PDF file");
      setSelectedFile(null);
    }
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError("");
      setConvertedImages([]);
    } else {
      setError("Please drop a valid PDF file");
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const convertPdfToJpg = async () => {
    if (!selectedFile || !pdfjsLib) {
      setError("PDF processing library not loaded. Please refresh the page.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const images = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          // Convert canvas to blob with high quality
          const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, "image/jpeg", 0.95);
          });

          const imageDataUrl = URL.createObjectURL(blob);

          images.push({
            pageNumber: pageNum,
            dataUrl: imageDataUrl,
            blob: blob,
            fileName: `${selectedFile.name.replace(
              ".pdf",
              ""
            )}_page_${pageNum}.jpg`,
          });
        } catch (pageErr) {
          console.error(`Error processing page ${pageNum}:`, pageErr);
          // Continue with other pages even if one fails
        }
      }

      if (images.length === 0) {
        throw new Error(
          "No pages could be converted. The PDF might be corrupted or password-protected."
        );
      }

      setConvertedImages(images);
    } catch (err) {
      console.error("Conversion error:", err);
      setError(
        `Failed to convert PDF: ${err.message}. Please try with a different file.`
      );
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = (imageData) => {
    const link = document.createElement("a");
    link.href = imageData.dataUrl;
    link.download = imageData.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    convertedImages.forEach((imageData, index) => {
      setTimeout(() => {
        downloadImage(imageData);
      }, index * 300); // Slightly longer delay to prevent browser blocking
    });
  };

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      convertedImages.forEach((imageData) => {
        URL.revokeObjectURL(imageData.dataUrl);
      });
    };
  }, [convertedImages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileImage className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to JPG</h1>
          <p className="text-gray-600">
            Convert PDF pages to high-quality JPG images
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              selectedFile
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                {selectedFile
                  ? selectedFile.name
                  : "Drop your PDF here or click to browse"}
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF files up to 50MB
              </p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Choose PDF File
            </label>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
              <Loader2 className="w-5 h-5 text-yellow-600 mr-2 animate-spin" />
              <span className="text-yellow-700">
                Loading PDF processing library...
              </span>
            </div>
          )}
        </div>

        {/* Convert Button */}
        {selectedFile && pdfjsLib && !isLoading && (
          <div className="text-center mb-6">
            <button
              onClick={convertPdfToJpg}
              disabled={isConverting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert to JPG"
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {convertedImages.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Converted Images ({convertedImages.length})
              </h2>
              <button
                onClick={downloadAllImages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {convertedImages.map((imageData) => (
                <div
                  key={imageData.pageNumber}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={imageData.dataUrl}
                    alt={`Page ${imageData.pageNumber}`}
                    className="w-full h-48 object-contain bg-gray-50 rounded mb-3"
                  />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Page {imageData.pageNumber}
                    </p>
                    <button
                      onClick={() => downloadImage(imageData)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center mx-auto"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
