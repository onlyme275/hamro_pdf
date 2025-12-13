import { useState } from "react";
import { FileText, ShieldCheck, Zap, Cloud, Lock, Users, ArrowRight } from "lucide-react";

export default function Features() {
  const [hovered, setHovered] = useState(null);

  const features = [
    {
      icon: FileText,
      title: "PDF Creation & Editing",
      description:
        "Easily create new PDFs or make quick edits to your existing documents with our modern tools.",
      color: "blue",
      gradient: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    },
    {
      icon: ShieldCheck,
      title: "Advanced Security",
      description:
        "Protect your data with enterprise-grade encryption and strict privacy compliance.",
      color: "green",
      gradient: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    },
    {
      icon: Zap,
      title: "High Performance",
      description:
        "Experience ultra-fast document processing optimized for speed and reliability.",
      color: "yellow",
      gradient: "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description:
        "Sync your files seamlessly with Google Drive, Dropbox, and other cloud services.",
      color: "purple",
      gradient: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
    },
    {
      icon: Lock,
      title: "Access Control",
      description:
        "Set passwords, restrict sharing, and control who can view or edit your files.",
      color: "red",
      gradient: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
    },
    {
      icon: Users,
      title: "Collaboration Tools",
      description:
        "Work together in real time with comments, annotations, and version control.",
      color: "cyan",
      gradient: "from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-300 dark:from-slate-900 dark:to-blue-950 text-slate-800 dark:text-slate-100 transition-all">
      <section className="py-20 px-6 md:px-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our <span className="text-blue-600">Powerful Features</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
            Everything you need to manage, edit, and secure your documents — built for
            professionals, students, and businesses alike.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            const active = hovered === index;
            return (
              <div
                key={index}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={`rounded-2xl p-6 shadow-md border transition-all duration-500 cursor-pointer 
                ${
                  active
                    ? `bg-gradient-to-br ${item.gradient} scale-105`
                    : "bg-white dark:bg-slate-800 hover:scale-105"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-8 h-8 text-${item.color}-600`} />
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {item.description}
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

      <section className="text-center py-16 bg-blue-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Ready to Experience the Difference?
        </h2>
        <p className="max-w-2xl mx-auto mb-6">
          Join thousands of satisfied users worldwide and take control of your PDFs today.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-slate-100 transition">
          Get Started Now
        </button>
      </section>
    </main>
  );
}
