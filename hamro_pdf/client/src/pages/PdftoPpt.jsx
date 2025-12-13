// client/src/pages/PdftoPpt.jsx
import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const PDFToPPTConverter = () => {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStatus, setConversionStatus] = useState("");
  const [convertedFile, setConvertedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [pdfPages, setPdfPages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
      setConvertedFile(null);
      setProgress(0);
      setPdfPages([]);
    } else {
      setError("Please select a valid PDF file");
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelect(droppedFile);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Load PDF.js dynamically from CDN
  const loadPDFJS = async () => {
    if (window.pdfjsLib) return window.pdfjsLib;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const extractPDFContent = async (file) => {
    try {
      const pdfjsLib = await loadPDFJS();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setConversionStatus(
          `Extracting content from page ${i} of ${pdf.numPages}...`
        );
        setProgress(20 + (i / pdf.numPages) * 30);

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 2.0 });

        // Extract text
        const textItems = textContent.items.map((item) => ({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
          fontSize: item.height,
        }));

        // Group text by approximate lines
        const lines = [];
        const lineHeight = 20;

        textItems.forEach((item) => {
          if (item.text.trim()) {
            const existingLine = lines.find(
              (line) => Math.abs(line.y - item.y) < lineHeight
            );

            if (existingLine) {
              existingLine.items.push(item);
            } else {
              lines.push({
                y: item.y,
                items: [item],
              });
            }
          }
        });

        // Sort lines by Y position (top to bottom)
        lines.sort((a, b) => b.y - a.y);

        // Extract structured text
        const structuredText = lines
          .map((line) => {
            const sortedItems = line.items.sort((a, b) => a.x - b.x);
            return sortedItems
              .map((item) => item.text)
              .join(" ")
              .trim();
          })
          .filter((line) => line.length > 0);

        // Create canvas for page rendering
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        const imageDataUrl = canvas.toDataURL("image/png");

        console.log(
          `Page ${i} image created:`,
          imageDataUrl.substring(0, 50) + "..."
        );

        pages.push({
          pageNumber: i,
          textLines: structuredText,
          fullText: structuredText.join(" "),
          image: imageDataUrl,
          width: viewport.width,
          height: viewport.height,
        });
      }

      return pages;
    } catch (error) {
      throw new Error(`Failed to extract PDF content: ${error.message}`);
    }
  };

  // Create PowerPoint using a simple XML-based approach
  const createPowerPointPresentation = async (pages) => {
    setConversionStatus("Generating PowerPoint presentation...");
    setProgress(70);

    const presentationXml = generatePresentationXML(pages);
    const slideXmls = pages.map((page, index) =>
      generateSlideXML(page, index + 1)
    );

    // Create zip file structure for PPTX
    const JSZip = await loadJSZip();
    const zip = new JSZip();

    // Add required PPTX structure
    zip.file("[Content_Types].xml", generateContentTypesXML(pages.length));
    zip.file("_rels/.rels", generateRelsXML());
    zip.file(
      "ppt/_rels/presentation.xml.rels",
      generatePresentationRelsXML(pages.length)
    );
    zip.file("ppt/presentation.xml", presentationXml);

    // Add slides
    slideXmls.forEach((slideXml, index) => {
      zip.file(`ppt/slides/slide${index + 1}.xml`, slideXml);
      zip.file(
        `ppt/slides/_rels/slide${index + 1}.xml.rels`,
        generateSlideRelsXML(index + 1)
      );
    });

    // Add images - with validation
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].image) {
        const base64Data = pages[i].image.split(",")[1];
        if (base64Data && base64Data.length > 0) {
          zip.file(`ppt/media/image${i + 1}.png`, base64Data, { base64: true });
          console.log(
            `Added image${i + 1}.png to zip, size:`,
            base64Data.length
          );
        } else {
          console.error(`Image ${i + 1} has no data`);
        }
      }
    }

    setProgress(90);
    const blob = await zip.generateAsync({ type: "blob" });
    return blob;
  };

  // Load JSZip dynamically
  const loadJSZip = async () => {
    if (window.JSZip) return window.JSZip;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      script.onload = () => resolve(window.JSZip);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const generateContentTypesXML = (slideCount) => {
    let slideOverrides = "";
    for (let i = 1; i <= slideCount; i++) {
      slideOverrides += `<Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
    }

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
${slideOverrides}
</Types>`;
  };

  const generateRelsXML = () => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;
  };

  const generatePresentationRelsXML = (slideCount) => {
    let slideRels = "";
    for (let i = 1; i <= slideCount; i++) {
      slideRels += `<Relationship Id="rId${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>`;
    }

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${slideRels}
</Relationships>`;
  };

  const generateSlideRelsXML = (slideIndex) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${slideIndex}.png"/>
</Relationships>`;
  };

  const generatePresentationXML = (pages) => {
    let slideIds = "";
    for (let i = 1; i <= pages.length; i++) {
      slideIds += `<p:sldId id="${255 + i}" r:id="rId${i}"/>`;
    }

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
<p:sldIdLst>
${slideIds}
</p:sldIdLst>
<p:sldSz cx="9144000" cy="6858000"/>
<p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`;
  };

  const generateSlideXML = (pageData, slideIndex) => {
    // Process ALL text lines without limits
    const processedLines = pageData.textLines
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        return `<a:p>
          <a:pPr lvl="0">
            <a:buChar char="•"/>
          </a:pPr>
          <a:r>
            <a:rPr lang="en-US" sz="1200" dirty="0">
              <a:solidFill>
                <a:schemeClr val="tx1"/>
              </a:solidFill>
              <a:latin typeface="+mn-lt"/>
            </a:rPr>
            <a:t>${escapeXml(line)}</a:t>
          </a:r>
        </a:p>`;
      })
      .join("");

    // Add empty paragraph if no content
    const finalTextContent =
      processedLines ||
      `<a:p>
      <a:r>
        <a:rPr lang="en-US" sz="1200">
          <a:solidFill><a:schemeClr val="tx1"/></a:solidFill>
        </a:rPr>
        <a:t>No text content extracted from this page.</a:t>
      </a:r>
    </a:p>`;

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="9144000" cy="6858000"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="9144000" cy="6858000"/>
        </a:xfrm>
      </p:grpSpPr>
      
      <!-- Title Shape -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="457200" y="274638"/>
            <a:ext cx="8229600" cy="1000000"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </p:spPr>
        <p:txBody>
          <a:bodyPr wrap="square" rtlCol="0">
            <a:spAutoFit/>
          </a:bodyPr>
          <a:lstStyle/>
          <a:p>
            <a:pPr algn="ctr"/>
            <a:r>
              <a:rPr lang="en-US" sz="2400" dirty="0" b="1">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="+mj-lt"/>
              </a:rPr>
              <a:t>Page ${pageData.pageNumber}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>

      <!-- Content Text Box - LEFT SIDE -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Content Placeholder"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="body" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="457200" y="1428750"/>
            <a:ext cx="4500000" cy="5000000"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </p:spPr>
        <p:txBody>
          <a:bodyPr wrap="square" rtlCol="0" anchor="t">
            <a:normAutofit fontScale="90000" lnSpcReduction="15000"/>
          </a:bodyPr>
          <a:lstStyle>
            <a:lvl1pPr marL="228600" indent="-228600">
              <a:buChar char="•"/>
              <a:defRPr sz="1200">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          ${finalTextContent}
        </p:txBody>
      </p:sp>

      <!-- Image Shape - RIGHT SIDE -->
      // <p:pic>
      //   <p:nvPicPr>
      //     <p:cNvPr id="4" name="PDF Page Image" descr="Page ${pageData.pageNumber} preview"/>
      //     <p:cNvPicPr>
      //       <a:picLocks noChangeAspect="1"/>
      //     </p:cNvPicPr>
      //     <p:nvPr/>
      //   </p:nvPicPr>
      //   <p:blipFill>
      //     <a:blip r:embed="rId1">
      //       <a:extLst>
      //         <a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}">
      //           <a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/>
      //         </a:ext>
      //       </a:extLst>
      //     </a:blip>
      //     <a:stretch>
      //       <a:fillRect/>
      //     </a:stretch>
      //   </p:blipFill>
      //   <p:spPr>
      //     <a:xfrm>
      //       <a:off x="5200000" y="1428750"/>
      //       <a:ext cx="3500000" cy="5000000"/>
      //     </a:xfrm>
      //     <a:prstGeom prst="rect">
      //       <a:avLst/>
      //     </a:prstGeom>
      //   </p:spPr>
      // </p:pic>

    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sld>`;
  };

  const escapeXml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const convertPDFToPPT = async () => {
    if (!file) return;

    setIsConverting(true);
    setError("");
    setProgress(10);

    try {
      setConversionStatus("Initializing PDF processing...");

      const pages = await extractPDFContent(file);
      setPdfPages(pages);

      setConversionStatus("Creating PowerPoint structure...");
      setProgress(60);

      const pptxBlob = await createPowerPointPresentation(pages);

      setProgress(100);
      setConversionStatus("Conversion completed successfully!");

      const convertedFileName = file.name.replace(".pdf", ".pptx");
      setConvertedFile({
        blob: pptxBlob,
        name: convertedFileName,
        size: pptxBlob.size,
        pageCount: pages.length,
      });
    } catch (err) {
      console.error("Conversion error:", err);
      setError(`Conversion failed: ${err.message}`);
      setConversionStatus("");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPPT = () => {
    if (!convertedFile) return;

    const url = URL.createObjectURL(convertedFile.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = convertedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetConverter = () => {
    setFile(null);
    setConvertedFile(null);
    setError("");
    setConversionStatus("");
    setProgress(0);
    setPdfPages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            PDF to PowerPoint Converter
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform your PDF documents into professional PowerPoint
            presentations with preserved formatting and layout
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Upload Section */}
          {!file && (
            <div className="p-8">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-16 w-16 text-gray-400 group-hover:text-blue-500 mb-6 transition-colors" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Upload Your PDF Document
                </h3>
                <p className="text-gray-500 mb-6 text-lg">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl">
                  Select PDF File
                </button>
                <p className="text-sm text-gray-400 mt-4">
                  Maximum file size: 50MB • Supports: PDF files only
                </p>
              </div>
            </div>
          )}

          {/* File Info & Conversion Section */}
          {file && (
            <div className="p-8">
              {/* File Information */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-12 w-12 text-red-500 mr-4" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {file.name}
                      </h4>
                      <p className="text-gray-600">
                        {formatFileSize(file.size)} • PDF Document
                        {pdfPages.length > 0 && ` • ${pdfPages.length} pages`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetConverter}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Conversion Progress */}
              {isConverting && (
                <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Loader2 className="h-5 w-5 text-blue-600 mr-3 animate-spin" />
                      <span className="font-medium text-blue-900">
                        {conversionStatus}
                      </span>
                    </div>
                    <span className="text-sm text-blue-700 font-medium">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success & Download Section */}
              {convertedFile && !isConverting && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                      <div>
                        <p className="text-green-800 font-semibold text-lg mb-2">
                          Conversion Completed Successfully!
                        </p>
                        <div className="text-sm text-green-700 space-y-1">
                          <p>
                            <strong>Output:</strong> {convertedFile.name}
                          </p>
                          <p>
                            <strong>Size:</strong>{" "}
                            {formatFileSize(convertedFile.size)}
                          </p>
                          <p>
                            <strong>Pages converted:</strong>{" "}
                            {convertedFile.pageCount}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={downloadPPT}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download PPTX
                    </button>
                  </div>
                </div>
              )}

              {/* Convert Button */}
              {!convertedFile && !isConverting && (
                <div className="text-center">
                  <button
                    onClick={convertPDFToPPT}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!file}
                  >
                    Convert to PowerPoint
                  </button>
                </div>
              )}

              {/* New Conversion Button */}
              {convertedFile && !isConverting && (
                <div className="text-center mt-6">
                  <button
                    onClick={resetConverter}
                    className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium"
                  >
                    Convert Another File
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-8 border-t pt-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 text-center border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {/* <h3 className="text-xl font-bold text-gray-800">Optimized!</h3> */}
            </div>

            <div className="mt-4 inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Ready to convert!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFToPPTConverter;
