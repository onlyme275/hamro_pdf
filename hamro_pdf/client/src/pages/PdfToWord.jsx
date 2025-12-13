import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";

import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";

const PdfToWordConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [convertedContent, setConvertedContent] = useState(null);
  const [error, setError] = useState(null);
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadPdfJs = () => {
      if (window.pdfjsLib) {
        setPdfjsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          setPdfjsLoaded(true);
        } else {
          setError("Failed to load PDF.js library");
        }
      };
      script.onerror = () => setError("Failed to load PDF.js from CDN");
      document.head.appendChild(script);
    };

    if (typeof window !== "undefined") {
      loadPdfJs();
    }
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setConversionComplete(false);
      setProgress(0);
      setError(null);
      setProgressMessage("");
    } else if (file) {
      setError("Please select a valid PDF file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setConversionComplete(false);
      setProgress(0);
      setError(null);
      setProgressMessage("");
    } else if (file) {
      setError("Please drop a valid PDF file.");
    }
  };

  const normalizeText = (text) => {
    if (!text) return "";

    let normalized = text;
    normalized = normalized.replace(/\u00A0/g, " ");
    normalized = normalized.replace(/[ \t]+/g, " ");

    return normalized;
  };

  const extractImagesFromPDF = async (pdf, onProgress) => {
    const allImages = [];
    const numPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      onProgress(`Extracting images from page ${pageNum} of ${numPages}...`);

      const page = await pdf.getPage(pageNum);
      const operatorList = await page.getOperatorList();

      for (let i = 0; i < operatorList.fnArray.length; i++) {
        if (
          operatorList.fnArray[i] === window.pdfjsLib.OPS.paintImageXObject ||
          operatorList.fnArray[i] ===
            window.pdfjsLib.OPS.paintInlineImageXObject
        ) {
          try {
            const imageName = operatorList.argsArray[i][0];
            const image = await page.objs.get(imageName);

            if (image && image.data) {
              const canvas = document.createElement("canvas");
              canvas.width = image.width;
              canvas.height = image.height;
              const ctx = canvas.getContext("2d");

              const imageData = ctx.createImageData(image.width, image.height);
              imageData.data.set(image.data);
              ctx.putImageData(imageData, 0, 0);

              const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/png")
              );

              allImages.push({
                pageNumber: pageNum,
                blob: blob,
                width: image.width,
                height: image.height,
              });
            }
          } catch (err) {
            console.warn(`Failed to extract image on page ${pageNum}:`, err);
          }
        }
      }
    }

    return allImages;
  };

  const extractTextFromPDF = async (arrayBuffer, onProgress) => {
    try {
      if (!window.pdfjsLib) {
        throw new Error("PDF.js library not loaded");
      }

      const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdf.numPages;
      const pages = [];

      onProgress("Scanning for images...");
      const images = await extractImagesFromPDF(pdf, onProgress);
      onProgress(`Found ${images.length} image(s). Extracting text...`);

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        onProgress(`Extracting text from page ${pageNum} of ${numPages}...`);

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const lines = new Map();

        textContent.items.forEach((item) => {
          const y = Math.round(item.transform[5]);
          if (!lines.has(y)) {
            lines.set(y, []);
          }
          lines.get(y).push({
            text: item.str,
            x: item.transform[4],
            width: item.width,
            height: item.height,
          });
        });

        const sortedLines = Array.from(lines.entries())
          .sort(([y1], [y2]) => y2 - y1)
          .map(([_, items]) => {
            return items.sort((a, b) => a.x - b.x);
          });

        let pageText = "";
        sortedLines.forEach((lineItems, lineIndex) => {
          let lineText = "";

          lineItems.forEach((item, itemIndex) => {
            lineText += item.text;

            if (itemIndex < lineItems.length - 1) {
              const nextItem = lineItems[itemIndex + 1];
              const gap = nextItem.x - (item.x + item.width);
              if (gap > 3) {
                lineText += " ";
              }
            }
          });

          pageText += lineText.trim();

          if (lineIndex < sortedLines.length - 1) {
            const currentLineY = Array.from(lines.keys())[lineIndex];
            const nextLineY = Array.from(lines.keys())[lineIndex + 1];
            const gap = Math.abs(currentLineY - nextLineY);

            if (gap > 20) {
              pageText += "\n\n";
            } else {
              pageText += "\n";
            }
          }
        });

        pages.push({
          pageNumber: pageNum,
          text: normalizeText(pageText.trim()),
        });

        const progressPercent = Math.round((pageNum / numPages) * 50);
        setProgress(progressPercent);
      }

      const fullText = pages.map((p) => p.text).join("\n\n");
      return { fullText, pages, images };
    } catch (error) {
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  };

  const processText = (text) => {
    if (!text) return [];

    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    return paragraphs
      .map((paragraph) => {
        const lines = paragraph.split("\n").filter((l) => l.trim());

        if (lines.length > 1) {
          const bulletLines = lines.filter((line) =>
            /^[•●○◦■□▪▫‣⁃⦿⦾➢▶▸►▹∙◆◇]\s/.test(line.trim())
          );

          if (bulletLines.length / lines.length > 0.7) {
            return lines.map((line) => {
              const cleanText = line
                .trim()
                .replace(/^[•●○◦■□▪▫‣⁃⦿⦾➢▶▸►▹∙◆◇\-–—*+]\s*/, "");
              return {
                text: cleanText,
                isHeading: false,
                isList: true,
                isCode: false,
                level: 0,
                indent: 1,
              };
            });
          }
        }

        const cleanText = paragraph
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        const wordCount = cleanText.split(" ").length;
        const isShort = wordCount <= 15;
        const isVeryShort = wordCount <= 8;
        const isAllCaps =
          cleanText === cleanText.toUpperCase() && /[A-Z]/.test(cleanText);
        const startsWithNumber = /^(\d+[\.\)]\s)/.test(cleanText);
        const endsWithColon = cleanText.endsWith(":");

        const isHeading =
          (isVeryShort && isAllCaps && cleanText.length > 5) ||
          (isShort && (endsWithColon || startsWithNumber) && wordCount >= 2) ||
          (isShort &&
            /^(Introduction|Conclusion|Overview|Summary|Background|Abstract)/i.test(
              cleanText
            ));

        const actuallyStartsWithBullet = /^[•●○◦■□▪▫‣⁃⦿⦾➢▶▸►▹∙◆◇\-–—*+]\s/.test(
          cleanText
        );
        const isList =
          actuallyStartsWithBullet || /^\d+[\.\)]\s/.test(cleanText);

        const isCode =
          cleanText.includes("#!/bin") ||
          cleanText.includes("$ ") ||
          /^[a-z]+\s*~\s*#/.test(cleanText);

        let level = 0;
        if (isHeading) {
          if (isAllCaps && wordCount <= 4) {
            level = 1;
          } else if (startsWithNumber || isAllCaps) {
            level = 2;
          } else {
            level = 3;
          }
        }

        let displayText = cleanText;
        if (isList) {
          displayText = cleanText.replace(
            /^[•●○◦■□▪▫‣⁃⦿⦾➢▶▸►▹∙◆◇\-–—*+]\s*/,
            ""
          );
        }

        return {
          text: displayText,
          isHeading,
          isList,
          isCode,
          level,
          indent: isList ? 1 : 0,
        };
      })
      .flat();
  };

  const generateWordDocument = async (content, filename, images = []) => {
    try {
      setProgressMessage("Generating Word document with images...");
      setProgress(70);

      const processedContent = processText(content);
      const children = [];

      const imageBuffers = await Promise.all(
        images.map(async (img) => {
          const arrayBuffer = await img.blob.arrayBuffer();
          return {
            ...img,
            buffer: new Uint8Array(arrayBuffer),
          };
        })
      );

      let imageIndex = 0;
      const itemsPerImage = Math.max(
        1,
        Math.floor(processedContent.length / Math.max(1, imageBuffers.length))
      );

      for (let index = 0; index < processedContent.length; index++) {
        const item = processedContent[index];
        const { text, isHeading, isList, isCode, level } = item;

        if (
          imageIndex < imageBuffers.length &&
          index > 0 &&
          index % itemsPerImage === 0
        ) {
          const img = imageBuffers[imageIndex];
          try {
            const maxWidth = 600;
            const scale = Math.min(1, maxWidth / img.width);
            const displayWidth = Math.round(img.width * scale);
            const displayHeight = Math.round(img.height * scale);

            children.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: img.buffer,
                    transformation: {
                      width: displayWidth,
                      height: displayHeight,
                    },
                  }),
                ],
                spacing: { before: 200, after: 200 },
              })
            );

            imageIndex++;
          } catch (err) {
            console.warn("Failed to embed image:", err);
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `[Image from page ${img.pageNumber}]`,
                    italics: true,
                    color: "999999",
                  }),
                ],
                spacing: { before: 150, after: 150 },
              })
            );
            imageIndex++;
          }
        }

        if (isHeading) {
          const sizes = { 1: 36, 2: 28, 3: 24 };
          const colors = { 1: "000000", 2: "000000", 3: "000000" };

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  bold: true,
                  size: sizes[level] || 24,
                  color: colors[level] || "000000",
                }),
              ],
              spacing: {
                before: index > 0 ? 240 : 120,
                after: 120,
              },
            })
          );
        } else if (isCode) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  size: 20,
                  font: "Courier New",
                  color: "333333",
                }),
              ],
              spacing: { after: 120, before: 120 },
              indent: { left: 720 },
            })
          );
        } else if (isList) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  size: 22,
                }),
              ],
              bullet: {
                level: 0,
              },
              spacing: { after: 80 },
            })
          );
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  size: 22,
                }),
              ],
              spacing: {
                after: 120,
              },
            })
          );
        }
      }

      while (imageIndex < imageBuffers.length) {
        const img = imageBuffers[imageIndex];
        try {
          const maxWidth = 600;
          const scale = Math.min(1, maxWidth / img.width);
          const displayWidth = Math.round(img.width * scale);
          const displayHeight = Math.round(img.height * scale);

          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: img.buffer,
                  transformation: {
                    width: displayWidth,
                    height: displayHeight,
                  },
                }),
              ],
              spacing: { before: 200, after: 200 },
            })
          );
        } catch (err) {
          console.warn("Failed to embed remaining image:", err);
        }
        imageIndex++;
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440,
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children: children,
          },
        ],
        creator: "PDF to Word Converter",
        title: `Converted ${filename}`,
        description: "PDF to Word conversion preserving layout and images",
      });

      setProgress(95);
      setProgressMessage("Finalizing document...");

      const blob = await Packer.toBlob(doc);
      setProgress(100);

      return blob;
    } catch (error) {
      throw new Error(`Word document generation failed: ${error.message}`);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setProgress(0);
    setError(null);
    setConvertedContent(null);

    try {
      setProgressMessage("Reading PDF file...");
      const arrayBuffer = await selectedFile.arrayBuffer();
      setProgress(5);

      let finalText = "";
      let extractedImages = [];
      let extractionMethod = "Unknown";

      if (pdfjsLoaded) {
        try {
          setProgressMessage("Extracting text and images...");
          const { fullText, images } = await extractTextFromPDF(
            arrayBuffer,
            setProgressMessage
          );
          finalText = fullText;
          extractedImages = images;
          extractionMethod = "PDF.js Extraction with Images";
        } catch (error) {
          console.warn("PDF.js extraction failed:", error);
          throw new Error(
            "Failed to extract text from PDF. The file may be corrupted or encrypted."
          );
        }
      } else {
        throw new Error(
          "PDF.js library not loaded. Please refresh the page and try again."
        );
      }

      if (!finalText || finalText.length < 20) {
        throw new Error(
          "No readable text found in the PDF. The document may contain only images."
        );
      }

      const wordBlob = await generateWordDocument(
        finalText,
        selectedFile.name,
        extractedImages
      );

      setConvertedContent({
        blob: wordBlob,
        filename: selectedFile.name.replace(".pdf", "_converted.docx"),
        originalText: finalText,
        textLength: finalText.length,
        imageCount: extractedImages.length,
        processingMethod: extractionMethod,
      });

      setConversionComplete(true);
      setProgressMessage("Conversion completed successfully!");
    } catch (error) {
      setError(error.message);
      setProgress(0);
      setProgressMessage("");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedContent) return;

    const url = window.URL.createObjectURL(convertedContent.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = convertedContent.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setConversionComplete(false);
    setProgress(0);
    setProgressMessage("");
    setConvertedContent(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  PDF to Word Converter
                </h1>
                <p className="text-sm text-gray-600">
                  With image extraction and layout preservation
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                selectedFile
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={resetConverter}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drop your PDF here
                    </p>
                    <p className="text-gray-600">or click to browse files</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Select PDF File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {(isConverting || conversionComplete) && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {progressMessage || "Processing..."}
                  </span>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {conversionComplete && convertedContent && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <strong>✓ Conversion Complete!</strong>
                      <br />
                      File: {convertedContent.filename}
                      <br />
                      Extracted: {convertedContent.textLength.toLocaleString()}{" "}
                      characters
                      <br />
                      Images found: {convertedContent.imageCount || 0}
                      <br />
                      Method: {convertedContent.processingMethod}
                      <br />
                      Layout preserved with proper formatting
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {!conversionComplete ? (
                <button
                  onClick={handleConvert}
                  disabled={!selectedFile || isConverting || !pdfjsLoaded}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isConverting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Converting...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Convert to Word</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex-1 space-y-3">
                  <button
                    onClick={handleDownload}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Word Document</span>
                  </button>
                  <button
                    onClick={resetConverter}
                    className="w-full bg-gray-500 text-white py-2 px-6 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200"
                  >
                    Convert Another File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PdfToWordConverter;
