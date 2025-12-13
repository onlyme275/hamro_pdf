// client/src/pages/PdfToExcel.jsx - SIMPLE FOCUSED VERSION
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  analyzePdf,
  generateExcel,
  selectAnalysisId,
  selectColumns,
  selectSampleRows,
  selectTotalRows,
  selectDownloadUrl,
  selectAnalyzing,
  selectGenerating,
  selectPdfError,
  clearNotifications,
  resetPdfState,
} from "../store/slices/pdfSlice";

const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

export default function PdfToExcel() {
  const dispatch = useDispatch();

  // Redux state
  const analysisId = useSelector(selectAnalysisId);
  const columns = useSelector(selectColumns);
  const sampleRows = useSelector(selectSampleRows);
  const totalRows = useSelector(selectTotalRows);
  const downloadUrl = useSelector(selectDownloadUrl);
  const analyzing = useSelector(selectAnalyzing);
  const generating = useSelector(selectGenerating);
  const error = useSelector(selectPdfError);

  // Local state
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);

  // Reset on mount
  useEffect(() => {
    dispatch(resetPdfState());
  }, [dispatch]);

  // Auto-select all columns when detected
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      setShowColumnModal(true);
    }
  }, [columns]);

  // Handle errors
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearNotifications());
    }
  }, [error, dispatch]);

  // File selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Analyze PDF
  const handleAnalyze = () => {
    if (!selectedFile) {
      alert("Please select a PDF file");
      return;
    }
    dispatch(analyzePdf(selectedFile));
  };

  // Toggle column
  const toggleColumn = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  // Select/Deselect all
  const toggleAll = () => {
    setSelectedColumns((prev) =>
      prev.length === columns.length ? [] : [...columns]
    );
  };

  // Generate Excel
  const handleGenerate = () => {
    if (selectedColumns.length === 0) {
      alert("Please select at least one column");
      return;
    }
    dispatch(generateExcel({ analysisId, selectedColumns }));
    setShowColumnModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FileSpreadsheet className="w-10 h-10 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              PDF <span className="text-blue-600">to Excel</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Extract table data from PDF and customize your Excel output
          </p>
        </div>

        {/* Upload Section */}
        {!analysisId && !downloadUrl && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
              {!selectedFile ? (
                <>
                  <UploadCloud className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Upload Your PDF
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    PDF must contain table data with clear columns
                  </p>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    id="fileInput"
                    onChange={handleFileChange}
                    disabled={analyzing}
                  />
                  <label
                    htmlFor="fileInput"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg cursor-pointer transition"
                  >
                    Select PDF File
                  </label>
                </>
              ) : (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-10 h-10 text-red-500" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    {!analyzing && (
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-2 hover:bg-blue-100 rounded-full transition"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedFile && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing PDF...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Analyze & Extract Table</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Column Selection */}
        {showColumnModal && (
          <div className="space-y-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">
                  Table Extracted Successfully!
                </h3>
              </div>
              <p className="text-sm text-green-700">
                Found <strong>{columns.length} columns</strong> and{" "}
                <strong>{totalRows} rows</strong>. Select which columns to
                include in your Excel file.
              </p>
            </div>

            {/* Select All */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-700">
                {selectedColumns.length} of {columns.length} columns selected
              </span>
              <button
                onClick={toggleAll}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {selectedColumns.length === columns.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {/* Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              {columns.map((col) => (
                <div
                  key={col}
                  onClick={() => toggleColumn(col)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedColumns.includes(col)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {col}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        Sample: {sampleRows[0]?.[columns.indexOf(col)] || "N/A"}
                      </p>
                    </div>
                    <div
                      className={`ml-3 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selectedColumns.includes(col)
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    >
                      {selectedColumns.includes(col) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b">
                <h4 className="font-semibold text-gray-700">Data Preview</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      {selectedColumns.map((col) => (
                        <th
                          key={col}
                          className="px-4 py-2 text-left font-semibold text-blue-900 border-b"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleRows.slice(0, 3).map((row, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        {selectedColumns.map((col) => (
                          <td
                            key={col}
                            className="px-4 py-2 text-gray-600 border-b"
                          >
                            {row[columns.indexOf(col)] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowColumnModal(false);
                  dispatch(resetPdfState());
                  setSelectedFile(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating || selectedColumns.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {generating
                  ? "Generating..."
                  : `Generate Excel (${selectedColumns.length} columns)`}
              </button>
            </div>
          </div>
        )}

        {/* Download */}
        {downloadUrl && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Your Excel File is Ready! 🎉
            </h3>
            <p className="text-green-700 mb-6">
              Successfully created Excel with {selectedColumns.length} selected
              columns
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href={`${BASE_URL}${downloadUrl}`}
                download="data.xlsx"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                <Download className="w-5 h-5" />
                Download Excel
              </a>
              <button
                onClick={() => {
                  dispatch(resetPdfState());
                  setSelectedFile(null);
                  setSelectedColumns([]);
                }}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Convert Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
