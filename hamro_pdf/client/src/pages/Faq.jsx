import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is HAMROpdf?",
      answer:
        "HAMROpdf is an all-in-one web platform that allows you to create, edit, convert, sign, and manage PDF documents securely and efficiently.",
    },
    {
      question: "Is HAMROpdf free to use?",
      answer:
        "Yes! We offer a free plan with basic PDF tools. You can upgrade to our Pro or Enterprise plans for advanced features like cloud sync, e-signatures, and team collaboration.",
    },
    {
      question: "Are my documents safe and private?",
      answer:
        "Absolutely. All your files are encrypted using top-grade security standards. We never store your documents longer than necessary, and your data is protected under strict privacy policies.",
    },
    {
      question: "Can I use HAMROpdf on mobile devices?",
      answer:
        "Yes, HAMROpdf is optimized for all devices including desktops, tablets, and smartphones — so you can work with your PDFs anywhere, anytime.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Yes, our support team is available 24/7 for Pro and Enterprise users. Free users can also access our help center for FAQs and tutorials.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel or change your subscription at any time from your account settings. You’ll retain access until the end of your billing cycle.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-300 dark:from-slate-900 dark:to-blue-950 text-slate-800 dark:text-slate-100 transition-all">
      {/* Header Section */}
      <section className="text-center py-20 px-6 md:px-16">
        <div className="flex justify-center mb-4">
          <HelpCircle className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Frequently Asked <span className="text-blue-600">Questions</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
          Have questions? We’ve got answers. Learn more about HAMROpdf’s features,
          pricing, and security.
        </p>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 pb-24">
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`border rounded-2xl shadow-sm bg-white/80 dark:bg-slate-800/60 transition-all overflow-hidden ${
                openIndex === index ? "border-blue-600 shadow-md" : "border-slate-300/40"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
              >
                <span className="text-lg font-medium">{item.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-blue-600 w-6 h-6" />
                ) : (
                  <ChevronDown className="text-blue-600 w-6 h-6" />
                )}
              </button>

              <div
                className={`px-6 pb-4 text-slate-600 dark:text-slate-300 transition-all duration-300 ${
                  openIndex === index ? "block" : "hidden"
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-16 bg-blue-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Still have questions?
        </h2>
        <p className="max-w-2xl mx-auto mb-6">
          We’re here to help. Contact our team or explore our Help Center for detailed
          guides and tutorials.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-slate-100 transition">
          Contact Support
        </button>
      </section>
    </main>
  );
}
