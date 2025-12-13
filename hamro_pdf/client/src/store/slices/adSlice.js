// store/slices/adSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Async Thunks for API calls

// Get all ads (Admin)
export const getAllAds = createAsyncThunk(
  "ads/getAllAds",
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.placement) params.append('placement', filters.placement);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive);
      
      const response = await api.get(`/ads?${params.toString()}`);
      return response.data.ads;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ads"
      );
    }
  }
);

// Get active ad by placement (Public)
export const getAdByPlacement = createAsyncThunk(
  "ads/getAdByPlacement",
  async (placement, { rejectWithValue }) => {
    try {
      const response = await api.get(`/ads/placement/${placement}`);
      return response.data.ad;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ad"
      );
    }
  }
);

// Get ad by ID
export const getAdById = createAsyncThunk(
  "ads/getAdById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/ads/${id}`);
      return response.data.ad;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ad"
      );
    }
  }
);

// Create ad
export const createAd = createAsyncThunk(
  "ads/createAd",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/ads", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        ad: response.data.ad,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create ad"
      );
    }
  }
);

// Update ad
export const updateAd = createAsyncThunk(
  "ads/updateAd",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/ads/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        ad: response.data.ad,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update ad"
      );
    }
  }
);

// Delete ad
export const deleteAd = createAsyncThunk(
  "ads/deleteAd",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/ads/${id}`);
      return {
        id,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete ad"
      );
    }
  }
);

// Get ad statistics
export const getAdStats = createAsyncThunk(
  "ads/getAdStats",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/ads/${id}/stats`);
      return {
        id,
        stats: response.data.stats,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ad statistics"
      );
    }
  }
);

// Track impression
export const trackImpression = createAsyncThunk(
  "ads/trackImpression",
  async (adId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ads/${adId}/impression`);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to track impression"
      );
    }
  }
);

// Track click
export const trackClick = createAsyncThunk(
  "ads/trackClick",
  async (adId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ads/${adId}/click`);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to track click"
      );
    }
  }
);

// Initial state
const initialState = {
  ads: [],
  currentAd: null,
  adStats: {},
  loading: false,
  error: null,
  message: null,

  // Individual loading states
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  statsLoading: false,
};

// Ad slice
const adSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    // Clear error and message
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

    // Clear current ad
    clearCurrentAd: (state) => {
      state.currentAd = null;
    },

    // Set loading state manually if needed
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all ads
      .addCase(getAllAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAds.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload;
        state.error = null;
      })
      .addCase(getAllAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get ad by placement
      .addCase(getAdByPlacement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdByPlacement.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAd = action.payload;
        state.error = null;
      })
      .addCase(getAdByPlacement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get ad by ID
      .addCase(getAdById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAd = action.payload;
        state.error = null;
      })
      .addCase(getAdById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create ad
      .addCase(createAd.pending, (state) => {
        state.createLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.createLoading = false;
        state.loading = false;
        state.ads.push(action.payload.ad);
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createAd.rejected, (state, action) => {
        state.createLoading = false;
        state.loading = false;
        state.error = action.payload;
      })

      // Update ad
      .addCase(updateAd.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.ads.findIndex(
          (ad) => ad.id === action.payload.ad.id
        );
        if (index !== -1) {
          state.ads[index] = action.payload.ad;
        }
        state.currentAd = action.payload.ad;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Delete ad
      .addCase(deleteAd.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.ads = state.ads.filter((ad) => ad.id !== action.payload.id);
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // Get ad stats
      .addCase(getAdStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(getAdStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.adStats[action.payload.id] = action.payload.stats;
        state.error = null;
      })
      .addCase(getAdStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })

      // Track impression
      .addCase(trackImpression.fulfilled, (state) => {
        // Silently track, no state update needed
      })
      .addCase(trackImpression.rejected, (state) => {
        // Silently fail, don't show error to user
      })

      // Track click
      .addCase(trackClick.fulfilled, (state) => {
        // Silently track, no state update needed
      })
      .addCase(trackClick.rejected, (state) => {
        // Silently fail, don't show error to user
      });
  },
});

// Export actions
export const {
  clearError,
  clearMessage,
  clearNotifications,
  clearCurrentAd,
  setLoading,
} = adSlice.actions;

// Selectors
export const selectAllAds = (state) => state.ads.ads;
export const selectCurrentAd = (state) => state.ads.currentAd;
export const selectAdStats = (state) => state.ads.adStats;
export const selectAdsLoading = (state) => state.ads.loading;
export const selectAdsError = (state) => state.ads.error;
export const selectAdsMessage = (state) => state.ads.message;

// Specific loading selectors
export const selectCreateLoading = (state) => state.ads.createLoading;
export const selectUpdateLoading = (state) => state.ads.updateLoading;
export const selectDeleteLoading = (state) => state.ads.deleteLoading;
export const selectStatsLoading = (state) => state.ads.statsLoading;

// Complex selectors
export const selectAdById = (id) => (state) =>
  state.ads.ads.find((ad) => ad.id === id);

export const selectAdsByPlacement = (placement) => (state) =>
  state.ads.ads.filter((ad) => ad.placement === placement);

export const selectActiveAds = (state) =>
  state.ads.ads.filter((ad) => ad.isActive);

export default adSlice.reducer;