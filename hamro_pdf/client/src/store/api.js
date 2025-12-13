import axios from "axios";
const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Helper functions for consistent token storage
const getToken = () => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken")
  );
};

const getRefreshToken = () => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refreshToken")
  );
};

const removeAllTokens = () => {
  if (typeof window === "undefined") return;

  // Clear all possible token storage keys
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("refreshToken");
};

const updateStoredToken = (newToken) => {
  if (typeof window === "undefined") return;

  // Update token in the same storage location it was found
  if (localStorage.getItem("token") || localStorage.getItem("authToken")) {
    localStorage.setItem("token", newToken);
    localStorage.removeItem("authToken"); // Remove old key
  } else {
    sessionStorage.setItem("token", newToken);
    sessionStorage.removeItem("authToken"); // Remove old key
  }
};

// Set auth token in headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("✅ Token set in API headers:", token.slice(0, 20) + "...");
  } else {
    delete api.defaults.headers.common["Authorization"];
    console.log("❌ Token removed from API headers");
  }
};

// Initialize token from storage on app start
const initializeToken = () => {
  const token = getToken();
  if (token) {
    setAuthToken(token);
    console.log("🔧 Token initialized from storage");
  }
};

// Call initialization
initializeToken();

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to ensure token is always included
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
      hasAuth: !!config.headers.Authorization,
      token: token ? `${token.slice(0, 10)}...` : "none",
      contentType: config.headers["Content-Type"],
    });

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors and token refresh
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${
        response.status
      }`
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error(
      `❌ ${originalRequest.method?.toUpperCase()} ${originalRequest.url} - ${
        error.response?.status
      }`,
      {
        error: error.response?.data?.message || error.message,
        hasRetried: originalRequest._retry,
      }
    );

    // Handle 401 errors (authentication expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          console.log("🔄 Attempting token refresh...");

          // Create a new axios instance for refresh to avoid interceptor loops
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user/refresh`,
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 10000,
            }
          );

          const { token: newToken, user } = refreshResponse.data.data;

          if (newToken) {
            // Update stored token
            updateStoredToken(newToken);

            // Update user if provided
            if (user) {
              const userStr = JSON.stringify(user);
              if (
                localStorage.getItem("token") ||
                localStorage.getItem("authToken")
              ) {
                localStorage.setItem("user", userStr);
              } else {
                sessionStorage.setItem("user", userStr);
              }
            }

            // Update API headers
            setAuthToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            console.log("✅ Token refreshed successfully");

            // Process queued requests
            processQueue(null, newToken);

            // Retry the original request
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error(
          "❌ Token refresh failed:",
          refreshError.response?.data || refreshError.message
        );
        processQueue(refreshError, null);
      } finally {
        isRefreshing = false;
      }

      // If refresh fails, clear all auth data and redirect to login
      console.log("🚪 Clearing auth data and redirecting to login");
      removeAllTokens();
      setAuthToken(null);

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
