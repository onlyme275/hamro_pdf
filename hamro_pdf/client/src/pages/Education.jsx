import React, { useState } from 'react';

export default function StudentPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const popularTools = [
    {
      icon: "📦",
      title: "Compress PDF",
      description: "Reduce file size to meet submission limits",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "✂️",
      title: "Split PDF",
      description: "Extract specific pages for assignments",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "📑",
      title: "Merge PDF",
      description: "Combine research papers and notes",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "🔄",
      title: "Rotate PDF",
      description: "Fix scanned document orientation",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: "📝",
      title: "Word to PDF",
      description: "Convert assignments to PDF format",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: "🖼️",
      title: "JPG to PDF",
      description: "Convert notes images to documents",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const benefits = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Process your PDFs in seconds, not minutes"
    },
    {
      icon: "🛡️",
      title: "100% Secure",
      description: "Your files are encrypted and auto-deleted after processing"
    },
    {
      icon: "🕐",
      title: "24/7 Available",
      description: "Work on assignments anytime, from anywhere"
    },
    {
      icon: "🇳🇵",
      title: "Made for Nepal",
      description: "Proudly serving Nepali students from Kathmandu to Pokhara"
    }
  ];

  const useCases = [
    "Compress large thesis PDFs to meet university submission limits",
    "Merge multiple research papers into one document",
    "Split lengthy textbooks to extract relevant chapters",
    "Convert Word assignments to PDF before submission",
    "Protect personal documents with password encryption",
    "Add page numbers to project reports"
  ];

  const features = [
    "Unlimited file conversions",
    "No watermarks on outputs",
    "Batch processing support",
    "Cloud storage integration",
    "Mobile-friendly interface",
    "No registration required"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full mb-6 animate-pulse">
            <span className="text-yellow-400 text-xl">⭐</span>
            <span className="text-sm">Trusted by 10,000+ Nepali Students</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            PDF Tools Built for
            <br />
            Nepali Students
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            From Kathmandu to Pokhara, from assignments to thesis work. 
            Compress, merge, split, and convert PDFs - all free, forever.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Using Free</span>
              <span>→</span>
            </button>
            <button className="bg-white/10 backdrop-blur px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
              View All Tools
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Files Processed", value: "1M+" },
              { label: "Active Users", value: "10K+" },
              { label: "Success Rate", value: "99.9%" },
              { label: "Avg Process Time", value: "<5s" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Most Popular Student Tools
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need for assignments, projects, and thesis work
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, index) => (
              <div 
                key={index}
                className="group bg-slate-800/50 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer hover:shadow-2xl"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300 text-3xl`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-400">{tool.description}</p>
                <div className="mt-4 flex items-center text-blue-400 font-semibold">
                  <span>Use Now</span>
                  <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              View All 30+ Tools
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Students Love HAMROpdf
            </h2>
            <p className="text-gray-400 text-lg">
              Built with students' needs in mind
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-2xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Perfect for Every Student Task
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Whether you're working on assignments, research papers, or final thesis, 
                HAMROpdf has the tools to make your academic life easier.
              </p>
              
              <div className="space-y-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <span className="text-green-400 text-xl flex-shrink-0 group-hover:scale-125 transition-transform duration-300">✓</span>
                    <span className="text-gray-300">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6">Free Forever for Students</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-blue-400 text-xl">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                Start Using Free Tools
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Students Say
            </h2>
            <p className="text-gray-400 text-lg">
              Real feedback from Nepali students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                university: "Tribhuvan University",
                text: "HAMROpdf saved me when I had to compress my thesis. Super fast and completely free!",
                rating: 5
              },
              {
                name: "Rajesh Thapa",
                university: "Kathmandu University",
                text: "I use it daily for converting my notes to PDF. Best tool for students in Nepal.",
                rating: 5
              },
              {
                name: "Anita Gurung",
                university: "Pokhara University",
                text: "The merge PDF feature is perfect for combining my research papers. Highly recommend!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.university}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Simplify Your PDF Work?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join thousands of Nepali students already using HAMROpdf
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                Get Started - It's Free!
              </button>
              <button className="bg-white/20 backdrop-blur px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}