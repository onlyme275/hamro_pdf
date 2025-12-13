import { useState, useEffect } from "react";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function Welcome() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Create & Edit PDFs",
      description:
        "Build new documents or make changes to existing PDFs quickly using our intuitive tools.",
      color: "blue",
      bgGradient:
        "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      description:
        "Your files are protected with top-grade encryption and handled safely across all devices.",
      color: "green",
      bgGradient:
        "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimize your workflow with ultra-fast processing and modern web performance.",
      color: "yellow",
      bgGradient:
        "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    },
  ];

  const stats = [
    { value: "100k+", label: "Active Users" },
    { value: "10M+", label: "PDFs Processed" },
    { value: "99%", label: "Uptime" },
    { value: "100+", label: "Countries" },
  ];

  const hello = [
    "End-to-end encryption",
    "GDPR compliant",
    "24/7 customer support",
    "No file size limits",
    "Batch processing",
    "Cloud integration",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-300 dark:from-slate-900 dark:to-blue-950 text-slate-800 dark:text-slate-100 transition-all">
      <section className="w-full flex flex-col items-center text-center py-20 px-6 md:px-16">
        <div className="flex items-center gap-2 bg-blue-600/10 text-blue-700 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <p className="text-sm font-medium">
            ✨ New: Powered PDF Tools Available
          </p>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to <span className="text-blue-600">HAMROpdf</span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300 mb-6">
          Your all-in-one solution to create, edit, sign, and manage your PDF
          documents — anywhere, anytime.
        </p>
        <p className="text-blue-600 font-semibold mb-8">Simple. Secure. Fast.</p>

        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition">
            Explore Features
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition">
            View Pricing
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {stats.map((item, index) => (
            <div
              key={index}
              className="text-center bg-white/70 dark:bg-slate-800/40 rounded-2xl shadow p-4"
            >
              <p className="text-2xl font-bold text-blue-600">{item.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-16 bg-white/60 dark:bg-slate-900/60">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Powerful Features
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-12">
          Everything you need to work with PDFs, all in one place.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveFeature(index)}
                className={`rounded-2xl p-6 shadow-md cursor-pointer transition-all duration-500 
                  ${
                    isActive
                      ? `bg-gradient-to-br ${feature.bgGradient} scale-105`
                      : "bg-white dark:bg-slate-800 hover:scale-105"
                  }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-8 h-8 text-${feature.color}-600`} />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-1 text-blue-600 hover:gap-2 transition-all">
                  <p>Learn more</p>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 px-6 md:px-16 text-center">
        <h3 className="text-3xl font-bold mb-6">
          Why Professionals Choose <span className="text-blue-600">HAMROpdf</span>
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {hello.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-3 bg-white/70 dark:bg-slate-800/50 rounded-xl shadow p-3"
            >
              <CheckCircle2 className="text-green-500 w-5 h-5" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-16 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Empowering Users Around the World 🌍
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            HAMROpdf is trusted by professionals, students, and businesses
            globally to manage their documents efficiently and securely.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition">
            Get in Touch
          </button>
        </div>
      </section>
    </main>
  );
}
