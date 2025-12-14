import { useState } from "react";
import NepaliDate from "nepali-date-converter";

export default function DateConverter() {
    const [mode, setMode] = useState("AD2BS"); // "AD2BS" or "BS2AD"
    const [inputDate, setInputDate] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleConvert = () => {
        setError("");
        setResult(null);

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
                const dateParts = inputDate.split("-").map(Number);
                if (dateParts.length !== 3) throw new Error("Invalid Format");

                // NepaliDate constructor takes (year, month - 1, day) for BS? 
                // Docs say can parse string or numbers. Let's try string parsing or verify.
                // Assuming NepaliDate(string) parses YYYY-MM-DD or YYYY/MM/DD
                const bsDate = new NepaliDate(inputDate);
                const adDate = bsDate.toJsDate();
                setResult(adDate.toISOString().split("T")[0]);
            }
        } catch (err) {
            console.error(err);
            setError("Invalid date or format. Please check your input.");
        }
    };

    const toggleMode = () => {
        setMode(mode === "AD2BS" ? "BS2AD" : "AD2BS");
        setInputDate("");
        setResult(null);
        setError("");
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                        Date Converter
                    </h1>
                    <p className="text-gray-600">
                        Convert dates between AD (English) and BS (Nepali) seamlessly.
                    </p>
                </div>

                {/* Converter Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto shadow-sm">

                    {/* Toggle Switch */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex">
                            <button
                                onClick={() => setMode("AD2BS")}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${mode === "AD2BS"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                AD to BS
                            </button>
                            <button
                                onClick={() => setMode("BS2AD")}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${mode === "BS2AD"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                BS to AD
                            </button>
                        </div>
                    </div>

                    {/* Input Section */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Date ({mode === "AD2BS" ? "AD" : "BS"})
                            </label>
                            <div className="relative">
                                <input
                                    type={mode === "AD2BS" ? "date" : "text"}
                                    placeholder={mode === "BS2AD" ? "YYYY-MM-DD" : ""}
                                    value={inputDate}
                                    onChange={(e) => setInputDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white outline-none"
                                />
                            </div>
                            {mode === "BS2AD" && (
                                <p className="text-xs text-gray-500 mt-2">Format: YYYY-MM-DD (e.g., 2080-01-01)</p>
                            )}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleConvert}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm active:transform active:scale-[0.98]"
                        >
                            Convert
                        </button>

                        {/* Result Section */}
                        {result && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500 text-center mb-2">Converted Date</p>
                                <div className="text-3xl font-bold text-gray-900 text-center bg-white border border-gray-200 py-4 rounded-lg shadow-sm">
                                    {result} <span className="text-lg font-normal text-gray-400 ml-1">{mode === "AD2BS" ? "BS" : "AD"}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
