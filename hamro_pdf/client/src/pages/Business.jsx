import React, { useState, useEffect } from 'react';

export default function BusinessPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save theme to localStorage when it changes
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const businessFeatures = [
    {
      icon: "👥",
      title: "Team Collaboration",
      description: "Share documents, assign tasks, and collaborate seamlessly with your team",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "🚀",
      title: "Bulk Processing",
      description: "Process hundreds of PDFs simultaneously with our enterprise tools",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔒",
      title: "Advanced Security",
      description: "Enterprise-grade encryption, SSO, and compliance features",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: "⚙️",
      title: "API Integration",
      description: "Seamlessly integrate PDF tools into your existing workflow",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Track usage, monitor team productivity, and generate reports",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: "🎨",
      title: "Custom Branding",
      description: "Add your logo, colors, and branding to all documents",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const useCases = [
    {
      industry: "Legal Firms",
      icon: "⚖️",
      tasks: ["Contract management", "Case file organization", "Secure document sharing", "Digital signatures"]
    },
    {
      industry: "Healthcare",
      icon: "🏥",
      tasks: ["Patient record management", "HIPAA-compliant storage", "Medical report conversion", "Secure file transfer"]
    },
    {
      industry: "Real Estate",
      icon: "🏢",
      tasks: ["Property document management", "Contract processing", "Digital signatures", "Client document sharing"]
    },
    {
      industry: "Finance",
      icon: "💰",
      tasks: ["Invoice processing", "Financial report generation", "Compliance documentation", "Secure data handling"]
    }
  ];

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams",
      monthlyPrice: "NPR 2,999",
      yearlyPrice: "NPR 29,999",
      features: [
        "Up to 5 team members",
        "100 GB storage",
        "500 monthly conversions",
        "Basic API access",
        "Email support",
        "Standard security"
      ],
      recommended: false
    },
    {
      name: "Professional",
      description: "Most popular for growing businesses",
      monthlyPrice: "NPR 7,999",
      yearlyPrice: "NPR 79,999",
      features: [
        "Up to 25 team members",
        "500 GB storage",
        "Unlimited conversions",
        "Full API access",
        "Priority support",
        "Advanced security",
        "Custom branding",
        "Analytics dashboard"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      features: [
        "Unlimited team members",
        "Unlimited storage",
        "Unlimited conversions",
        "Dedicated API",
        "24/7 phone support",
        "Enterprise security",
        "SSO & SAML",
        "Custom integration",
        "Dedicated account manager",
        "SLA guarantee"
      ],
      recommended: false
    }
  ];

  const testimonials = [
    {
      company: "Himalayan Bank",
      person: "Ramesh Adhikari",
      role: "IT Director",
      text: "HAMROpdf has streamlined our document processing workflow. We process thousands of documents monthly with zero issues.",
      logo: "🏦"
    },
    {
      company: "Nepal Law Associates",
      person: "Anjali Shrestha",
      role: "Managing Partner",
      text: "The security features and digital signature capabilities are exactly what we needed for our legal practice.",
      logo: "⚖️"
    },
    {
      company: "Everest Properties",
      person: "Bikash Tamang",
      role: "Operations Manager",
      text: "Our property documentation process is now 10x faster. The bulk processing feature is a game-changer.",
      logo: "🏢"
    }
  ];

  const comparisonFeatures = [
    { feature: "Monthly conversions", starter: "500", pro: "Unlimited", enterprise: "Unlimited" },
    { feature: "Storage", starter: "100 GB", pro: "500 GB", enterprise: "Unlimited" },
    { feature: "Team members", starter: "5", pro: "25", enterprise: "Unlimited" },
    { feature: "API access", starter: "Basic", pro: "Full", enterprise: "Dedicated" },
    { feature: "Support", starter: "Email", pro: "Priority", enterprise: "24/7 Phone" },
    { feature: "Custom branding", starter: "✗", pro: "✓", enterprise: "✓" },
    { feature: "SSO/SAML", starter: "✗", pro: "✗", enterprise: "✓" },
    { feature: "SLA", starter: "✗", pro: "✗", enterprise: "✓" }
  ];

  // Theme classes
  const theme = {
    bg: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
      : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    nav: isDarkMode ? 'bg-slate-900/90' : 'bg-white/90',
    navBorder: isDarkMode ? 'border-white/10' : 'border-gray-200',
    card: isDarkMode ? 'bg-slate-800/50' : 'bg-white',
    cardBorder: isDarkMode ? 'border-white/10' : 'border-gray-200',
    cardHover: isDarkMode ? 'hover:border-white/30' : 'hover:border-blue-300',
    section: isDarkMode ? 'bg-white/5' : 'bg-gray-100/50',
    input: isDarkMode ? 'bg-slate-800' : 'bg-gray-100',
    inputBorder: isDarkMode ? 'border-white/10' : 'border-gray-300',
    inputHover: isDarkMode ? 'hover:border-white/30' : 'hover:border-blue-400',
    footer: isDarkMode ? 'bg-slate-900/50' : 'bg-gray-100',
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
    

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center space-x-2 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} px-4 py-2 rounded-full mb-6`}>
                <span className="text-blue-400 text-xl">🏆</span>
                <span className="text-sm">Trusted by 500+ Nepali Businesses</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Enterprise PDF Solutions for
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Modern Businesses</span>
              </h1>
              
              <p className={`text-lg ${theme.textSecondary} mb-8 leading-relaxed`}>
                Streamline your document workflow with powerful PDF tools designed for teams. 
                Process, manage, and secure your business documents at scale.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105">
                  Start Free Trial
                </button>
                <button className={`${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} backdrop-blur px-8 py-4 rounded-full font-semibold text-lg ${isDarkMode ? 'hover:bg-white/20' : 'hover:bg-gray-300'} transition-all border ${isDarkMode ? 'border-white/20' : 'border-gray-300'}`}>
                  Schedule Demo
                </button>
              </div>

              <div className={`flex items-center space-x-6 text-sm ${theme.textMuted}`}>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className={`bg-gradient-to-br ${isDarkMode ? 'from-blue-500/20 to-purple-500/20' : 'from-blue-100 to-purple-100'} rounded-3xl p-8 border ${theme.cardBorder} backdrop-blur transition-colors duration-300`}>
                <div className="space-y-4">
                  {[
                    { label: "Documents Processed", value: "10M+", icon: "📄" },
                    { label: "Active Businesses", value: "500+", icon: "🏢" },
                    { label: "Time Saved", value: "50,000+ hrs", icon: "⏱️" },
                    { label: "Team Members", value: "5,000+", icon: "👥" }
                  ].map((stat, index) => (
                    <div key={index} className={`${theme.card} backdrop-blur rounded-xl p-4 flex items-center space-x-4 ${isDarkMode ? 'hover:bg-slate-800/70' : 'hover:bg-gray-50'} transition-all border ${theme.cardBorder}`}>
                      <span className="text-3xl">{stat.icon}</span>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
                        <div className={`text-sm ${theme.textMuted}`}>{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Features */}
      <section id="features" className={`py-20 px-4 sm:px-6 lg:px-8 ${theme.section} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Enterprise-Grade Features
            </h2>
            <p className={`${theme.textMuted} text-lg`}>
              Everything your business needs to manage documents efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessFeatures.map((feature, index) => (
              <div 
                key={index}
                className={`group ${theme.card} backdrop-blur border ${theme.cardBorder} rounded-2xl p-6 ${theme.cardHover} transition-all duration-300 hover:transform hover:scale-105 cursor-pointer hover:shadow-2xl`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-all text-3xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={theme.textMuted}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases by Industry */}
      <section id="cases" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Solutions for Every Industry
            </h2>
            <p className={`${theme.textMuted} text-lg`}>
              Tailored PDF tools for your specific business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className={`${theme.card} backdrop-blur border ${theme.cardBorder} rounded-2xl p-6 ${theme.cardHover} transition-all duration-300`}>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-4xl">{useCase.icon}</span>
                  <h3 className="text-2xl font-bold">{useCase.industry}</h3>
                </div>
                <ul className="space-y-3">
                  {useCase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-center space-x-3">
                      <span className="text-blue-400">✓</span>
                      <span className={theme.textSecondary}>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 px-4 sm:px-6 lg:px-8 ${theme.section} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your Business Plan
            </h2>
            <p className={`${theme.textMuted} text-lg mb-6`}>
              Flexible pricing for businesses of all sizes
            </p>
            
            <div className={`inline-flex ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'} rounded-full p-1 border ${theme.cardBorder} transition-colors duration-300`}>
              <button 
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedPlan === 'monthly' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : theme.textMuted}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedPlan === 'yearly' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : theme.textMuted}`}
              >
                Yearly <span className="text-green-400 text-xs ml-1">(Save 17%)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative ${theme.card} backdrop-blur border rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${plan.recommended ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : `${theme.cardBorder} ${theme.cardHover}`}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`${theme.textMuted} text-sm mb-4`}>{plan.description}</p>
                  <div className="text-4xl font-bold mb-1">
                    {selectedPlan === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </div>
                  <p className={`${theme.textMuted} text-sm`}>
                    {plan.monthlyPrice !== 'Custom' && `per ${selectedPlan === 'monthly' ? 'month' : 'year'}`}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <span className="text-blue-400 mt-1">✓</span>
                      <span className={`${theme.textSecondary} text-sm`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-full font-semibold transition-all ${plan.recommended ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50' : `${isDarkMode ? 'bg-white/10 hover:bg-white/20 border border-white/20' : 'bg-gray-200 hover:bg-gray-300 border border-gray-300'}`}`}>
                  {plan.monthlyPrice === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className={`mt-16 ${theme.card} backdrop-blur border ${theme.cardBorder} rounded-2xl p-6 overflow-x-auto transition-colors duration-300`}>
            <h3 className="text-2xl font-bold mb-6 text-center">Feature Comparison</h3>
            <table className="w-full text-left">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <th className="pb-4 pr-4">Feature</th>
                  <th className="pb-4 px-4 text-center">Starter</th>
                  <th className="pb-4 px-4 text-center">Professional</th>
                  <th className="pb-4 pl-4 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr key={index} className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <td className={`py-3 pr-4 ${theme.textSecondary}`}>{item.feature}</td>
                    <td className={`py-3 px-4 text-center ${theme.textMuted}`}>{item.starter}</td>
                    <td className={`py-3 px-4 text-center ${theme.textMuted}`}>{item.pro}</td>
                    <td className={`py-3 pl-4 text-center ${theme.textMuted}`}>{item.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by Leading Businesses
            </h2>
            <p className={`${theme.textMuted} text-lg`}>
              See what our business clients say about us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`${theme.card} backdrop-blur border ${theme.cardBorder} rounded-2xl p-6 ${theme.cardHover} transition-all duration-300`}>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-4xl">{testimonial.logo}</span>
                  <div>
                    <h4 className="font-bold">{testimonial.company}</h4>
                    <p className={`text-sm ${theme.textMuted}`}>{testimonial.person}, {testimonial.role}</p>
                  </div>
                </div>
                <p className={`${theme.textSecondary} italic`}>"{testimonial.text}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${theme.section} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Ready to Transform Your Document Workflow?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join 500+ Nepali businesses already using HAMROpdf
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105">
                Start Free Trial
              </button>
              <button className="bg-white/20 backdrop-blur px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all border border-white/30 text-white">
                Schedule Demo
              </button>
            </div>
            <p className="mt-6 text-sm text-blue-100">
              ✓ 14-day free trial • ✓ No credit card required • ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}