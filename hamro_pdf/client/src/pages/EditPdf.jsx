import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  Type,
  Highlighter,
  Square,
  Scissors,
  MousePointer2,
  Eraser,
  Download,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  FileText,
  Trash2,
} from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const CSS_DPI = 96;
const PDF_DPI = 72;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

const TOOL = {
  SELECT: "select",
  TEXT: "text",
  HIGHLIGHT: "highlight",
  RECT: "rect",
  REDACT: "redact",
  IMAGE: "image",
  ERASE: "erase",
  PAN: "pan",
};

const defaultTextStyle = {
  fontSize: 14,
  color: "#111111",
  fontName: "Helvetica",
};
const defaultHighlightStyle = { color: "#ffff00", opacity: 0.35 };
const defaultRectStyle = { strokeWidth: 2, color: "#111111", fillOpacity: 0 };
const defaultRedactStyle = { color: "#000000" };

export default function PdfEditor() {
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [arrayBuffer, setArrayBuffer] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [renderScale, setRenderScale] = useState(1.25);
  const [pagesMeta, setPagesMeta] = useState([]);
  const [pageDimensions, setPageDimensions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fontFile, setFontFile] = useState(null);
  const [imageStamp, setImageStamp] = useState(null);
  const [activeTool, setActiveTool] = useState(TOOL.SELECT);
  const [overlays, setOverlays] = useState({});
  const [selection, setSelection] = useState({ page: null, id: null });
  const [dragging, setDragging] = useState(null);
  const [creating, setCreating] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [inlineEditor, setInlineEditor] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const panRef = useRef({ x: 0, y: 0 });
  const canvasRefs = useRef({});

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
        }
      };
      script.onerror = () => console.error("Failed to load PDF.js");
      document.head.appendChild(script);
    };
    if (typeof window !== "undefined") loadPdfJs();
  }, []);

  // Convert between screen pixels and normalized PDF points
  const screenToPdfCoords = (pageIdx, screenX, screenY, screenW, screenH) => {
    // Get the viewport at scale 1 (base coordinates)
    const meta = pagesMeta[pageIdx];
    if (!meta) return { x: screenX, y: screenY, w: screenW, h: screenH };

    // Convert from current render scale back to base scale
    const baseX = screenX / renderScale;
    const baseY = screenY / renderScale;
    const baseW = screenW / renderScale;
    const baseH = screenH / renderScale;

    return { x: baseX, y: baseY, w: baseW, h: baseH };
  };

  const pdfToScreenCoords = (pageIdx, pdfX, pdfY, pdfW, pdfH) => {
    // Convert from base scale to current render scale for display
    return {
      x: pdfX * renderScale,
      y: pdfY * renderScale,
      w: pdfW * renderScale,
      h: pdfH * renderScale,
    };
  };

  const handleSelectPdf = async (file) => {
    if (!file || file.type !== "application/pdf") return;
    setSelectedFile(file);
    const buf = await file.arrayBuffer();
    // Create a copy to prevent detached ArrayBuffer issues
    const bufferCopy = buf.slice(0);
    setArrayBuffer(bufferCopy);

    if (!pdfjsLoaded || !window.pdfjsLib) {
      console.error("PDF.js not loaded yet");
      return;
    }

    try {
      const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);

      const meta = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport1 = page.getViewport({ scale: 1 });
        meta.push({
          widthPx: viewport1.width,
          heightPx: viewport1.height,
          widthPt: (viewport1.width * PDF_DPI) / CSS_DPI,
          heightPt: (viewport1.height * PDF_DPI) / CSS_DPI,
        });
      }
      setPagesMeta(meta);
      setOverlays({});
      setSelection({ page: null, id: null });
    } catch (e) {
      console.error("Error loading PDF:", e);
      alert("Failed to load PDF: " + e.message);
    }
  };

  const handleSelectFont = async (file) => {
    if (!file) return;
    const ab = await file.arrayBuffer();
    setFontFile(ab);
  };

  const handleSelectStamp = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageStamp({ dataURL: e.target.result, mime: file.type });
      setActiveTool(TOOL.IMAGE);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    (async () => {
      if (!pdfDoc || !pdfjsLoaded || !window.pdfjsLib) return;

      const dims = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: renderScale });
        const canvas = canvasRefs.current[i - 1];

        if (!canvas) continue;

        const ctx = canvas.getContext("2d", { alpha: false });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        dims.push({ width: viewport.width, height: viewport.height });

        await page.render({ canvasContext: ctx, viewport }).promise;
      }
      setPageDimensions(dims);
    })();
  }, [pdfDoc, numPages, pdfjsLoaded, renderScale]);

  const pageOverlays = (page) => overlays[page] || [];
  const setPageOverlays = (page, items) =>
    setOverlays((prev) => ({ ...prev, [page]: items }));

  const addOverlay = (page, item) => {
    const items = pageOverlays(page);
    const withId = { id: crypto.randomUUID(), ...item };
    console.log(`💾 Stored overlay on page ${page}:`, withId);
    setPageOverlays(page, [...items, withId]);
    setSelection({ page, id: withId.id });
  };

  const removeOverlay = (page, id) => {
    setPageOverlays(
      page,
      pageOverlays(page).filter((o) => o.id !== id)
    );
    setSelection({ page: null, id: null });
  };

  const pointInItem = (page, screenX, screenY, item) => {
    // Convert normalized item coords to screen coords for hit testing
    const screen = pdfToScreenCoords(page, item.x, item.y, item.w, item.h);
    const hit =
      screenX >= screen.x &&
      screenY >= screen.y &&
      screenX <= screen.x + screen.w &&
      screenY <= screen.y + screen.h;
    // Debug logging
    if (hit) {
      console.log(
        `🎯 Hit! Click (${screenX.toFixed(0)}, ${screenY.toFixed(
          0
        )}) hits item at (${screen.x.toFixed(0)}, ${screen.y.toFixed(
          0
        )}) size ${screen.w.toFixed(0)}x${screen.h.toFixed(0)}`
      );
    }
    return hit;
  };

  const tempItem = (type, x, y, w, h) => {
    if (type === TOOL.HIGHLIGHT)
      return { type: "highlight", x, y, w, h, ...defaultHighlightStyle };
    if (type === TOOL.RECT)
      return { type: "rect", x, y, w, h, ...defaultRectStyle };
    if (type === TOOL.REDACT)
      return { type: "redact", x, y, w, h, ...defaultRedactStyle };
    return { type: "rect", x, y, w, h, ...defaultRectStyle };
  };

  const onPageMouseDown = (page, e) => {
    if (activeTool === TOOL.PAN) {
      setIsPanning(true);
      panRef.current = { startX: e.clientX, startY: e.clientY };
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === TOOL.SELECT) {
      const items = pageOverlays(page);
      for (let i = items.length - 1; i >= 0; i--) {
        if (pointInItem(page, x, y, items[i])) {
          setSelection({ page, id: items[i].id });
          setDragging({
            page,
            id: items[i].id,
            startX: x,
            startY: y,
            orig: { ...items[i] },
          });
          return;
        }
      }
      setSelection({ page: null, id: null });
    } else if (
      activeTool === TOOL.HIGHLIGHT ||
      activeTool === TOOL.RECT ||
      activeTool === TOOL.REDACT
    ) {
      setCreating({ page, type: activeTool, x0: x, y0: y });
    } else if (activeTool === TOOL.TEXT) {
      // Position relative to viewport for proper text editor placement
      setInlineEditor({
        page,
        x: e.clientX,
        y: e.clientY,
        relX: x,
        relY: y,
        value: "",
      });
    } else if (activeTool === TOOL.IMAGE && imageStamp) {
      const imgW = 150;
      const imgH = 90;
      const normalized = screenToPdfCoords(
        page,
        x - imgW / 2,
        y - imgH / 2,
        imgW,
        imgH
      );
      addOverlay(page, {
        type: "image",
        x: normalized.x,
        y: normalized.y,
        w: normalized.w,
        h: normalized.h,
        ...imageStamp,
      });
    } else if (activeTool === TOOL.ERASE) {
      const items = pageOverlays(page);
      for (let i = items.length - 1; i >= 0; i--) {
        if (pointInItem(page, x, y, items[i])) {
          removeOverlay(page, items[i].id);
          break;
        }
      }
    }
  };

  const onPageMouseMove = (page, e) => {
    if (isPanning) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dragging && dragging.page === page) {
      const items = pageOverlays(page);
      const idx = items.findIndex((o) => o.id === dragging.id);
      if (idx >= 0) {
        const dx = x - dragging.startX;
        const dy = y - dragging.startY;
        const orig = dragging.orig;

        // Convert delta to normalized space
        const normalizedDx = dx / renderScale;
        const normalizedDy = dy / renderScale;

        const next = [...items];
        next[idx] = {
          ...orig,
          x: orig.x + normalizedDx,
          y: orig.y + normalizedDy,
        };
        setPageOverlays(page, next);
      }
    }

    if (creating && creating.page === page) {
      const { x0, y0, type } = creating;
      const xMin = Math.min(x0, x);
      const yMin = Math.min(y0, y);
      const w = Math.abs(x - x0);
      const h = Math.abs(y - y0);

      // Convert to normalized coordinates for temporary display
      const normalized = screenToPdfCoords(page, xMin, yMin, w, h);
      setSelection((sel) => ({
        ...sel,
        tempItem: {
          page,
          item: tempItem(
            type,
            normalized.x,
            normalized.y,
            normalized.w,
            normalized.h
          ),
        },
      }));
    }
  };

  const onPageMouseUp = (page, e) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (dragging) {
      setDragging(null);
      return;
    }

    if (creating && creating.page === page) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x1 = e.clientX - rect.left;
      const y1 = e.clientY - rect.top;
      const { x0, y0, type } = creating;
      const w = Math.abs(x1 - x0);
      const h = Math.abs(y1 - y0);
      if (w > 2 && h > 2) {
        const xMin = Math.min(x0, x1);
        const yMin = Math.min(y0, y1);
        // Convert to normalized coordinates
        const normalized = screenToPdfCoords(page, xMin, yMin, w, h);
        addOverlay(
          page,
          tempItem(type, normalized.x, normalized.y, normalized.w, normalized.h)
        );
      }
      setCreating(null);
      setSelection((sel) => ({ ...sel, tempItem: null }));
    }
  };

  const commitInlineText = () => {
    if (!inlineEditor || !inlineEditor.value.trim()) {
      setInlineEditor(null);
      return;
    }
    const { page, relX, relY, value } = inlineEditor;
    const w = Math.max(100, value.length * 8);
    const h = 20;

    // Store in normalized coordinates (scale-independent)
    const normalized = screenToPdfCoords(page, relX, relY - h, w, h);
    const textItem = {
      type: "text",
      text: value,
      x: normalized.x,
      y: normalized.y,
      w: normalized.w,
      h: normalized.h,
      ...defaultTextStyle,
    };
    console.log(
      `✅ Adding text "${value}" - Screen: (${relX}, ${
        relY - h
      }), Normalized: (${normalized.x.toFixed(2)}, ${normalized.y.toFixed(2)})`
    );
    addOverlay(page, textItem);
    setInlineEditor(null);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!isPanning) return;
      const dx = e.clientX - panRef.current.startX;
      const dy = e.clientY - panRef.current.startY;
      window.scrollBy(-dx, -dy);
      panRef.current.startX = e.clientX;
      panRef.current.startY = e.clientY;
    };
    const onUp = () => setIsPanning(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isPanning]);

  const exportPdf = async () => {
    if (!arrayBuffer) {
      alert("No PDF loaded!");
      return;
    }

    setIsExporting(true);
    console.log("Starting export...");

    try {
      // Create a fresh copy of the ArrayBuffer to avoid detachment issues
      const bufferCopy = arrayBuffer.slice(0);
      const pdfDocLib = await PDFDocument.load(bufferCopy);
      console.log("PDF loaded, page count:", pdfDocLib.getPageCount());

      let customFont = null;
      if (fontFile) {
        try {
          customFont = await pdfDocLib.embedFont(new Uint8Array(fontFile), {
            subset: true,
          });
          console.log("Custom font embedded");
        } catch (e) {
          console.warn("Custom font failed, using Helvetica", e);
        }
      }
      const helvetica = await pdfDocLib.embedFont(StandardFonts.Helvetica);

      for (let p = 0; p < pdfDocLib.getPageCount(); p++) {
        const page = pdfDocLib.getPage(p);
        const meta = pagesMeta[p];
        if (!meta) continue;

        // Get the actual PDF page dimensions
        const { height: pdfPageHeight } = page.getSize();

        const items = pageOverlays(p);
        console.log(
          `📄 Page ${p}: ${items.length} overlays, PDF page height: ${pdfPageHeight}pt`
        );

        for (const it of items) {
          console.log(
            `  → Processing ${it.type}: (${it.x.toFixed(2)}, ${it.y.toFixed(
              2
            )}) size: ${it.w?.toFixed(2)}x${it.h?.toFixed(2)}`
          );
          try {
            if (it.type === "text") {
              // Text baseline is at it.y + it.h - 4 (same as SVG rendering)
              const baselineY = it.y + it.h - 4;
              console.log(
                `Text: screen Y=${it.y}, baseline=${baselineY}px, PDF Y=${
                  pdfPageHeight - pxToPt(baselineY)
                }pt`
              );
              page.drawText(it.text, {
                x: pxToPt(it.x),
                y: pdfPageHeight - pxToPt(baselineY),
                size: it.fontSize,
                color: rgb(...hexToRgb(it.color)),
                font: customFont || helvetica,
              });
            } else if (it.type === "highlight") {
              page.drawRectangle({
                x: pxToPt(it.x),
                y: pdfPageHeight - pxToPt(it.y) - pxToPt(it.h),
                width: pxToPt(it.w),
                height: pxToPt(it.h),
                color: rgb(...hexToRgb(it.color)),
                opacity: it.opacity,
              });
            } else if (it.type === "rect") {
              page.drawRectangle({
                x: pxToPt(it.x),
                y: pdfPageHeight - pxToPt(it.y) - pxToPt(it.h),
                width: pxToPt(it.w),
                height: pxToPt(it.h),
                borderWidth: it.strokeWidth,
                borderColor: rgb(...hexToRgb(it.color)),
              });
            } else if (it.type === "redact") {
              page.drawRectangle({
                x: pxToPt(it.x),
                y: pdfPageHeight - pxToPt(it.y) - pxToPt(it.h),
                width: pxToPt(it.w),
                height: pxToPt(it.h),
                color: rgb(...hexToRgb(it.color)),
              });
            } else if (it.type === "image") {
              const bytes = dataURLToBytes(it.dataURL);
              const img = it.mime.includes("png")
                ? await pdfDocLib.embedPng(bytes)
                : await pdfDocLib.embedJpg(bytes);
              page.drawImage(img, {
                x: pxToPt(it.x),
                y: pdfPageHeight - pxToPt(it.y) - pxToPt(it.h),
                width: pxToPt(it.w),
                height: pxToPt(it.h),
              });
            }
          } catch (err) {
            console.error(`Error adding overlay ${it.type}:`, err);
          }
        }
      }

      console.log("Saving PDF...");
      const pdfBytes = await pdfDocLib.save();
      console.log("PDF saved, size:", pdfBytes.length);

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (selectedFile?.name || "document.pdf").replace(
        /\.pdf$/i,
        "_edited.pdf"
      );
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("Export complete!");
      alert("PDF exported successfully!");
    } catch (e) {
      console.error("Export error:", e);
      alert("Export failed: " + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const hexToRgb = (hex) => {
    const h = hex.replace("#", "");
    const bigint = parseInt(
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h,
      16
    );
    return [
      ((bigint >> 16) & 255) / 255,
      ((bigint >> 8) & 255) / 255,
      (bigint & 255) / 255,
    ];
  };

  const dataURLToBytes = (dataURL) => {
    const base64 = dataURL.split(",")[1];
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  };

  const ToolBtn = ({ active, onClick, children, title }) => (
    <button
      title={title}
      onClick={onClick}
      className={`px-3 py-2 rounded-xl border text-sm flex items-center gap-2 transition-colors ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">PDF Editor</h1>
            <p className="text-sm text-gray-600">Edit and export vector PDFs</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-xl border mb-4 p-4">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Choose PDF</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleSelectPdf(e.target.files?.[0])}
              />
            </label>

            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border hover:bg-gray-50">
              <Type className="w-4 h-4" />
              <span className="text-sm">Font (.ttf)</span>
              <input
                type="file"
                accept=".ttf"
                className="hidden"
                onChange={(e) => handleSelectFont(e.target.files?.[0])}
              />
            </label>

            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border hover:bg-gray-50">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-sm">Image</span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => handleSelectStamp(e.target.files?.[0])}
              />
            </label>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setRenderScale((s) => clamp(s * 0.9, 0.5, 3))}
                className="p-2 rounded-lg border hover:bg-gray-50"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRenderScale((s) => clamp(s * 1.1, 0.5, 3))}
                className="p-2 rounded-lg border hover:bg-gray-50"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRenderScale(1.25)}
                className="p-2 rounded-lg border hover:bg-gray-50"
                title="Reset"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={exportPdf}
                disabled={!pdfDoc || isExporting}
                className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? "Exporting…" : "Download"}</span>
              </button>
            </div>
          </div>

          {pdfDoc && (
            <div className="flex flex-wrap gap-2 pt-3 border-t">
              <ToolBtn
                active={activeTool === TOOL.SELECT}
                onClick={() => setActiveTool(TOOL.SELECT)}
                title="Select"
              >
                <MousePointer2 className="w-4 h-4" /> Select
              </ToolBtn>
              <ToolBtn
                active={activeTool === TOOL.TEXT}
                onClick={() => setActiveTool(TOOL.TEXT)}
                title="Text"
              >
                <Type className="w-4 h-4" /> Text
              </ToolBtn>
              <ToolBtn
                active={activeTool === TOOL.HIGHLIGHT}
                onClick={() => setActiveTool(TOOL.HIGHLIGHT)}
                title="Highlight"
              >
                <Highlighter className="w-4 h-4" /> Highlight
              </ToolBtn>
              <ToolBtn
                active={activeTool === TOOL.RECT}
                onClick={() => setActiveTool(TOOL.RECT)}
                title="Rectangle"
              >
                <Square className="w-4 h-4" /> Rect
              </ToolBtn>
              <ToolBtn
                active={activeTool === TOOL.REDACT}
                onClick={() => setActiveTool(TOOL.REDACT)}
                title="Redact"
              >
                <Scissors className="w-4 h-4" /> Redact
              </ToolBtn>
              <ToolBtn
                active={activeTool === TOOL.IMAGE}
                onClick={() => setActiveTool(TOOL.IMAGE)}
                title="Image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>{" "}
                Image
              </ToolBtn>
              <ToolBtn
                active={activeTool === TOOL.ERASE}
                onClick={() => setActiveTool(TOOL.ERASE)}
                title="Erase"
              >
                <Eraser className="w-4 h-4" /> Erase
              </ToolBtn>
              <ToolBtn
                active={activeTool === TOOL.PAN}
                onClick={() => setActiveTool(TOOL.PAN)}
                title="Pan"
              >
                <Move className="w-4 h-4" /> Pan
              </ToolBtn>
            </div>
          )}
        </div>

        {!pdfDoc && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500">
              Upload a PDF to start editing
            </p>
          </div>
        )}

        <div className="space-y-6">
          {Array.from({ length: numPages }, (_, idx) => {
            const dim = pageDimensions[idx] || { width: 0, height: 0 };
            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow border overflow-hidden"
              >
                <div className="relative" style={{ userSelect: "none" }}>
                  <canvas
                    ref={(el) => el && (canvasRefs.current[idx] = el)}
                    className="block w-full h-auto"
                  />
                  <svg
                    className="absolute inset-0 w-full h-full"
                    width={dim.width}
                    height={dim.height}
                    onMouseDown={(e) => onPageMouseDown(idx, e)}
                    onMouseMove={(e) => onPageMouseMove(idx, e)}
                    onMouseUp={(e) => onPageMouseUp(idx, e)}
                    style={{
                      cursor:
                        activeTool === TOOL.PAN
                          ? "grab"
                          : activeTool === TOOL.ERASE
                          ? "crosshair"
                          : activeTool === TOOL.TEXT
                          ? "text"
                          : "default",
                    }}
                  >
                    {pageOverlays(idx).map((it) => (
                      <OverlaySvgItem
                        key={it.id}
                        item={it}
                        selected={
                          selection.page === idx && selection.id === it.id
                        }
                      />
                    ))}
                    {selection.tempItem?.page === idx && (
                      <OverlaySvgItem
                        item={selection.tempItem.item}
                        selected={false}
                        dashed
                      />
                    )}
                  </svg>
                </div>
                {selection.page === idx && selection.id && (
                  <div className="p-2 border-t bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Selected: Page {idx + 1}
                    </div>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center gap-2 text-sm"
                      onClick={() => removeOverlay(idx, selection.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {inlineEditor && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-10"
            onMouseDown={(e) => {
              // Only close if clicking the backdrop, not the input
              if (e.target === e.currentTarget) {
                commitInlineText();
              }
            }}
          >
            <div
              className="absolute bg-white border-2 border-blue-500 rounded-lg shadow-2xl px-3 py-2"
              style={{
                left: inlineEditor.x + 10,
                top: inlineEditor.y + 10,
              }}
            >
              <input
                autoFocus
                className="outline-none text-sm min-w-[250px] px-1"
                placeholder="Type text and press Enter..."
                value={inlineEditor.value}
                onChange={(e) =>
                  setInlineEditor((s) => ({ ...s, value: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitInlineText();
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    setInlineEditor(null);
                  }
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function OverlaySvgItem({ item, selected, dashed }) {
  if (item.type === "text") {
    return (
      <g>
        <text
          x={item.x}
          y={item.y + item.h - 4}
          fontSize={item.fontSize}
          fill={item.color}
          fontFamily={item.fontName}
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {item.text}
        </text>
        {selected && (
          <rect
            x={item.x}
            y={item.y}
            width={item.w}
            height={item.h}
            fill="none"
            stroke="#2563eb"
            strokeWidth={2}
            pointerEvents="none"
          />
        )}
        {/* Debug rectangle to show bounds */}
        <rect
          x={item.x}
          y={item.y}
          width={item.w}
          height={item.h}
          fill="none"
          stroke="red"
          strokeWidth={0.5}
          strokeDasharray="2 2"
          opacity={0.3}
          pointerEvents="none"
        />
      </g>
    );
  }
  if (item.type === "highlight") {
    return (
      <rect
        x={item.x}
        y={item.y}
        width={item.w}
        height={item.h}
        fill={item.color}
        opacity={item.opacity}
        stroke={selected ? "#2563eb" : "none"}
        strokeWidth={selected ? 2 : 0}
        strokeDasharray={dashed ? "4 4" : undefined}
      />
    );
  }
  if (item.type === "rect") {
    return (
      <rect
        x={item.x}
        y={item.y}
        width={item.w}
        height={item.h}
        fill={item.fillOpacity > 0 ? item.color : "none"}
        fillOpacity={item.fillOpacity}
        stroke={selected ? "#2563eb" : item.color}
        strokeWidth={selected ? 2 : item.strokeWidth}
        strokeDasharray={dashed ? "4 4" : undefined}
      />
    );
  }
  if (item.type === "redact") {
    return (
      <rect
        x={item.x}
        y={item.y}
        width={item.w}
        height={item.h}
        fill={item.color}
        stroke={selected ? "#2563eb" : "none"}
        strokeWidth={selected ? 2 : 0}
      />
    );
  }
  if (item.type === "image") {
    return (
      <g>
        <image
          href={item.dataURL}
          x={item.x}
          y={item.y}
          width={item.w}
          height={item.h}
        />
        {selected && (
          <rect
            x={item.x}
            y={item.y}
            width={item.w}
            height={item.h}
            fill="none"
            stroke="#2563eb"
            strokeWidth={2}
          />
        )}
      </g>
    );
  }
  return null;
}
