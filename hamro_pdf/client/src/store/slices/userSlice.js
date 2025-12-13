// store/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../api";

// Helper functions for token management
const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null;
  }
};

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken")
  );
};

const storeUserData = (user, token, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;

  if (user) {
    storage.setItem("user", JSON.stringify(user));
  }
  if (token) {
    storage.setItem("token", token);
    setAuthToken(token);
  }
};

const clearUserData = () => {
  // Clear all possible storage locations
  ["user", "token", "authToken", "refreshToken"].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  setAuthToken(null);
};

// Async Thunks for API calls

// Register user
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ userData, rememberMe = false }, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/register", userData);
      const { user, token } = response.data.data || response.data;

      storeUserData(user, token, rememberMe);

      return { user, token, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", { email, password });
      const { user, token } = response.data.data || response.data;

      storeUserData(user, token, rememberMe);

      return { user, token, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

// Get all users (Admin only)
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user");
      return response.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Add user (Admin only)
export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/add", userData);
      return {
        user: response.data.data?.user || response.data.user,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add user"
      );
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ userId, updateData }, { rejectWithValue, getState }) => {
    try {
      const response = await api.put(`/user/${userId}`, updateData);

      // If updating current user, update stored user data
      const currentUser = getState().user.user;
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...updateData };
        const token = getStoredToken();
        const rememberMe = !!localStorage.getItem("user");
        storeUserData(updatedUser, token, rememberMe);

        return { user: updatedUser, message: response.data.message };
      }

      return { message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Delete user (Admin only)
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/user/${userId}`);
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ userId, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/change-password", {
        id: userId,
        oldPassword,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

// Reset password (Admin only)
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ userId, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/reset-password", {
        id: userId,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

// Initial state
const initialState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  users: [], // For admin user management
  loading: false,
  error: null,
  message: null,

  // Individual loading states for better UX
  loginLoading: false,
  registerLoading: false,
  profileLoading: false,
  usersLoading: false,
  updateLoading: false,
  deleteLoading: false,
  passwordLoading: false,
};

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Clear error and message
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },

    // Clear both error and message
    clearNotifications: (state) => {
      state.error = null;
      state.message = null;
    },

    // Logout user
    logout: (state) => {
      clearUserData();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.users = [];
      state.error = null;
      state.message = null;
      state.loading = false;
    },

    // Update user data (for real-time updates)
    updateUserData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        const token = getStoredToken();
        const rememberMe = !!localStorage.getItem("user");
        storeUserData(state.user, token, rememberMe);
      }
    },

    // Set loading state manually if needed
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      })

      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })

      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.users.push(action.payload.user);
        }
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.userId
        );
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.passwordLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.error = action.payload;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.passwordLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearMessage,
  clearNotifications,
  logout,
  updateUserData,
  setLoading,
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectToken = (state) => state.user.token;
export const selectUsers = (state) => state.user.users;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserMessage = (state) => state.user.message;

// Specific loading selectors
export const selectLoginLoading = (state) => state.user.loginLoading;
export const selectRegisterLoading = (state) => state.user.registerLoading;
export const selectProfileLoading = (state) => state.user.profileLoading;
export const selectUsersLoading = (state) => state.user.usersLoading;
export const selectUpdateLoading = (state) => state.user.updateLoading;
export const selectDeleteLoading = (state) => state.user.deleteLoading;
export const selectPasswordLoading = (state) => state.user.passwordLoading;

// Complex selectors
export const selectIsAdmin = (state) => state.user.user?.role === "admin";
export const selectUserById = (userId) => (state) =>
  state.user.users.find((user) => user.id === userId);

export default userSlice.reducer;
