import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/ui/Sidebar";
import {
  Crown,
  Star,
  Zap,
  Award,
  Target,
  TrendingUp,
  DollarSign,
  FileText,
  BarChart3,
} from "lucide-react";

export default function PremiumDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const userData = {
    firstName: "Premium",
    lastName: "User",
    email: "premium@example.com",
    country: "United States",
    timezone: "EST",
    type: "premium",
  };

  const premiumStats = [
    {
      label: "Unlimited Conversions",
      value: "∞",
      icon: FileText,
      color: "text-yellow-500",
    },
    {
      label: "Priority Support",
      value: "24/7",
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      label: "Premium Tools",
      value: "50+",
      icon: Award,
      color: "text-yellow-500",
    },
    {
      label: "API Calls",
      value: "10M",
      icon: Target,
      color: "text-yellow-500",
    },
  ];

  const premiumFeatures = [
    "Unlimited conversions",
    "Priority support",
    "Advanced tools",
    "No ads",
    "API access",
    "Custom workflows",
    "Team collaboration",
    "Cloud storage",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          userType="premium"
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userData={userData}
        />

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {activeSection === "dashboard" && (
              <>
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-normal text-gray-900">
                      Premium Dashboard
                    </h1>
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-sm font-bold rounded-full flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      PREMIUM
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {premiumStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <IconComponent className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {stat.value}
                        </h3>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Premium Features */}
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Your Premium Features
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {premiumFeatures.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Star
                          className="w-4 h-4 text-yellow-600"
                          fill="currentColor"
                        />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-normal text-gray-900 mb-4">
                      AI-Powered Insights
                    </h2>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            Optimization Score
                          </span>
                          <span className="text-yellow-600 font-bold">92%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Monthly Savings</span>
                          <span className="text-green-600 font-bold">$450</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Processing Speed</span>
                          <span className="text-blue-600 font-bold">
                            3x Faster
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-normal text-gray-900 mb-4">
                      Recent Activity
                    </h2>
                    <div className="space-y-3">
                      {[
                        "PDF merged - 10 files",
                        "Document compressed - 75% reduction",
                        "OCR completed - 50 pages",
                        "Batch conversion - 100 files",
                      ].map((activity, i) => (
                        <div
                          key={i}
                          className="flex items-center p-3 hover:bg-gray-50 rounded"
                        >
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity}</p>
                            <p className="text-xs text-gray-500">
                              {i + 1} hour ago
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "analytics" && (
              <div>
                <h1 className="text-3xl font-normal text-gray-900 mb-8">
                  Advanced Analytics
                </h1>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-64 flex items-center justify-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded">
                    <BarChart3 className="w-16 h-16 text-yellow-500" />
                    <p className="ml-4 text-gray-600">
                      Premium analytics charts
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "tools" && (
              <div>
                <h1 className="text-3xl font-normal text-gray-900 mb-8">
                  Premium Tools
                </h1>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    "OCR Scanner",
                    "Batch Processing",
                    "API Access",
                    "Custom Workflows",
                    "Advanced Editor",
                    "Cloud Sync",
                  ].map((tool, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      <Zap className="w-8 h-8 text-yellow-500 mb-4" />
                      <h3 className="font-semibold mb-2">{tool}</h3>
                      <p className="text-sm text-gray-600">
                        Premium feature exclusively for members
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
