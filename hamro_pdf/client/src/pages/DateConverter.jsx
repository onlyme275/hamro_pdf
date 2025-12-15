import { useState, useEffect } from "react";
import NepaliDate from "nepali-date-converter";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    ArrowRightLeft,
    Copy,
    Check,
    AlertCircle,
    RefreshCw,
    Sparkles,
    Clock,
    X
} from "lucide-react";

export default function DateConverter() {
    const [mode, setMode] = useState("AD2BS"); // "AD2BS" or "BS2AD"
    const [inputDate, setInputDate] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Set today's date on mount for quick start or just have it available
    const today = new Date().toISOString().split('T')[0];

    // Constants
    const isAD = mode === "AD2BS";
    const placeholder = isAD ? "YYYY-MM-DD" : "YYYY-MM-DD";
    const label = isAD ? "English Date (AD)" : "Nepali Date (BS)";
    const targetLabel = isAD ? "Nepali Date (BS)" : "English Date (AD)";

    const handleConvert = () => {
        setError("");
        setResult(null);
        setIsAnimating(true);

        // Simulate reliable processing delay for effect
        setTimeout(() => {
            setIsAnimating(false);
            if (!inputDate) {
                setError("Please enter a valid date.");
                return;
            }

            try {
                if (mode === "AD2BS") {
                    const dateParts = inputDate.split("-");
                    if (dateParts.length !== 3) throw new Error("Invalid Format");
                    const jsDate = new Date(inputDate);
                    if (isNaN(jsDate.getTime())) throw new Error("Invalid Date");

                    const bsDate = new NepaliDate(jsDate);
                    setResult(bsDate.format("YYYY-MM-DD"));
                } else {
                    // BS2AD input usually expected as YYYY-MM-DD
                    const bsDate = new NepaliDate(inputDate);
                    const adDate = bsDate.toJsDate();
                    setResult(adDate.toISOString().split("T")[0]);
                }
            } catch (err) {
                console.error(err);
                setError("Invalid date format. Please check your input.");
            }
        }, 500);
    };

    const toggleMode = () => {
        setMode(mode === "AD2BS" ? "BS2AD" : "AD2BS");
        setInputDate("");
        setResult(null);
        setError("");
        setCopied(false);
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const setToday = () => {
        if (isAD) {
            setInputDate(today);
        } else {
            // Convert today to BS for "Today" button in BS mode
            try {
                const bsDate = new NepaliDate(new Date());
                setInputDate(bsDate.format("YYYY-MM-DD"));
            } catch (e) {
                console.error(e);
            }
        }
        setError("");
    };

    const clearInput = () => {
        setInputDate("");
        setResult(null);
        setError("");
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">

            {/* Dynamic Background Mesh */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/40 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-200/40 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl w-full relative z-10"
            >
                {/* Glassmorphism Card */}
                <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden ring-1 ring-black/5">

                    {/* Header Section */}
                    <div className="relative p-10 pb-6 text-center">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200 mb-6">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 mb-2 tracking-tight">
                                Date Converter
                            </h1>
                            <p className="text-slate-500 font-medium text-lg">
                                Professional AD & BS Conversion Tool
                            </p>
                        </motion.div>
                    </div>

                    <div className="p-8 pt-2">

                        {/* Custom Toggle Switch */}
                        <div className="bg-slate-100/80 p-1.5 rounded-2xl flex relative mb-10 shadow-inner">
                            <motion.div
                                className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.06)] border border-slate-100/50"
                                layoutId="activeTab"
                                initial={false}
                                animate={{
                                    left: mode === "AD2BS" ? "6px" : "50%",
                                    width: "calc(50% - 9px)",
                                    x: mode === "AD2BS" ? 0 : 3,
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />

                            <button
                                onClick={() => mode !== "AD2BS" && toggleMode()}
                                className={`flex-1 relative z-10 py-3.5 text-sm font-bold transition-colors duration-200 flex items-center justify-center gap-2 ${mode === "AD2BS" ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <span className="tracking-wide">AD to BS</span>
                            </button>
                            <button
                                onClick={() => mode !== "BS2AD" && toggleMode()}
                                className={`flex-1 relative z-10 py-3.5 text-sm font-bold transition-colors duration-200 flex items-center justify-center gap-2 ${mode === "BS2AD" ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <span className="tracking-wide">BS to AD</span>
                            </button>
                        </div>

                        {/* Input Section */}
                        <div className="space-y-6">
                            <div className="relative group">
                                <div className="flex justify-between items-center mb-2.5 px-1">
                                    <label className="text-sm font-bold text-slate-700">
                                        {label}
                                    </label>
                                    <button
                                        onClick={setToday}
                                        className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <Clock className="w-3 h-3" />
                                        Today
                                    </button>
                                </div>

                                <div className="relative transition-all duration-300 transform group-hover:-translate-y-0.5">
                                    <input
                                        type={isAD ? "date" : "text"}
                                        placeholder={placeholder}
                                        value={inputDate}
                                        onChange={(e) => setInputDate(e.target.value)}
                                        className="w-full pl-5 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-semibold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm group-hover:shadow-md h-16 text-lg"
                                    />

                                    {inputDate && (
                                        <button
                                            onClick={clearInput}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}

                                    {!inputDate && !isAD && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Calendar className="w-5 h-5 text-slate-400" />
                                        </div>
                                    )}
                                </div>

                                {!isAD && (
                                    <p className="text-xs text-slate-400 mt-2 ml-1 flex items-center">
                                        <span className="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>
                                        Format: YYYY-MM-DD
                                    </p>
                                )}
                            </div>

                            {/* Error Notification */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center border border-red-100 shadow-sm mb-2">
                                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                            {error}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Button */}
                            <button
                                onClick={handleConvert}
                                disabled={isAnimating}
                                className="w-full relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-slate-200 transform active:scale-[0.98] transition-all duration-300 group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center justify-center space-x-2">
                                    {isAnimating ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-lg">Convert Date</span>
                                            <ArrowRightLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>

                        {/* Result Display */}
                        <AnimatePresence mode="wait">
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="mt-8"
                                >
                                    <div className="relative bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 rounded-3xl p-8 text-center shadow-[0_10px_40px_-10px_rgba(79,70,229,0.1)] group">

                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={copyToClipboard}
                                                className={`p-2.5 rounded-xl transition-all duration-200 ${copied
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-white text-slate-400 hover:text-indigo-600 hover:bg-blue-50 hover:shadow-sm"
                                                    }`}
                                                title="Copy to clipboard"
                                            >
                                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        </div>

                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">
                                            Converted Result
                                        </p>

                                        <div className="text-5xl font-black text-slate-800 tracking-tight mb-2">
                                            {result}
                                        </div>

                                        <div className="inline-block px-4 py-1.5 bg-indigo-100/50 rounded-full">
                                            <p className="text-sm font-bold text-indigo-600">
                                                {targetLabel}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-400 font-medium text-sm mt-8 opacity-80 hover:opacity-100 transition-opacity">
                    Hamro PDF Tools &copy; {new Date().getFullYear()}
                </p>
            </motion.div>
        </div>
    );
}
