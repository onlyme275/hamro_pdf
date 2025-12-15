import { useState } from "react";
import { Link } from "react-router-dom";

// Advertisement Card Component
const AdCard = ({ title, description, image, link, badge }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl">📢</span>
          </div>
        )}
        {badge && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
          {title}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          {description}
        </p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
};

const ToolsGridSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Workflow",
    "Organize PDF",
    "Optimize PDF",
    "Convert PDF",
    "Edit PDF",
    "Secure PDF"
  ];

  const tools = [
    {
      id: 1,
      icon: "🔗",
      title: "Merge PDF",
      description: "Combine multiple PDFs for your reports and assignments",
      category: ["All", "Organize PDF"],
      href: "/merge"
    },
    {
      id: 2,
      icon: "✂️",
      title: "Split PDF",
      description: "Extract specific pages from your documents easily",
      category: ["All", "Organize PDF"],
      href: "/split"
    },
    {
      id: 3,
      icon: "📦",
      title: "Compress PDF",
      description: "Reduce file size for easy sharing via email or Viber",
      category: ["All", "Optimize PDF"],
      href: "/compress"
    },
    {
      id: 4,
      icon: "W",
      title: "PDF to WORD",
      description: "Convert PDFs to editable Word documents instantly",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-word"
    },
    {
      id: 5,
      icon: "P",
      title: "PDF to POWERPOINT",
      description: "Transform PDFs into presentation slides for your meetings",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-ppt"
    },
    {
      id: 6,
      icon: "X",
      title: "PDF to EXCEL",
      description: "Extract data and tables into Excel spreadsheets",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-excel"
    },
    {
      id: 7,
      icon: "W",
      title: "WORD to PDF",
      description: "Convert Word documents to professional PDFs",
      category: ["All", "Convert PDF"],
      href: "/word-to-pdf"
    },
    {
      id: 8,
      icon: "P",
      title: "POWERPOINT to PDF",
      description: "Save your presentations as PDF documents",
      category: ["All", "Convert PDF"],
      href: "/ppt-to-pdf"
    },
    {
      id: 9,
      icon: "X",
      title: "EXCEL to PDF",
      description: "Convert spreadsheets and data tables to PDF",
      category: ["All", "Convert PDF"],
      href: "/excel-to-pdf"
    },
    {
      id: 10,
      icon: "✏️",
      title: "Edit PDF",
      description: "Modify text and images in your PDF files",
      category: ["All", "Edit PDF"],
      href: "/edit"
    },
    {
      id: 11,
      icon: "🖼️",
      title: "PDF to JPG",
      description: "Convert PDF pages to image files for sharing",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-jpg"
    },
    {
      id: 12,
      icon: "📷",
      title: "JPG to PDF",
      description: "Convert photos and images to PDF documents",
      category: ["All", "Convert PDF"],
      href: "/jpg-to-pdf"
    },
    {
      id: 13,
      icon: "✍️",
      title: "Sign PDF",
      description: "Add your digital signature to contracts and forms",
      category: ["All", "Edit PDF"],
      href: "/sign"
    },
    {
      id: 14,
      icon: "💧",
      title: "Watermark PDF",
      description: "Protect your documents with custom watermarks",
      category: ["All", "Edit PDF"],
      href: "/watermark"
    },
    {
      id: 15,
      icon: "🔄",
      title: "Rotate PDF",
      description: "Fix orientation of scanned documents and pages",
      category: ["All", "Organize PDF"],
      href: "/rotate"
    },
    {
      id: 16,
      icon: "🔓",
      title: "Unlock PDF",
      description: "Remove password protection from your PDFs",
      category: ["All", "Secure PDF"],
      href: "/unlock"
    },
    {
      id: 17,
      icon: "🔒",
      title: "Protect PDF",
      description: "Secure your important documents with passwords",
      category: ["All", "Secure PDF"],
      href: "/protect"
    },
    {
      id: 18,
      icon: "📂",
      title: "Organize PDF",
      description: "Reorder and arrange pages in your documents",
      category: ["All", "Organize PDF"],
      href: "/organize"
    },
    {
      id: 19,
      icon: "📄",
      title: "PDF to PDF/A",
      description: "Convert to archive format for long-term storage",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-pdfa"
    },
    {
      id: 20,
      icon: "🔧",
      title: "Repair PDF",
      description: "Fix corrupted or damaged PDF files quickly",
      category: ["All", "Optimize PDF"],
      href: "/repair"
    },
    {
      id: 21,
      icon: "🔢",
      title: "Page Numbers",
      description: "Add professional page numbers to your documents",
      category: ["All", "Edit PDF"],
      href: "/page-number"
    },
    {
      id: 22,
      icon: "#",
      title: "Number Pages",
      description: "Customize page numbering for your PDFs",
      category: ["All", "Edit PDF"],
      href: "/number-pages"
    },
    {
      id: 23,
      icon: "👁️",
      title: "OCR PDF",
      description: "Make scanned documents searchable and editable",
      category: ["All", "Edit PDF"],
      href: "/ocr"
    },
    {
      id: 24,
      icon: "📊",
      title: "Compare PDF",
      description: "Compare two versions of documents side by side",
      category: ["All", "Workflow"],
      href: "/compare"
    },
    {
      id: 25,
      icon: "🖼️",
      title: "JPG to PNG",
      description: "Convert JPG images to PNG format instantly",
      category: ["All", "Convert PDF"],
      href: "/jpg-to-png"
    },
    {
      id: 26,
      icon: "🖼️",
      title: "PNG to JPG",
      description: "Convert PNG images to JPG format instantly",
      category: ["All", "Convert PDF"],
      href: "/png-to-jpg"
    }
  ];

  // Advertisement data
  const leftAds = [
    {
      title: "Quantum Tech",
      description: "For all your tech needs, visit Quantum Tech in Kathmandu",
      badge: "PRO",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      link: "#"
    },
    {
      title: "Organic Fiber Store",
      description: "Sustainable and eco-friendly hemp-fabrics for your fashion needs",
      badge: "Hemp",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      link: "#"
    },
    {
      title: "Sagarmatha Diagnostics",
      description: "Comprehensive health check-up packages at affordable prices",
      badge: "Health",
      image: "https://www.bellarmine.edu/sf-images/default-source/admitted-students/mls.jpg?sfvrsn=5a027880_3",
      link: "#"
    },
    {
      title: "Nexus Collection",
      description: "Beauty and Fashion Accessories.",
      badge: "Shopping",
      image: "https://enexuscollection.com/uploads/logo-1757743360238-825628689.jpg",
      link: "#"
    }
  ];

  const rightAds = [
    {
      title: "Admi World",
      description: "Your Abroad Study Partner - Visit Admi World in Kathmandu",
      badge: "Study Abroad",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500",
      link: "#"
    },
    {
      title: "prepedo Nepal",
      description: "Luxury Ride Sharing in Nepal",
      badge: "Transport",
      image: "https://www.netsolutions.com/wp-content/uploads/2024/12/How-to-Build-a-Ride-Sharing-App-from-Scratch_.webp",
      link: "#"
    },
    {
      title: "Padmashree International College",
      description: "Best I.T College in Nepal",
      badge: "BIT",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=500",
      link: "#"
    },
    {
      title: "Baskota Advocates",
      description: "Leading legal services in Nepal",
      badge: "Legal",
      link: "#",
      image: "https://www.totallylegal.com/getasset/c3ee2a89-b973-445f-9337-1ca05736c950/"
    }
  ];

  const filteredTools = activeCategory === "All"
    ? tools
    : tools.filter(tool => tool.category.includes(activeCategory));

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-20 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            All your PDF tools in one place - Hamro PDF
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete PDF solutions for students, professionals, and businesses across Nepal
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === category
                  ? "bg-blue-600 dark:bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Main Content with Ads */}
        <div className="flex gap-6">
          {/* Left Advertisement Column */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-4">
              {leftAds.map((ad, index) => (
                <AdCard key={index} {...ad} />
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.href}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200 h-full flex flex-col items-center text-center border border-gray-100 dark:border-gray-700">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-100 group-hover:to-red-100 dark:group-hover:from-gray-600 dark:group-hover:to-gray-500 transition-all">
                      <span className="text-3xl">{tool.icon}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                      {tool.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex-grow">
                      {tool.description}
                    </p>

                    {/* Read More Link */}
                    <span className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                      Use tool →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Show More Button */}
            <div className="flex justify-center mt-10">
              <button className="p-4 bg-blue-600 dark:bg-blue-700 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Advertisement Column */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-4">
              {rightAds.map((ad, index) => (
                <AdCard key={index} {...ad} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsGridSection;