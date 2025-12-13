import Navbar from "@/components/Header";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, FileText, Shield, Zap, Users } from "lucide-react";
import {
  registerUser,
  selectRegisterLoading,
  selectUserError,
  selectUserMessage,
  selectIsAuthenticated,
  clearNotifications,
} from "@/store/slices/userSlice";

export default function GlassRegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectRegisterLoading);
  const error = useSelector(selectUserError);
  const message = useSelector(selectUserMessage);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear notifications on mount
  useEffect(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // redirect to home/dashboard
    }
  }, [isAuthenticated, navigate]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearNotifications());

    if (!formData.name.trim()) return alert("Please enter your full name");
    if (!formData.email.trim()) return alert("Please enter your email address");
    if (!formData.password.trim()) return alert("Please enter a password");
    if (formData.password.length < 6)
      return alert("Password must be at least 6 characters long");
    if (!termsAccepted)
      return alert("Please accept the Terms of Service and Privacy Policy");

    const result = await dispatch(
      registerUser({
        userData: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        },
        rememberMe: formData.rememberMe,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/"); // redirect after successful registration
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <div className="text-gray-700 text-lg font-medium">Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <>
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

        {/* Right Section - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-red-600">HAMRO</span>
                <span className="text-blue-900">pdf</span>
              </h1>
              <p className="text-gray-600 text-sm">Create your free account today</p>
            </div>

            {/* Register Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Join thousands using Hamro PDF to work smarter with documents
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
                {/* Name field */}
                <div>
                  <label className="text-gray-700 text-sm font-semibold block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>

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
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
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

                {/* Remember Me */}
                <div className="flex items-start space-x-2 pt-1">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    disabled={loading}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-gray-700 text-sm font-medium select-none cursor-pointer"
                  >
                    Remember me on this device
                  </label>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    disabled={loading}
                  />
                  <label htmlFor="termsAccepted" className="text-gray-700 text-sm">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>

                {/* Create Account button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-400 disabled:to-red-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 mt-6"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="text-center mt-8">
                <span className="text-gray-600 text-sm">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-red-600 text-sm hover:text-red-700 font-semibold transition-colors"
                >
                  Sign in here
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
    </>
  );
}