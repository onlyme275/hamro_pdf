// components/MySignatures.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import api from "../store/api";
import {
  PenTool,
  Upload,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

export default function MySignatures() {
  const user = useSelector(selectUser);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDrawCanvas, setShowDrawCanvas] = useState(false);

  useEffect(() => {
    fetchSignatures();
  }, []);

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user-signatures/user/${user.id}`);
      setSignatures(response.data.signatures || []);
    } catch (error) {
      console.error("Error fetching signatures:", error);
      setError(error.response?.data?.message || "Failed to fetch signatures");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      setError("Image size must be less than 2MB");
      return;
    }

    try {
      setUploadLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("signature", file);
      formData.append("userId", user.id);

      await api.post("/user-signatures/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Signature uploaded successfully!");
      fetchSignatures();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error uploading signature:", error);
      setError(error.response?.data?.message || "Failed to upload signature");
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawnSignature = async () => {
    const canvas = canvasRef.current;
    
    canvas.toBlob(async (blob) => {
      try {
        setUploadLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("signature", blob, "signature.png");
        formData.append("userId", user.id);

        await api.post("/user-signatures/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setSuccess("Signature saved successfully!");
        setShowDrawCanvas(false);
        clearCanvas();
        fetchSignatures();
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Error saving signature:", error);
        setError(error.response?.data?.message || "Failed to save signature");
      } finally {
        setUploadLoading(false);
      }
    }, "image/png");
  };

  const handleDelete = async (signatureId) => {
    if (!window.confirm("Are you sure you want to delete this signature?"))
      return;

    try {
      await api.delete(`/user-signatures/${signatureId}`);
      setSuccess("Signature deleted successfully!");
      fetchSignatures();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error deleting signature:", error);
      setError(error.response?.data?.message || "Failed to delete signature");
    }
  };

  useEffect(() => {
    if (showDrawCanvas) {
      initCanvas();
    }
  }, [showDrawCanvas]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          My Signatures
        </h2>
        <p className="text-gray-600">
          Upload or draw your signatures for PDF documents
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Add Signature Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Upload Signature */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Upload size={24} className="text-orange-600" />
            Upload Signature
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload an image of your signature (PNG, JPG - max 2MB)
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadLoading}
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploadLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              <>
                <ImageIcon size={18} />
                Choose Image
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Draw Signature */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PenTool size={24} className="text-orange-600" />
            Draw Signature
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Draw your signature using mouse or touchscreen
          </p>
          <button
            onClick={() => setShowDrawCanvas(!showDrawCanvas)}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <PenTool size={18} />
            {showDrawCanvas ? "Close Canvas" : "Open Canvas"}
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      {showDrawCanvas && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Draw Your Signature
          </h3>
          <div className="border-2 border-gray-300 rounded-lg mb-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full cursor-crosshair"
              style={{ touchAction: "none" }}
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={saveDrawnSignature}
              disabled={uploadLoading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadLoading ? "Saving..." : "Save Signature"}
            </button>
          </div>
        </div>
      )}

      {/* Signatures List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Saved Signatures
        </h3>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2
              className="animate-spin mx-auto mb-4 text-orange-600"
              size={48}
            />
            <p className="text-gray-600">Loading signatures...</p>
          </div>
        ) : signatures.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <PenTool className="mx-auto mb-4 text-gray-400" size={48} />
            <p>No signatures saved yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatures.map((signature) => (
              <div
                key={signature.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors"
              >
                <div className="bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-center h-32">
                  <img
                    src={signature.signatureUrl || signature.signature_url}
                    alt="Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Saved on {formatDate(signature.createdAt || signature.created_at)}
                </div>
                <button
                  onClick={() => handleDelete(signature.id)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}