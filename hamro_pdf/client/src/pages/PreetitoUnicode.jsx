import React, { useState } from 'react';
import { preetiToUnicode } from '../lib/preetiConverter';
import { Copy, Trash2, ArrowRightLeft } from 'lucide-react';

const PreetitoUnicode = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [copied, setCopied] = useState(false);

    const handleConvert = () => {
        const converted = preetiToUnicode(inputText);
        setOutputText(converted);
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputText(text);
        // Real-time conversion option
        const converted = preetiToUnicode(text);
        setOutputText(converted);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputText('');
        setOutputText('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Preeti to Unicode Converter
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Convert traditional Preeti font text to standard Nepali Unicode easily.
                    </p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Input Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700">
                                    Preeti In (Type here)
                                </label>
                                <button
                                    onClick={handleClear}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Clear text"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={handleInputChange}
                                placeholder="Preeti font text here..."
                                className="w-full h-64 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-preeti text-lg"
                                style={{ fontFamily: 'Preeti, sans-serif' }}
                            />
                        </div>

                        {/* Output Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700">
                                    Unicode Out (Result)
                                </label>
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center space-x-1 text-sm font-medium transition-colors ${copied ? 'text-green-600' : 'text-blue-600 hover:text-blue-700'
                                        }`}
                                    title="Copy to clipboard"
                                >
                                    <Copy className="h-5 w-5" />
                                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                            <textarea
                                value={outputText}
                                readOnly
                                placeholder="Unicode result..."
                                className="w-full h-64 p-4 rounded-lg border border-gray-300 bg-gray-50 text-lg resize-none"
                            />
                        </div>
                    </div>

                    {/* Mobile Convert Button (if not realtime, but we did realtime) */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center md:hidden">
                        <p className="text-sm text-gray-500">Typing automatically converts text.</p>
                    </div>
                </div>

                <div className="text-center">
                    <a href="/unicode-to-preeti" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Switch to Unicode to Preeti
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PreetitoUnicode;
