import React from "react";
import { Link } from "react-router-dom";

export default function CTASection() {
  const navigationLinks = {
    "Manage PDF Files": [
      { name: "Edit PDF", icon: "✏️", href: "/edit-pdf" },
      { name: "Merge PDF", icon: "🔗", href: "/merge-pdf" },
      { name: "Split PDF", icon: "✂️", href: "/split-pdf" },
      { name: "Protect PDF", icon: "🔒", href: "/protect-pdf" },
      { name: "Unlock PDF", icon: "🔓", href: "/unlock-pdf" },
      { name: "Create PDF", icon: "➕", href: "/create-pdf" },
      { name: "Add page numbers", icon: "🔢", href: "/page-numbers" },
      { name: "Extract pages", icon: "📄", href: "/extract-pages" },
      { name: "Rotate pages", icon: "🔄", href: "/rotate-pdf" },
      { name: "Delete pages", icon: "🗑️", href: "/delete-pages" },
      { name: "Rearrange pages", icon: "↕️", href: "/rearrange-pages" },
      { name: "Duplicate PDF", icon: "📑", href: "/duplicate-pdf" },
      { name: "PDF metadata", icon: "ℹ️", href: "/pdf-metadata" },
      { name: "Repair PDF", icon: "🔧", href: "/repair-pdf" },
      { name: "Simplify PDF", icon: "📋", href: "/simplify-pdf" },
    ],
    "Convert PDF": [
      { name: "Compress PDF", icon: "📦", href: "/compress-pdf" },
      { name: "Split PDF", icon: "✂️", href: "/split-pdf" },
      { name: "Protect PDF", icon: "🔒", href: "/protect-pdf" },
      { name: "Rotate PDF", icon: "🔄", href: "/rotate-pdf" },
      { name: "Sign PDF", icon: "✍️", href: "/sign-pdf" },
      { name: "Resize pages", icon: "📐", href: "/resize-pages" },
      { name: "Add watermark", icon: "💧", href: "/watermark" },
      { name: "Extract text", icon: "📝", href: "/extract-text" },
      { name: "Extract images", icon: "🖼️", href: "/extract-images" },
      { name: "Edit text in PDF", icon: "✏️", href: "/edit-text" },
      { name: "Edit image in PDF", icon: "🎨", href: "/edit-image" },
      { name: "Annotate PDF", icon: "💬", href: "/annotate" },
      { name: "Add metadata", icon: "📋", href: "/add-metadata" },
      { name: "White out PDF", icon: "⬜", href: "/whiteout" },
      { name: "Crop pages", icon: "✂️", href: "/crop-pages" },
      { name: "Organize pages", icon: "📂", href: "/organize" },
    ],
    "Convert to PDF": [
      { name: "Word to PDF", icon: "📄", href: "/word-to-pdf" },
      { name: "PPT to PDF", icon: "📊", href: "/ppt-to-pdf" },
      { name: "Excel to PDF", icon: "📈", href: "/excel-to-pdf" },
      { name: "JPG to PDF", icon: "🖼️", href: "/jpg-to-pdf" },
      { name: "PNG to PDF", icon: "🖼️", href: "/png-to-pdf" },
      { name: "HTML to PDF", icon: "🌐", href: "/html-to-pdf" },
      { name: "TXT to PDF", icon: "📝", href: "/txt-to-pdf" },
      { name: "TIFF to PDF", icon: "🖼️", href: "/tiff-to-pdf" },
      { name: "SVG to PDF", icon: "🎨", href: "/svg-to-pdf" },
      { name: "MOBI to PDF", icon: "📖", href: "/mobi-to-pdf" },
      { name: "VSD to PDF", icon: "📐", href: "/vsd-to-pdf" },
      { name: "HEIF to PDF", icon: "🖼️", href: "/heif-to-pdf" },
      { name: "BMP to PDF", icon: "🖼️", href: "/bmp-to-pdf" },
      { name: "FB2 to PDF", icon: "📚", href: "/fb2-to-pdf" },
      { name: "WPS to PDF", icon: "📄", href: "/wps-to-pdf" },
      { name: "Ebook to PDF", icon: "📚", href: "/ebook-to-pdf" },
      { name: "AI to PDF", icon: "🎨", href: "/ai-to-pdf" },
    ],
    "Convert from PDF": [
      { name: "PDF to Word", icon: "📄", href: "/pdf-to-word" },
      { name: "PDF to Excel", icon: "📊", href: "/pdf-to-excel" },
      { name: "PDF to PPT", icon: "📈", href: "/pdf-to-ppt" },
      { name: "PDF to JPG", icon: "🖼️", href: "/pdf-to-jpg" },
      { name: "PDF to PNG", icon: "🖼️", href: "/pdf-to-png" },
      { name: "PDF to Text", icon: "📝", href: "/pdf-to-text" },
      { name: "PDF to CSV", icon: "📊", href: "/pdf-to-csv" },
      { name: "PDF to ODT", icon: "📄", href: "/pdf-to-odt" },
      { name: "PDF to SVG", icon: "🎨", href: "/pdf-to-svg" },
      { name: "PDF to RTF", icon: "📄", href: "/pdf-to-rtf" },
      { name: "PDF to GIF", icon: "🎬", href: "/pdf-to-gif" },
      { name: "PDF to MOBI", icon: "📖", href: "/pdf-to-mobi" },
      { name: "PDF to XLS", icon: "📊", href: "/pdf-to-xls" },
      { name: "PDF to TIFF", icon: "🖼️", href: "/pdf-to-tiff" },
      { name: "PDF to PDF/A", icon: "📄", href: "/pdf-to-pdfa" },
    ],
  };

  return (
    <>
      {/* Feature Cards Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Card - Image Editing */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200 border border-gray-100 dark:border-gray-700">
              <div className="relative h-64 bg-gradient-to-br from-orange-100 to-yellow-50 dark:from-gray-700 dark:to-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop"
                  alt="Image editing tools for Nepal"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 dark:opacity-70"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Image editing made simple with HAMROpdf
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Edit your images with ease and speed. Compress, resize, and enhance your photos for assignments, projects, or social media - all free and secure.
                </p>
                <Link
                  to="/image-tools"
                  className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  EXPLORE TOOLS →
                </Link>
              </div>
            </div>

            {/* Right Card - Trust Indicators */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200 border border-gray-100 dark:border-gray-700">
              <div className="relative h-64 bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-gray-700 dark:to-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
                  alt="Trusted by users across Nepal"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 dark:opacity-70"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Trusted by students and professionals across Nepal
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  HAMROpdf is your go-to platform for easy PDF editing. Get all the tools you need for assignments, business documents, and personal files - completely free and secure.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔒</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      SECURE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      FAST
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇳🇵</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      NEPAL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Quick Navigation - Find Your Tool
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse through our complete collection of PDF tools organized by category
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(navigationLinks).map(([category, links]) => (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 pb-3 border-b-2 border-blue-500 dark:border-blue-600">
                  {category}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                      >
                        <span className="text-base group-hover:scale-110 transition-transform">{link.icon}</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}