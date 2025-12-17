import React, { useState, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Upload, Download, Loader2, Image as ImageIcon, X } from 'lucide-react';

const BackgroundRemover = () => {
    const [image, setImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        // Basic validation
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (JPG, PNG, etc).');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        setProcessedImage(null);
        setError(null);
    };

    const handleRemoveBackground = async () => {
        if (!image) return;

        setIsProcessing(true);
        setError(null);

        try {
            // The library accepts URL, Blob, or File
            // removeBackground returns a Blob
            const blob = await removeBackground(image);
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
        } catch (err) {
            console.error("Background removal failed:", err);
            setError('Failed to remove background. Please try another image or check your connection (models need to be downloaded once).');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (processedImage) {
            const link = document.createElement('a');
            link.href = processedImage;
            link.download = 'removed-background.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleClear = () => {
        setImage(null);
        setProcessedImage(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        AI Background Remover
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Remove image backgrounds instantly in your browser. No data leaves your device.
                    </p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-6 md:p-8">

                    {/* Upload Area */}
                    {!image && (
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl h-96 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                                <div className="bg-blue-100 p-4 rounded-full mb-4">
                                    <Upload className="h-10 w-10 text-blue-600" />
                                </div>
                                <p className="text-lg font-medium text-gray-900">Click to upload an image</p>
                                <p className="text-sm text-gray-500 mt-2">or drag and drop here</p>
                            </label>
                        </div>
                    )}

                    {/* Processing Area */}
                    {image && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Original */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <ImageIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        Original
                                    </h3>
                                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square flex items-center justify-center">
                                        <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
                                    </div>
                                </div>

                                {/* Processed */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <Loader2 className={`h-5 w-5 mr-2 text-gray-500 ${isProcessing ? 'animate-spin' : ''}`} />
                                            Result
                                        </span>
                                        {processedImage && (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Ready</span>
                                        )}
                                    </h3>
                                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-[url('https://media.istockphoto.com/id/1149460593/vector/checkered-geometric-vector-background-with-black-and-gray-tile-transparency-grid-empty.jpg?s=612x612&w=0&k=20&c=6c4k1Vz-u-K7bF1X5Q5g5o5g5o5g5o5g5o5g5o5g5o5=')] bg-cover aspect-square flex items-center justify-center">
                                        {isProcessing ? (
                                            <div className="text-center">
                                                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                                                <p className="text-gray-600 font-medium">Removing background...</p>
                                                <p className="text-xs text-gray-400 mt-2">This usually takes a few seconds.</p>
                                            </div>
                                        ) : processedImage ? (
                                            <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain z-10" />
                                        ) : (
                                            <div className="text-gray-400 text-center px-4">
                                                <p>Click "Remove Background" to start</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleClear}
                                    className="flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <X className="h-5 w-5 mr-2" />
                                    Start Over
                                </button>

                                {!processedImage ? (
                                    <button
                                        onClick={handleRemoveBackground}
                                        disabled={isProcessing}
                                        className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isProcessing ? 'Processing...' : 'Remove Background'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg transition-all"
                                    >
                                        <Download className="h-5 w-5 mr-2" />
                                        Download HD Image
                                    </button>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BackgroundRemover;
