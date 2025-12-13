import { useState } from "react";
import { Link } from "react-router-dom";

export default function FeaturesSection() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const features = [
    {
      id: 1,
      badge: "ADVANTAGE 1",
      title: "All your PDF tools in one place",
      description: "HAMROpdf brings together all essential PDF functionalities on a single platform: merge, split, compress, convert, protect, edit or compare your PDFs. Everything you need for your assignments, projects, and work documents - all completely free!"
    },
    {
      id: 2,
      badge: "ADVANTAGE 2", 
      title: "Simple, fast, and easy to use",
      description: "Designed with simplicity in mind, HAMROpdf lets you complete any task in just a few clicks. No technical knowledge needed - perfect for students, professionals, and anyone who needs to work with PDFs quickly."
    },
    {
      id: 3,
      badge: "ADVANTAGE 3",
      title: "Access from anywhere, anytime",
      description: "Whether you're at home, office, college, or cyber café - HAMROpdf is always accessible. Works on desktop, mobile, and tablets. No installation required, just open your browser and start working."
    }
  ];

  const faqs = [
    {
      question: "What are HAMROpdf's main features?",
      answer: "HAMROpdf offers a complete range of free PDF tools including merge, split, compress, convert to Word/Excel/PowerPoint, edit, protect, unlock, rotate, and many more. All tools are accessible from a single platform without any registration."
    },
    {
      question: "Is it really free to use HAMROpdf tools?",
      answer: "Yes! HAMROpdf is 100% free for everyone. No hidden costs, no premium plans, no subscriptions. We believe in providing free PDF tools for students and professionals across Nepal."
    },
    {
      question: "Is uploading documents safe on HAMROpdf?",
      answer: "Absolutely secure! We use SSL encryption for all file transfers. Your files are automatically deleted from our servers immediately after processing to ensure complete privacy. Your data security is our top priority."
    },
    {
      question: "Can I access HAMROpdf from my mobile device?",
      answer: "Yes! HAMROpdf is fully responsive and works perfectly on all devices - smartphones, tablets, and desktop computers. Access it directly from any browser, no app installation needed."
    },
    {
      question: "Can I use HAMROpdf for my college work?",
      answer: "Definitely! HAMROpdf is perfect for students. Use it for assignments, project reports, thesis work, or any academic documents. Compress PDFs to meet submission requirements, merge chapters, convert formats, and more."
    }
  ];

  const news = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
      title: "How students in Nepal use HAMROpdf for assignments",
      excerpt: "Discover how Nepali students are using HAMROpdf to streamline their academic work. Learn tips for managing assignment PDFs, compressing files for online submission, and converting formats efficiently.",
      link: "/blog/students-guide"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop",
      title: "Best practices for managing business documents in Nepal",
      excerpt: "Learn how Nepali businesses and professionals are using HAMROpdf to manage contracts, invoices, and reports. Simple tips to improve your document workflow and boost productivity.",
      link: "/blog/business-documents"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <>
      {/* Advantages Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-200">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why choose HAMROpdf?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your trusted PDF solution made for Nepal
            </p>
          </div>
          
          <div className="relative flex items-center">
            {/* Previous Arrow */}
            <button
              onClick={prevSlide}
              className="absolute -left-12 z-10 bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg hidden md:block"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`bg-white dark:bg-gray-800 backdrop-blur rounded-2xl p-8 transition-all duration-300 border border-gray-100 dark:border-gray-700 ${
                    index === currentIndex ? 'shadow-2xl scale-105 md:scale-100 border-blue-500 dark:border-blue-600' : 'shadow-lg'
                  }`}
                >
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-600 dark:to-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                    {feature.badge}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={nextSlide}
              className="absolute -right-12 z-10 bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg hidden md:block"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section - Replacing Premium Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=400&fit=crop" 
                  alt="Students using HAMROpdf"
                  className="rounded-lg shadow-lg transform -rotate-6 hover:rotate-0 transition-transform dark:opacity-90"
                />
                <img 
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop" 
                  alt="Professional documents"
                  className="rounded-lg shadow-lg transform rotate-6 hover:rotate-0 transition-transform mt-8 dark:opacity-90"
                />
              </div>
            </div>

            {/* Right - Benefits Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Everything you need, completely free
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Unlimited access to all PDF tools - no registration or hidden fees</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Works on all devices - laptop, mobile, tablet. Access from anywhere</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Fast processing and secure encryption - your privacy guaranteed</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Perfect for students, professionals, and businesses in Nepal</span>
                </li>
              </ul>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold px-4 py-2 rounded-lg">
                  <span className="mr-2">🇳🇵</span>
                  Made for Nepal
                </span>
                <span className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold px-4 py-2 rounded-lg">
                  <span className="mr-2">💯</span>
                  100% Free
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Common Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Everything you need to know about HAMROpdf
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News/Blog Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-red-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tips & Resources
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Learn how to make the most of HAMROpdf
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {news.map((article) => (
              <Link 
                key={article.id}
                to={article.link}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 dark:opacity-90"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                    <span className="inline-block mt-4 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}