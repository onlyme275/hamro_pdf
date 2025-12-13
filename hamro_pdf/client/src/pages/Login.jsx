import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Eye, EyeOff, FileText } from "lucide-react";
import {
  loginUser,
  selectLoginLoading,
  selectUserError,
  selectUserMessage,
  selectUser,
  selectIsAuthenticated,
  clearNotifications,
} from "@/store/slices/userSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const loading = useSelector(selectLoginLoading);
  const error = useSelector(selectUserError);
  const message = useSelector(selectUserMessage);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Clear notifications on component mount
  useEffect(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "premium") {
        navigate("/dashboard/premium");
      } else if (user.role === "user") {
        navigate("/dashboard/user");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Listen for OAuth messages from popup
  useEffect(() => {
    const handleOAuthMessage = (event) => {
      // Security check: verify origin
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "OAUTH_SUCCESS") {
        const { user, token } = event.data;

        // Store user data based on OAuth provider's remember me setting
        const storage = sessionStorage; // You can make this configurable
        storage.setItem("user", JSON.stringify(user));
        storage.setItem("token", token);

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/dashboard/admin");
        } else if (user.role === "premium") {
          navigate("/dashboard/premium");
        } else if (user.role === "user") {
          navigate("/dashboard/user");
        } else {
          navigate("/");
        }

        // Reload to update Redux state
        window.location.reload();
      } else if (event.data.type === "OAUTH_ERROR") {
        dispatch(clearNotifications());
        // Handle OAuth error
        alert(event.data.error || "OAuth authentication failed");
      }
    };

    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, [dispatch, navigate]);

  // Handle OAuth popup
  const handleOAuthLogin = (provider) => {
    const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${API_BASE_URL}/api/user/${provider}`,
      `${provider}_login`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Check if popup was blocked
    if (!popup) {
      alert("Please allow popups for this site to use OAuth login");
      return;
    }

    // Optional: Check if popup is closed
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
      }
    }, 1000);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    dispatch(clearNotifications());

    // Basic validation
    if (!formData.email.trim()) {
      alert("Please enter your email address");
      return;
    }

    if (!formData.password.trim()) {
      alert("Please enter your password");
      return;
    }

    // Dispatch login action
    const result = await dispatch(
      loginUser({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      })
    );

    // Handle successful login (Fixed: using navigate instead of router.push)
    if (loginUser.fulfilled.match(result)) {
      const userData = result.payload.user;

      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/dashboard/admin");
      } else if (userData.role === "premium") {
        navigate("/dashboard/premium");
      } else {
        navigate("/dashboard");
      }
    }
  };

  // If already authenticated, show loading message
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <div className="text-gray-700 text-lg font-medium">
            Redirecting to your dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section - Brand & Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-pink-600 p-12 flex-col justify-between relative overflow-hidden min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Logo */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <FileText className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-bold text-white">
                HAMRO<span className="text-blue-200">pdf</span>
              </h1>
            </div>
          </div>

          {/* Center Image Section */}
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-full max-w-lg">
              {/* Replace the src with your image URL */}
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop"
                alt="PDF Platform Illustration"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>

          {/* Bottom Badge */}
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium">
              🇳🇵 Proudly Made for Nepal
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-red-600">HAMRO</span>
              <span className="text-blue-900">pdf</span>
            </h1>
            <p className="text-gray-600 text-sm">
              Fast, secure and completely free PDF tools
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your account and continue working with your
                PDFs
              </p>
            </div>

            {/* Error and success messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg">
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="yourname@example.com"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password field */}
              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me and Forgot password row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    disabled={loading}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-gray-700 text-sm font-medium select-none cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  className="text-red-600 text-sm hover:text-red-700 font-semibold transition-colors"
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-400 disabled:to-red-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                className="h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-all duration-200 group"
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              {/* Microsoft */}
              {/* <button
                type="button"
                onClick={() => handleOAuthLogin("microsoft")}
                className="h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-all duration-200 group"
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z" />
                  <path fill="#00a4ef" d="M13 1h10v10H13z" />
                  <path fill="#7fba00" d="M1 13h10v10H1z" />
                  <path fill="#ffb900" d="M13 13h10v10H13z" />
                </svg>
              </button> */}

              {/* Facebook */}
              {/* <button
                type="button"
                onClick={() => handleOAuthLogin("facebook")}
                className="h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-all duration-200 group"
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#1877f2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </button> */}
            </div>

            {/* Register link */}
            <div className="text-center">
              <span className="text-gray-600 text-sm">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-red-600 text-sm hover:text-red-700 font-semibold transition-colors"
              >
                Register for free
              </Link>
            </div>
          </div>

          {/* Mobile Made for Nepal badge */}
          <div className="lg:hidden mt-8 text-center">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              🇳🇵 Made for Nepal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
