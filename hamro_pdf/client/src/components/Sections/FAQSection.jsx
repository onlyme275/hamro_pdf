import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is HAMROpdf really free?",
      answer: "Yes! All PDF tools on HAMROpdf are 100% free to use. No hidden charges, no subscriptions - just free tools for everyone in Nepal and beyond."
    },
    {
      question: "Are my files safe and secure?",
      answer: "Absolutely! All files are encrypted using SSL encryption. Your files are automatically deleted from our servers after processing, and you can delete them immediately after download. Your privacy is our priority."
    },
    {
      question: "Do I need to create an account or register?",
      answer: "No account needed! HAMROpdf works instantly without any registration. Just upload your file, use the tool, and download your result - that's it!"
    },
    {
      question: "Can I use HAMROpdf on my mobile phone?",
      answer: "Yes! HAMROpdf works perfectly on all devices - smartphones, tablets, laptops, and desktops. No app installation required, just open your browser and start working."
    },
    {
      question: "What file formats are supported?",
      answer: "We support PDF conversion to and from Word, Excel, PowerPoint, JPG, PNG, and many other formats. Each tool shows the supported formats, giving you flexibility for all your document needs."
    },
    {
      question: "Is there a file size limit?",
      answer: "You can process files up to 100MB completely free. This is enough for most documents, assignments, reports, and presentations."
    },
    {
      question: "Do I need internet connection to use HAMROpdf?",
      answer: "Yes, HAMROpdf is a web-based tool, so you'll need an internet connection. However, this means you can access it from anywhere - at home, office, or even from your local cyber café."
    },
    {
      question: "Can I use this for my college assignments and projects?",
      answer: "Absolutely! HAMROpdf is perfect for students. Compress PDFs to meet submission size limits, merge multiple files, convert formats, and more - all the tools you need for your academic work."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-red-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Got questions? We've got answers! Learn more about HAMROpdf
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-inset rounded-xl group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 animate-fadeIn">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-lg">🇳🇵</span>
              <span>Made for Nepal</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-lg">🔒</span>
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-lg">⚡</span>
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-lg">💯</span>
              <span>Always Free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}