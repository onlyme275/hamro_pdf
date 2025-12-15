import { useState, useCallback } from "react";
import {
    Upload,
    Download,
    Image as ImageIcon,
    AlertCircle,
    X,
    Plus,
    Loader2,
    FileImage,
} from "lucide-react";

export default function JpgToPngPage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isConverting, setIsConverting] = useState(false);
    const [convertedFiles, setConvertedFiles] = useState([]);
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const handleFileSelect = useCallback((event) => {
        const files = Array.from(event.target.files);
        processFiles(files);
        event.target.value = "";
    }, []);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        setDragOver(false);
        const files = Array.from(event.dataTransfer.files);
        processFiles(files);
    }, []);

    const processFiles = (files) => {
        const validFiles = files.filter(
            (file) =>
                file.type === "image/jpeg" ||
                file.type === "image/jpg" ||
                file.name.toLowerCase().endsWith(".jpg") ||
                file.name.toLowerCase().endsWith(".jpeg")
        );

        if (validFiles.length > 0) {
            setSelectedFiles((prev) => [...prev, ...validFiles]);
            setError("");
            setConvertedFiles([]); // Reset converted files if new files are added (or we could append, but simpler to reset for batch)
        } else {
            setError("Please select valid JPG images.");
        }
    };

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        setDragOver(false);
    }, []);

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        if (convertedFiles.length > 0) {
            setConvertedFiles((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const convertToPng = async () => {
        if (selectedFiles.length === 0) {
            setError("Please select at least one image file.");
            return;
        }

        setIsConverting(true);
        setError("");
        const newConvertedFiles = [];

        try {
            for (const file of selectedFiles) {
                const result = await convertSingleFile(file);
                newConvertedFiles.push(result);
            }
            setConvertedFiles(newConvertedFiles);
        } catch (err) {
            console.error("Conversion error:", err);
            setError(`Failed to convert images: ${err.message}`);
        } finally {
            setIsConverting(false);
        }
    };

    const convertSingleFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    // Convert to PNG
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            resolve({
                                originalName: file.name,
                                newName: file.name.replace(/\.(jpg|jpeg)$/i, "") + ".png",
                                url: url,
                                blob: blob
                            });
                        } else {
                            reject(new Error("Canvas to Blob failed"));
                        }
                    }, "image/png");
                };
                img.onerror = () => reject(new Error("Failed to load image"));
                img.src = event.target.result;
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
    };

    const downloadFile = (file) => {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.newName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadAll = () => {
        convertedFiles.forEach((file, index) => {
            setTimeout(() => {
                downloadFile(file);
            }, index * 500); // Stagger downloads
        });
    };

    const clearAll = () => {
        setSelectedFiles([]);
        setConvertedFiles([]);
        setError("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <ImageIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">JPG to PNG</h1>
                    <p className="text-gray-600">Convert JPG images to PNG format instantly</p>
                </div>

                {/* Upload Area */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver
                                ? "border-blue-400 bg-blue-50"
                                : selectedFiles.length > 0
                                    ? "border-green-300 bg-green-50"
                                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                            }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-700">
                                {selectedFiles.length > 0
                                    ? `${selectedFiles.length} image(s) selected`
                                    : "Drop your JPG images here or click to browse"}
                            </p>
                            <p className="text-sm text-gray-500">
                                Supports JPG, JPEG files
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 inline mr-2" />
                            Add Images
                        </label>

                        {selectedFiles.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="ml-3 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    )}
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && convertedFiles.length === 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Selected Images ({selectedFiles.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <p className="text-xs text-center text-gray-600 mt-1 truncate px-1">
                                        {file.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Convert Button */}
                {selectedFiles.length > 0 && convertedFiles.length === 0 && (
                    <div className="text-center mb-6">
                        <button
                            onClick={convertToPng}
                            disabled={isConverting}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto shadow-md"
                        >
                            {isConverting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                "Convert to PNG"
                            )}
                        </button>
                    </div>
                )}

                {/* Conversion Results */}
                {convertedFiles.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <FileImage className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Conversion Complete!</h3>
                                    <p className="text-gray-600 text-sm">Your images are ready to download</p>
                                </div>
                            </div>
                            {convertedFiles.length > 1 && (
                                <button
                                    onClick={downloadAll}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download All
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {convertedFiles.map((file, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex items-center space-x-3">
                                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                        <img src={file.url} alt={file.newName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate" title={file.newName}>{file.newName}</p>
                                        <p className="text-xs text-gray-500">PNG Image</p>
                                    </div>
                                    <button
                                        onClick={() => downloadFile(file)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={clearAll}
                                className="text-gray-500 hover:text-gray-700 underline text-sm"
                            >
                                Convert more images
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
