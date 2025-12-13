// store/slices/pdfSlice.js - Updated for 2-step process
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Step 1: Analyze PDF and get column preview
export const analyzePdf = createAsyncThunk(
  "pdf/analyze",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await api.post("/pdf/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to analyze PDF"
      );
    }
  }
);

// Step 2: Generate Excel with selected columns
export const generateExcel = createAsyncThunk(
  "pdf/generate",
  async ({ analysisId, selectedColumns }, { rejectWithValue }) => {
    try {
      const response = await api.post("/pdf/generate", {
        analysisId,
        selectedColumns,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate Excel"
      );
    }
  }
);

// Initial state
const initialState = {
  // Analysis data
  analysisId: null,
  columns: [],
  sampleRows: [],
  totalRows: 0,

  // Download data
  downloadUrl: null,

  // Loading states
  analyzing: false,
  generating: false,

  // Error and message
  error: null,
  message: null,
};

// PDF slice
const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearNotifications: (state) => {
      state.error = null;
      state.message = null;
    },
    clearDownloadUrl: (state) => {
      state.downloadUrl = null;
    },
    resetPdfState: (state) => {
      state.analysisId = null;
      state.columns = [];
      state.sampleRows = [];
      state.totalRows = 0;
      state.downloadUrl = null;
      state.analyzing = false;
      state.generating = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Analyze PDF
      .addCase(analyzePdf.pending, (state) => {
        state.analyzing = true;
        state.error = null;
        state.downloadUrl = null;
      })
      .addCase(analyzePdf.fulfilled, (state, action) => {
        state.analyzing = false;
        state.analysisId = action.payload.analysisId;
        state.columns = action.payload.columns;
        state.sampleRows = action.payload.sampleRows;
        state.totalRows = action.payload.totalRows;
        state.error = null;
      })
      .addCase(analyzePdf.rejected, (state, action) => {
        state.analyzing = false;
        state.error = action.payload;
      })

      // Generate Excel
      .addCase(generateExcel.pending, (state) => {
        state.generating = true;
        state.error = null;
      })
      .addCase(generateExcel.fulfilled, (state, action) => {
        state.generating = false;
        state.downloadUrl = action.payload.downloadUrl;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(generateExcel.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearMessage,
  clearNotifications,
  clearDownloadUrl,
  resetPdfState,
} = pdfSlice.actions;

// Selectors
export const selectAnalysisId = (state) => state.pdf.analysisId;
export const selectColumns = (state) => state.pdf.columns;
export const selectSampleRows = (state) => state.pdf.sampleRows;
export const selectTotalRows = (state) => state.pdf.totalRows;
export const selectDownloadUrl = (state) => state.pdf.downloadUrl;
export const selectAnalyzing = (state) => state.pdf.analyzing;
export const selectGenerating = (state) => state.pdf.generating;
export const selectPdfError = (state) => state.pdf.error;
export const selectPdfMessage = (state) => state.pdf.message;

export default pdfSlice.reducer;
