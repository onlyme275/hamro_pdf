// store/slices/splashSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Async Thunks for API calls

// Get all splash screens (Admin)
export const getAllSplashScreens = createAsyncThunk(
  "splash/getAllSplashScreens",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/splash");
      return response.data.splash;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch splash screens"
      );
    }
  }
);

// Get active splash screens (Public)
export const getActiveSplashScreens = createAsyncThunk(
  "splash/getActiveSplashScreens",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/splash/active");
      return response.data.splash;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch active splash screens"
      );
    }
  }
);

// Get splash screen by ID
export const getSplashScreenById = createAsyncThunk(
  "splash/getSplashScreenById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/splash/${id}`);
      return response.data.splash;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch splash screen"
      );
    }
  }
);

// Create splash screen
export const createSplashScreen = createAsyncThunk(
  "splash/createSplashScreen",
  async (splashData, { rejectWithValue }) => {
    try {
      const response = await api.post("/splash", splashData);
      return {
        splash: response.data.splash,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create splash screen"
      );
    }
  }
);

// Update splash screen
export const updateSplashScreen = createAsyncThunk(
  "splash/updateSplashScreen",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/splash/${id}`, updateData);
      return {
        splash: response.data.splash,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update splash screen"
      );
    }
  }
);

// Delete splash screen
export const deleteSplashScreen = createAsyncThunk(
  "splash/deleteSplashScreen",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/splash/${id}`);
      return {
        id,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete splash screen"
      );
    }
  }
);

// Toggle splash screen active status
export const toggleSplashStatus = createAsyncThunk(
  "splash/toggleSplashStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/splash/${id}/toggle-status`);
      return {
        splash: response.data.splash,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to toggle splash screen status"
      );
    }
  }
);

// Update display orders
export const updateDisplayOrders = createAsyncThunk(
  "splash/updateDisplayOrders",
  async (orderUpdates, { rejectWithValue }) => {
    try {
      const response = await api.patch("/splash/update-orders", {
        orderUpdates,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update display orders"
      );
    }
  }
);

// Bulk update status
export const bulkUpdateSplashStatus = createAsyncThunk(
  "splash/bulkUpdateSplashStatus",
  async ({ ids, isActive }, { rejectWithValue }) => {
    try {
      const response = await api.patch("/splash/bulk-status", {
        ids,
        isActive,
      });
      return {
        ids,
        isActive,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to bulk update splash screens"
      );
    }
  }
);

// Get splash screen statistics
export const getSplashStats = createAsyncThunk(
  "splash/getSplashStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/splash/admin/stats");
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch splash statistics"
      );
    }
  }
);

// Initial state
const initialState = {
  splashScreens: [],
  activeSplashScreens: [],
  currentSplash: null,
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    scheduled: 0,
  },
  loading: false,
  error: null,
  message: null,

  // Individual loading states
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  toggleLoading: false,
  statsLoading: false,
};

// Splash slice
const splashSlice = createSlice({
  name: "splash",
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

    // Clear current splash
    clearCurrentSplash: (state) => {
      state.currentSplash = null;
    },

    // Set loading state manually if needed
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all splash screens
      .addCase(getAllSplashScreens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSplashScreens.fulfilled, (state, action) => {
        state.loading = false;
        state.splashScreens = action.payload;
        state.error = null;
      })
      .addCase(getAllSplashScreens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get active splash screens
      .addCase(getActiveSplashScreens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveSplashScreens.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSplashScreens = action.payload;
        state.error = null;
      })
      .addCase(getActiveSplashScreens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get splash screen by ID
      .addCase(getSplashScreenById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSplashScreenById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSplash = action.payload;
        state.error = null;
      })
      .addCase(getSplashScreenById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create splash screen
      .addCase(createSplashScreen.pending, (state) => {
        state.createLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(createSplashScreen.fulfilled, (state, action) => {
        state.createLoading = false;
        state.loading = false;
        state.splashScreens.push(action.payload.splash);
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createSplashScreen.rejected, (state, action) => {
        state.createLoading = false;
        state.loading = false;
        state.error = action.payload;
      })

      // Update splash screen
      .addCase(updateSplashScreen.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateSplashScreen.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.splashScreens.findIndex(
          (splash) => splash.id === action.payload.splash.id
        );
        if (index !== -1) {
          state.splashScreens[index] = action.payload.splash;
        }
        state.currentSplash = action.payload.splash;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateSplashScreen.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Delete splash screen
      .addCase(deleteSplashScreen.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteSplashScreen.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.splashScreens = state.splashScreens.filter(
          (splash) => splash.id !== action.payload.id
        );
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteSplashScreen.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // Toggle splash status
      .addCase(toggleSplashStatus.pending, (state) => {
        state.toggleLoading = true;
        state.error = null;
      })
      .addCase(toggleSplashStatus.fulfilled, (state, action) => {
        state.toggleLoading = false;
        const index = state.splashScreens.findIndex(
          (splash) => splash.id === action.payload.splash.id
        );
        if (index !== -1) {
          state.splashScreens[index] = action.payload.splash;
        }
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(toggleSplashStatus.rejected, (state, action) => {
        state.toggleLoading = false;
        state.error = action.payload;
      })

      // Update display orders
      .addCase(updateDisplayOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDisplayOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(updateDisplayOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Bulk update status
      .addCase(bulkUpdateSplashStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateSplashStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the status for all affected splash screens
        action.payload.ids.forEach((id) => {
          const index = state.splashScreens.findIndex(
            (splash) => splash.id === id
          );
          if (index !== -1) {
            state.splashScreens[index].is_active = action.payload.isActive;
          }
        });
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(bulkUpdateSplashStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get splash stats
      .addCase(getSplashStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(getSplashStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getSplashStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearMessage,
  clearNotifications,
  clearCurrentSplash,
  setLoading,
} = splashSlice.actions;

// Selectors
export const selectAllSplashScreens = (state) => state.splash.splashScreens;
export const selectActiveSplashScreens = (state) =>
  state.splash.activeSplashScreens;
export const selectCurrentSplash = (state) => state.splash.currentSplash;
export const selectSplashStats = (state) => state.splash.stats;
export const selectSplashLoading = (state) => state.splash.loading;
export const selectSplashError = (state) => state.splash.error;
export const selectSplashMessage = (state) => state.splash.message;

// Specific loading selectors
export const selectCreateLoading = (state) => state.splash.createLoading;
export const selectUpdateLoading = (state) => state.splash.updateLoading;
export const selectDeleteLoading = (state) => state.splash.deleteLoading;
export const selectToggleLoading = (state) => state.splash.toggleLoading;
export const selectStatsLoading = (state) => state.splash.statsLoading;

// Complex selectors
export const selectSplashById = (id) => (state) =>
  state.splash.splashScreens.find((splash) => splash.id === id);

export default splashSlice.reducer;
