// client/src/pages/SignPdf.jsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  X,
  Users,
  User,
  Edit3,
  Type,
  Stamp,
  Download,
  Move,
  RotateCcw,
  Save,
  ChevronDown,
  Eye,
  Loader,
} from "lucide-react";

const PDFSignatureTool = () => {
  // Main states
  const [currentStep, setCurrentStep] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfDataURL, setPdfDataURL] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Signature setup states
  const [signatureType, setSignatureType] = useState("signature");
  const [fullName, setFullName] = useState("");
  const [initials, setInitials] = useState("");
  const [selectedFont, setSelectedFont] = useState("Dancing Script");
  const [signatureColor, setSignatureColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnSignature, setDrawnSignature] = useState(null);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [previewText, setPreviewText] = useState("");

  // Editor states
  const [createdSignatures, setCreatedSignatures] = useState([]);
  const [placedSignatures, setPlacedSignatures] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const pdfViewerRef = useRef(null);

  // Enhanced font collection with Google Fonts
  const signatureFonts = [
    {
      name: "Dancing Script",
      family: "'Dancing Script', cursive",
      category: "handwritten",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Alex Brush",
      family: "'Alex Brush', cursive",
      category: "handwritten",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Great Vibes",
      family: "'Great Vibes', cursive",
      category: "elegant",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Allura",
      family: "'Allura', cursive",
      category: "elegant",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Pacifico",
      family: "'Pacifico', cursive",
      category: "friendly",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Satisfy",
      family: "'Satisfy', cursive",
      category: "handwritten",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Homemade Apple",
      family: "'Homemade Apple', cursive",
      category: "casual",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Sacramento",
      family: "'Sacramento', cursive",
      category: "elegant",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Kaushan Script",
      family: "'Kaushan Script', cursive",
      category: "brush",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Amatic SC",
      family: "'Amatic SC', cursive",
      category: "handwritten",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Caveat",
      family: "'Caveat', cursive",
      category: "handwritten",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Courgette",
      family: "'Courgette', cursive",
      category: "handwritten",
      weight: "400",
      googleFont: true,
    },
    {
      name: "Times New Roman",
      family: "'Times New Roman', serif",
      category: "formal",
      weight: "400",
      googleFont: false,
    },
    {
      name: "Georgia",
      family: "Georgia, serif",
      category: "formal",
      weight: "400",
      googleFont: false,
    },
    {
      name: "Arial",
      family: "Arial, sans-serif",
      category: "modern",
      weight: "400",
      googleFont: false,
    },
  ];

  const colors = [
    "#000000",
    "#1a237e",
    "#0d47a1",
    "#006064",
    "#1b5e20",
    "#b71c1c",
    "#4a148c",
    "#263238",
    "#FF0000",
    "#0000FF",
    "#004D40",
    "#311B92",
  ];

  // Load Google Fonts and PDF.js dynamically
  useEffect(() => {
    const googleFonts = signatureFonts.filter((font) => font.googleFont);
    const fontNames = googleFonts.map((font) => font.name.replace(" ", "+"));
    const fontUrl = `https://fonts.googleapis.com/css2?${fontNames
      .map((name) => `family=${name}:wght@400`)
      .join("&")}&display=swap`;

    const fontLink = document.createElement("link");
    fontLink.href = fontUrl;
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    // Load PDF.js
    if (!window.pdfjsLib) {
      const pdfScript = document.createElement("script");
      pdfScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      pdfScript.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
      };
      document.head.appendChild(pdfScript);
    }

    return () => {
      try {
        document.head.removeChild(fontLink);
      } catch (e) {
        // Link may have already been removed
      }
    };
  }, []);

  // Update preview text when inputs change
  useEffect(() => {
    if (signatureType === "signature") {
      setPreviewText(fullName || "Your Name");
    } else if (signatureType === "initials") {
      setPreviewText(initials || "J.S");
    } else {
      setPreviewText("Company Stamp");
    }
  }, [signatureType, fullName, initials]);

  // PDF processing function
  const processPDF = async (file) => {
    setPdfLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();

      // Create data URL as fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfDataURL(e.target.result);
      };
      reader.readAsDataURL(file);

      // Use PDF.js if available
      if (window.pdfjsLib) {
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
          .promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);

        // Render first page as image for preview
        const page = await pdf.getPage(1);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const pageData = {
          pageNum: 1,
          canvas: canvas,
          dataUrl: canvas.toDataURL(),
          width: viewport.width,
          height: viewport.height,
        };

        setPdfPages([pageData]);
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  // File handling with PDF preview
  const handleFileSelect = useCallback(async (files) => {
    const file = files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      await processPDF(file);
      setCurrentStep("signers");
    } else {
      alert("Please select a valid PDF file");
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

  // Drawing functions
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.strokeStyle = signatureColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawnSignature = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    setDrawnSignature(dataURL);
  };

  // Signature creation
  const createSignature = () => {
    const selectedFontObj = signatureFonts.find((f) => f.name === selectedFont);

    const newSignature = {
      id: Date.now(),
      type: signatureType,
      text: signatureType === "signature" ? fullName : initials,
      font: selectedFontObj,
      color: signatureColor,
      fontSize: fontSize,
      dataURL: drawnSignature,
      isDrawn: !!drawnSignature,
    };

    setCreatedSignatures((prev) => [...prev, newSignature]);

    // Reset drawing
    setDrawnSignature(null);
    clearCanvas();
  };

  // Drag and drop for signature placement
  const handleDragStart = (e, signature) => {
    setDraggedItem(signature);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOverPDF = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDropOnPDF = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const rect = pdfViewerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const placedSignature = {
      ...draggedItem,
      id: Date.now() + Math.random(),
      x: Math.max(0, Math.min(x - 60, rect.width - 120)),
      y: Math.max(0, Math.min(y - 30, rect.height - 60)),
      page: currentPage,
      width: 120,
      height: 60,
    };

    setPlacedSignatures((prev) => [...prev, placedSignature]);
    setDraggedItem(null);
  };

  const removeSignature = (id) => {
    setCreatedSignatures((prev) => prev.filter((sig) => sig.id !== id));
  };

  const removePlacedSignature = (id) => {
    setPlacedSignatures((prev) => prev.filter((sig) => sig.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const downloadSignedPDF = async () => {
    if (placedSignatures.length === 0) {
      alert("Please place at least one signature on the document first.");
      return;
    }

    setIsProcessing(true);

    try {
      // Load PDF-lib if not already loaded
      if (!window.PDFLib) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const { PDFDocument, rgb } = window.PDFLib;

      // Read the original PDF file
      const existingPdfBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      if (pages.length === 0) {
        throw new Error("No pages found in PDF");
      }

      // Get the first page (extend this for multi-page support)
      const firstPage = pages[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();

      // Get the PDF viewer dimensions for scaling calculations
      const viewerRect = pdfViewerRef.current.getBoundingClientRect();
      const scaleX = pageWidth / (viewerRect.width - 32); // Account for padding
      const scaleY = pageHeight / (viewerRect.height - 32);

      // Process each placed signature
      for (const signature of placedSignatures) {
        if (signature.page !== currentPage) continue; // Only process current page signatures

        // Calculate actual PDF coordinates (PDF coordinate system has origin at bottom-left)
        const pdfX = signature.x * scaleX;
        const pdfY = pageHeight - (signature.y + signature.height) * scaleY;
        const pdfWidth = signature.width * scaleX;
        const pdfHeight = signature.height * scaleY;

        if (signature.isDrawn && signature.dataURL) {
          // Handle drawn signatures
          try {
            // Convert data URL to bytes
            const imageBytes = await fetch(signature.dataURL).then((res) =>
              res.arrayBuffer()
            );
            const image = await pdfDoc.embedPng(imageBytes);

            firstPage.drawImage(image, {
              x: pdfX,
              y: pdfY,
              width: pdfWidth,
              height: pdfHeight,
            });
          } catch (error) {
            console.warn(
              "Failed to embed drawn signature, falling back to text:",
              error
            );
            // Fallback to text if image embedding fails
            firstPage.drawText(signature.text || "Signature", {
              x: pdfX,
              y: pdfY + pdfHeight / 2,
              size: Math.min(pdfHeight * 0.6, 24),
              color: rgb(0, 0, 0),
            });
          }
        } else {
          // Handle text signatures
          const fontSize = Math.min(
            pdfHeight * 0.6,
            signature.fontSize * scaleX
          );

          // Parse color (hex to RGB)
          let r = 0,
            g = 0,
            b = 0;
          if (signature.color && signature.color.startsWith("#")) {
            const hex = signature.color.substring(1);
            r = parseInt(hex.substring(0, 2), 16) / 255;
            g = parseInt(hex.substring(2, 4), 16) / 255;
            b = parseInt(hex.substring(4, 6), 16) / 255;
          }

          // Try to embed a custom font (simplified - using built-in fonts)
          firstPage.drawText(signature.text || "Signature", {
            x: pdfX,
            y: pdfY + pdfHeight / 2,
            size: fontSize,
            color: rgb(r, g, b),
          });
        }
      }

      // Generate the modified PDF
      const pdfBytes = await pdfDoc.save();

      // Create download link
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create temporary download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `signed_${selectedFile.name}`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message
      alert("PDF signed and downloaded successfully!");
    } catch (error) {
      console.error("Error signing PDF:", error);
      alert(`Failed to sign PDF: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Font dropdown component
  const FontDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 flex items-center justify-between bg-white"
      >
        <span
          style={{
            fontFamily: signatureFonts.find((f) => f.name === selectedFont)
              ?.family,
          }}
        >
          {selectedFont}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {fontDropdownOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {signatureFonts.map((font) => (
            <button
              key={font.name}
              onClick={() => {
                setSelectedFont(font.name);
                setFontDropdownOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                selectedFont === font.name
                  ? "bg-red-50 text-red-600"
                  : "text-gray-700"
              }`}
              style={{ fontFamily: font.family }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{font.name}</span>
                <span className="text-xs text-gray-500 capitalize">
                  {font.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Live preview component
  const SignaturePreview = () => {
    const selectedFontObj = signatureFonts.find((f) => f.name === selectedFont);

    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Live Preview:
          </label>
          <Eye className="h-4 w-4 text-gray-500" />
        </div>
        <div
          className="text-center py-4 min-h-[60px] flex items-center justify-center"
          style={{
            fontFamily: selectedFontObj?.family,
            color: signatureColor,
            fontSize: `${fontSize}px`,
            lineHeight: 1.2,
          }}
        >
          {previewText || "Enter your name"}
        </div>
      </div>
    );
  };

  // PDF Preview Component
  const PDFPreview = () => {
    if (pdfLoading) {
      return (
        <div className="absolute inset-4 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-red-600 mx-auto mb-2" />
            <p className="text-gray-600">Loading PDF preview...</p>
          </div>
        </div>
      );
    }

    if (pdfPages.length > 0 && pdfPages[0]) {
      return (
        <div className="absolute inset-4 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <img
            src={pdfPages[0].dataUrl}
            alt="PDF Preview"
            className="w-full h-full object-contain"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      );
    }

    if (pdfDataURL) {
      return (
        <div className="absolute inset-4 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <embed
            src={pdfDataURL}
            type="application/pdf"
            width="100%"
            height="100%"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-white p-6 overflow-hidden flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-red-600 mb-4">
                <svg
                  className="h-16 w-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">{selectedFile?.name}</p>
              <p className="text-sm text-gray-500 mb-4">PDF Document Preview</p>
              <p className="text-xs text-gray-400">
                Enhanced PDF preview will appear here once loaded
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute inset-4 bg-white border border-gray-200 rounded shadow-sm p-6">
        <div className="text-center text-gray-500">
          <div className="text-gray-400 mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">Document Preview</p>
          <p className="text-sm">Upload a PDF to see the preview here</p>
        </div>
      </div>
    );
  };

  // Render functions
  const renderUploadStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sign PDF Online
        </h1>
        <p className="text-gray-600">
          Add your signature to PDF documents quickly and securely
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select PDF file
          </h3>
          <p className="text-gray-500 mb-6">or drop PDF here</p>
          <label className="inline-block">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <span className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg cursor-pointer inline-block transition-colors font-medium">
              Select PDF file
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSignersStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Who needs to sign this document?
        </h2>
        <p className="text-gray-600">
          Choose if you're the only signer or if others need to sign too
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-4 mb-8">
          <div
            className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all"
            onClick={() => setCurrentStep("signature-setup")}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <User className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Just me</h3>
                <p className="text-gray-600">
                  I'm the only one who needs to sign this document
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all opacity-75">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Me + Others
                </h3>
                <p className="text-gray-600">
                  Multiple people need to sign this document
                </p>
                <p className="text-xs text-gray-500 mt-1">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="text-red-600">
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSignatureSetup = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create your signature
        </h2>
        <p className="text-gray-600">
          Customize your signature with different fonts and styles
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div className="space-y-6">
            {/* Name Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initials:
                </label>
                <input
                  type="text"
                  value={initials}
                  onChange={(e) => setInitials(e.target.value)}
                  placeholder="J.S"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Signature Type Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: "signature", label: "Signature", icon: Edit3 },
                  { key: "initials", label: "Initials", icon: Type },
                  { key: "stamp", label: "Company Stamp", icon: Stamp },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSignatureType(key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      signatureType === key
                        ? "border-red-500 text-red-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Font Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Style:
                </label>
                <FontDropdown />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="48"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Live Preview */}
            <SignaturePreview />

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Signature Color:
              </label>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSignatureColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        signatureColor === color
                          ? "border-gray-600 scale-110 shadow-lg"
                          : "border-gray-300 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={signatureColor}
                    onChange={(e) => setSignatureColor(e.target.value)}
                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={signatureColor}
                    onChange={(e) => setSignatureColor(e.target.value)}
                    placeholder="#000000"
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Draw Option */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Or draw your signature:
              </label>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={150}
                  className="w-full border border-gray-300 rounded cursor-crosshair bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex justify-between mt-3">
                  <button
                    onClick={clearCanvas}
                    className="text-gray-600 hover:text-gray-800 text-sm flex items-center space-x-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Clear</span>
                  </button>
                  <button
                    onClick={saveDrawnSignature}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Drawing</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={createSignature}
              disabled={
                (!fullName.trim() && !initials.trim() && !drawnSignature) ||
                (signatureType === "signature" &&
                  !fullName.trim() &&
                  !drawnSignature) ||
                (signatureType === "initials" &&
                  !initials.trim() &&
                  !drawnSignature)
              }
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Create Signature
            </button>
          </div>

          {/* Right side - Created Signatures */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Created Signatures ({createdSignatures.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {createdSignatures.map((signature) => (
                <div
                  key={signature.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, signature)}
                >
                  <div className="flex-1">
                    {signature.isDrawn ? (
                      <img
                        src={signature.dataURL}
                        alt="Drawn signature"
                        className="h-12 max-w-full object-contain"
                      />
                    ) : (
                      <div
                        style={{
                          fontFamily: signature.font?.family,
                          color: signature.color,
                          fontSize: `${Math.min(signature.fontSize, 20)}px`,
                        }}
                        className="font-medium"
                      >
                        {signature.text}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Move className="h-3 w-3 mr-1" />
                      {signature.type.charAt(0).toUpperCase() +
                        signature.type.slice(1)}
                      {!signature.isDrawn && ` • ${signature.font?.name}`}
                    </div>
                  </div>
                  <button
                    onClick={() => removeSignature(signature.id)}
                    className="text-red-500 hover:text-red-700 p-1 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {createdSignatures.length === 0 && (
                <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Type className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No signatures created yet</p>
                  <p className="text-sm mt-1">
                    Fill in your details and create your first signature
                  </p>
                </div>
              )}
            </div>

            {createdSignatures.length > 0 && (
              <button
                onClick={() => setCurrentStep("editor")}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Continue to Sign Document →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sign your document
        </h2>
        <p className="text-gray-600">
          Drag signatures from the left panel to place them on the document
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Signatures */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Signatures
            </h3>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {createdSignatures.map((signature) => (
                <div
                  key={signature.id}
                  className="bg-gray-50 rounded-lg p-3 cursor-move hover:bg-gray-100 transition-colors border border-gray-200"
                  draggable
                  onDragStart={(e) => handleDragStart(e, signature)}
                >
                  {signature.isDrawn ? (
                    <img
                      src={signature.dataURL}
                      alt="Drawn signature"
                      className="h-8 max-w-full object-contain"
                    />
                  ) : (
                    <div
                      style={{
                        fontFamily: signature.font?.family,
                        color: signature.color,
                        fontSize: "16px",
                      }}
                      className="font-medium text-center"
                    >
                      {signature.text}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-center">
                    <Move className="h-3 w-3 mr-1" />
                    Drag to place
                  </div>
                </div>
              ))}

              {createdSignatures.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <Type className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No signatures available</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentStep("signature-setup")}
              className="w-full mb-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Create New Signature
            </button>

            <button
              onClick={downloadSignedPDF}
              disabled={placedSignatures.length === 0 || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Signed PDF
                </>
              )}
            </button>

            {placedSignatures.length === 0 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Place at least one signature to download
              </p>
            )}
          </div>
        </div>

        {/* Main Panel - PDF Viewer */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Page Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="border border-gray-300 rounded-lg overflow-hidden relative bg-white">
              <div
                ref={pdfViewerRef}
                className="relative w-full h-96 md:h-[700px] bg-gray-50 flex items-center justify-center"
                onDragOver={handleDragOverPDF}
                onDrop={handleDropOnPDF}
              >
                <PDFPreview />

                {/* Placed signatures overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {placedSignatures.map((signature) => (
                    <div
                      key={signature.id}
                      className="absolute border-2 border-red-300 bg-red-50 bg-opacity-80 rounded cursor-move group hover:border-red-500 pointer-events-auto"
                      style={{
                        left: signature.x,
                        top: signature.y,
                        width: signature.width,
                        height: signature.height,
                      }}
                    >
                      {signature.isDrawn ? (
                        <img
                          src={signature.dataURL}
                          alt="Placed signature"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center px-2"
                          style={{
                            fontFamily: signature.font?.family,
                            color: signature.color,
                            fontSize: "14px",
                          }}
                        >
                          {signature.text}
                        </div>
                      )}
                      <button
                        onClick={() => removePlacedSignature(signature.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Drop zone indicator */}
                {draggedItem && (
                  <div className="absolute inset-0 border-2 border-dashed border-red-400 bg-red-50 bg-opacity-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-white bg-opacity-90 rounded-lg p-4 text-center">
                      <p className="text-red-600 font-medium">
                        Drop signature here
                      </p>
                      <p className="text-red-500 text-sm mt-1">
                        Position it where you want to sign
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
              <div className="flex items-center justify-center space-x-4">
                <span>📝 Drag signatures from the left panel</span>
                <span>•</span>
                <span>🎯 Drop them on the document</span>
                <span>•</span>
                <span>💾 Download when ready</span>
              </div>
              {placedSignatures.length > 0 && (
                <p className="mt-2 text-green-600">
                  ✓ {placedSignatures.length} signature
                  {placedSignatures.length !== 1 ? "s" : ""} placed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4">
      <div className="container mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              {
                step: "upload",
                label: "Upload",
                completed: ["signers", "signature-setup", "editor"].includes(
                  currentStep
                ),
              },
              {
                step: "signers",
                label: "Signers",
                completed: ["signature-setup", "editor"].includes(currentStep),
              },
              {
                step: "signature-setup",
                label: "Signature",
                completed: currentStep === "editor",
              },
              { step: "editor", label: "Sign", completed: false },
            ].map((item, index) => (
              <React.Fragment key={item.step}>
                <div
                  className={`flex items-center space-x-2 ${
                    currentStep === item.step
                      ? "text-red-600"
                      : item.completed
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                      currentStep === item.step
                        ? "border-red-600 bg-red-600 text-white"
                        : item.completed
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {item.completed ? "✓" : index + 1}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                {index < 3 && (
                  <div
                    className={`w-8 h-0.5 ${
                      item.completed ? "bg-green-600" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === "upload" && renderUploadStep()}
        {currentStep === "signers" && renderSignersStep()}
        {currentStep === "signature-setup" && renderSignatureSetup()}
        {currentStep === "editor" && renderEditor()}
      </div>
    </div>
  );
};

export default PDFSignatureTool;
