import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Search,
  Settings,
} from "lucide-react";

export default function OCRPDFTool() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [ocrLanguage, setOcrLanguage] = useState("eng");
  const [pageImages, setPageImages] = useState([]);
  const fileInputRef = useRef(null);

  // Load PDF.js, Tesseract.js, and jsPDF
  const initializeOCR = async () => {
    try {
      // Load PDF.js
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }

      // Load Tesseract.js
      if (!window.Tesseract) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Load jsPDF
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to load OCR libraries: ${error.message}`);
    }
  };

  // Convert PDF pages to images with better memory management
  const convertPDFToImages = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
      });
      const pdf = await loadingTask.promise;
      const images = [];

      setCurrentStage(`Converting ${pdf.numPages} pages to images...`);

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProgress(10 + (pageNum / pdf.numPages) * 15); // 10-25% for conversion

        const page = await pdf.getPage(pageNum);
        const scale = 1.5; // Reduced scale for better memory usage
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Convert to blob for better memory management
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8); // Use JPEG with compression
        images.push(imageDataUrl);

        // Clean up canvas
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }

      return images;
    } catch (error) {
      throw new Error(`PDF conversion failed: ${error.message}`);
    }
  };

  // Perform OCR and collect text by page
  const performOCR = async (images) => {
    const pageTexts = [];
    const totalPages = images.length;
    let successfulPages = 0;

    for (let i = 0; i < totalPages; i++) {
      setCurrentStage(`OCR processing page ${i + 1} of ${totalPages}`);
      const baseProgress = 25 + (i / totalPages) * 50; // 25-75% for OCR
      setProgress(baseProgress);

      try {
        // Use simple recognize method without logger to avoid DataCloneError
        const {
          data: { text },
        } = await window.Tesseract.recognize(images[i], ocrLanguage);

        if (text && text.trim()) {
          pageTexts.push(text.trim());
          successfulPages++;
        } else {
          pageTexts.push("[No text detected on this page]");
        }

        // Update progress manually
        const pageProgress = baseProgress + 50 / totalPages;
        setProgress(Math.min(75, pageProgress));

        // Add small delay to prevent browser freezing
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`OCR failed for page ${i + 1}:`, error);
        pageTexts.push(`[ERROR: ${error.message}]`);
      }
    }

    if (successfulPages === 0) {
      throw new Error("No text could be extracted from any pages");
    }

    return pageTexts;
  };

  // Create searchable PDF with original images and invisible text layer
  const createSearchablePDF = async (images, pageTexts, originalFileName) => {
    setCurrentStage("Creating searchable PDF...");
    setProgress(80);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    for (let i = 0; i < images.length; i++) {
      if (i > 0) {
        doc.addPage();
      }

      // Get page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Add the original image as background
      doc.addImage(images[i], "JPEG", 0, 0, pageWidth, pageHeight);

      // Add invisible text layer for searchability
      doc.setTextColor(255, 255, 255, 0); // Completely transparent
      doc.setFontSize(8);

      // Split text into lines and add to PDF
      const text = pageTexts[i] || "";
      const lines = doc.splitTextToSize(text, pageWidth - 20);

      let yPosition = 10;
      lines.forEach((line) => {
        if (yPosition < pageHeight - 10) {
          doc.text(line, 10, yPosition);
          yPosition += 6;
        }
      });
    }

    setProgress(95);
    const pdfBlob = doc.output("blob");
    const fileName = `OCR_${originalFileName}`;

    return { blob: pdfBlob, fileName };
  };

  // Also create text file for preview
  const createTextFile = (pageTexts, originalFileName) => {
    let fullText = "";
    pageTexts.forEach((text, index) => {
      fullText += `\n=== PAGE ${index + 1} ===\n${text}\n`;
    });

    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const fileName = `OCR_${originalFileName.replace(".pdf", "")}.txt`;
    return { blob, fileName };
  };

  // Main OCR processing function with better error handling
  const processOCR = useCallback(
    async (file) => {
      setProcessing(true);
      setProgress(0);
      setError("");
      setExtractedText("");
      setResult(null);

      try {
        // Check file size (limit to 20MB for stability)
        if (file.size > 20 * 1024 * 1024) {
          throw new Error(
            "File too large. Please use files under 20MB for optimal performance."
          );
        }

        setCurrentStage("Initializing OCR engine...");
        setProgress(5);
        await initializeOCR();

        setCurrentStage("Converting PDF to images...");
        setProgress(10);
        const images = await convertPDFToImages(file);
        setPageImages(images);

        if (images.length === 0) {
          throw new Error("No pages could be extracted from the PDF");
        }

        setCurrentStage("Starting OCR processing...");
        setProgress(25);
        const pageTexts = await performOCR(images);

        setCurrentStage("Creating searchable PDF...");
        setProgress(80);
        const { blob: pdfBlob, fileName: pdfFileName } =
          await createSearchablePDF(images, pageTexts, file.name);

        setCurrentStage("Finalizing results...");
        setProgress(95);

        const { blob: textBlob, fileName: textFileName } = createTextFile(
          pageTexts,
          file.name
        );

        // Create full text for preview
        let fullText = "";
        pageTexts.forEach((text, index) => {
          fullText += `\n=== PAGE ${index + 1} ===\n${text}\n`;
        });

        setExtractedText(fullText);
        setResult({
          originalFile: file.name,
          processedFile: pdfFileName,
          textFile: textFileName,
          pages: images.length,
          language: ocrLanguage,
          downloadBlob: pdfBlob,
          textBlob: textBlob,
          wordCount: fullText.split(/\s+/).filter((word) => word.length > 0)
            .length,
        });

        setProgress(100);
        setCurrentStage("OCR processing complete!");
      } catch (error) {
        console.error("OCR Error:", error);
        setError(`OCR processing failed: ${error.message}`);
      } finally {
        setProcessing(false);
      }
    },
    [ocrLanguage]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFile = droppedFiles.find(
      (file) => file.type === "application/pdf"
    );

    if (pdfFile) {
      setFile(pdfFile);
      setResult(null);
      setExtractedText("");
      setError("");
      setPageImages([]);
    } else {
      setError("Please upload a PDF file only.");
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResult(null);
      setExtractedText("");
      setError("");
      setPageImages([]);
    } else {
      setError("Please select a valid PDF file.");
    }
  };

  const handleDownload = () => {
    if (result?.downloadBlob) {
      const url = URL.createObjectURL(result.downloadBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.processedFile;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadText = () => {
    if (result?.textBlob) {
      const url = URL.createObjectURL(result.textBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.textFile;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-300 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-14 w-14 text-indigo-600 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              OCR PDF Tool
            </h1>
          </div>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Extract text from scanned PDFs using advanced OCR technology
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Upload & Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <Upload className="h-6 w-6 mr-3 text-indigo-600" />
                Upload PDF Document
              </h2>

              {/* Language Selection */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-3">
                  <Settings className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="font-semibold text-gray-700">
                    OCR Language
                  </span>
                </div>
                <select
                  value={ocrLanguage}
                  onChange={(e) => setOcrLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="eng">English</option>
                  <option value="spa">Spanish</option>
                  <option value="fra">French</option>
                  <option value="deu">German</option>
                  <option value="ita">Italian</option>
                  <option value="por">Portuguese</option>
                  <option value="rus">Russian</option>
                  <option value="chi_sim">Chinese (Simplified)</option>
                  <option value="jpn">Japanese</option>
                  <option value="ara">Arabic</option>
                  <option value="nep">nepali</option>
                </select>
              </div>

              {/* File Drop Zone */}
              <div
                className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive
                    ? "border-indigo-400 bg-indigo-50 scale-105"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="space-y-4">
                  <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Upload className="h-10 w-10 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      Drop PDF here or click to browse
                    </p>
                    <p className="text-gray-500">
                      Maximum file size: 20MB (optimized for multi-page
                      processing)
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected File Info */}
              {file && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <p className="font-semibold text-blue-900">
                          {file.name}
                        </p>
                        <p className="text-sm text-blue-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              {/* Process Button */}
              <button
                onClick={() => processOCR(file)}
                disabled={!file || processing}
                className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin h-6 w-6 mr-3" />
                    Processing OCR...
                  </>
                ) : (
                  <>
                    <Eye className="h-6 w-6 mr-3" />
                    Start OCR Processing
                  </>
                )}
              </button>
            </div>

            {/* Progress Display */}
            {processing && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">{currentStage}</h3>
                  <span className="text-sm font-semibold text-gray-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* OCR Results */}
            {result && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                  <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                  OCR Results
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">
                      Pages Processed
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {result.pages}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">
                      Words Extracted
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {result.wordCount}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center shadow-lg mb-4"
                >
                  <Download className="h-5 w-5 mr-3" />
                  Download Searchable PDF
                </button>

                <button
                  onClick={handleDownloadText}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Download Text File
                </button>
              </div>
            )}

            {/* Extracted Text Preview */}
            {extractedText && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                  <Search className="h-6 w-6 mr-3 text-cyan-600" />
                  Extracted Text
                </h2>

                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search in extracted text..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-mono">
                    {highlightSearchTerm(extractedText, searchTerm)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
