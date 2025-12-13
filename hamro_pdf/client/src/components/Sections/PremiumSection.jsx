import { Link } from "react-router-dom";

export default function CommunitySection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-gradient-to-r from-blue-100 to-red-100 dark:from-blue-900 dark:to-red-900 text-blue-700 dark:text-blue-300 px-6 py-2 rounded-full text-sm font-semibold mb-4 border border-blue-200 dark:border-blue-800">
            🇳🇵 Proudly Made for Nepal
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Join Thousands of Users Across Nepal
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            From Kathmandu to Pokhara, from students to enterprises - HAMROpdf serves everyone with flexible plans for every need.
          </p>
        </div>
        
        {/* Three User Categories */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">For Students</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Perfect for assignments, projects, and thesis work. Compress files to meet submission limits.
            </p>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block font-semibold text-sm">
              FREE Forever
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-red-900/20 dark:via-gray-800 dark:to-blue-900/20 rounded-2xl p-8 border-2 border-gray-300 dark:border-gray-700 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">For Professionals</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Manage contracts, invoices, and reports. Free for basic tasks, premium for advanced needs.
            </p>
            <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-2 rounded-lg inline-block font-semibold text-sm">
              FREE + Premium
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-8 border-2 border-red-200 dark:border-red-800 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">For Businesses</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Bulk processing, team collaboration, priority support, and advanced security features.
            </p>
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-block font-semibold text-sm">
              Premium Plans
            </div>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-blue-500 dark:border-blue-600 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free Plan</h3>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">₹0</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">All basic PDF tools</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Files up to 100MB</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">10 files per day</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">No registration required</span>
                </li>
              </ul>
              <Link
                to="/tools"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-red-600 dark:from-blue-700 dark:to-red-700 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Premium Plan Professionals</h3>
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/30">
                  Recommended
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">NRS.500</span>
                <span className="text-blue-100 ml-2">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">All premium PDF tools</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Files up to 2GB</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">1000+ Files</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Batch processing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Priority support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white">Ad-free experience</span>
                </li>
              </ul>
              <Link
                to="/premium"
                className="block w-full text-center bg-white hover:bg-gray-100 text-blue-700 font-bold px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Special pricing for educational institutions and businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/pricing"
              className="inline-block bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Plans
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold px-8 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
          <p className="mt-8 text-gray-900 dark:text-white font-medium">
            हाम्रो PDF - Your PDF, Your Way 🇳🇵
          </p>
        </div>
      </div>
    </section>
  );
}