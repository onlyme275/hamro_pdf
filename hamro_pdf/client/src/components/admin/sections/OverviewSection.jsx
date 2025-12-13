// FILE: src/components/admin/sections/OverviewSection.jsx
// COMPLETE CODE - NO TRUNCATION

import { Users, UserCheck, Crown, Shield, RefreshCw, Database, Upload } from "lucide-react";
import StatsCard from "../cards/StatsCard";

export default function OverviewSection({ users }) {
  const systemStats = [
    { label: "Total Users", value: users.length.toString(), icon: Users, status: "healthy" },
    { label: "Active Users", value: users.filter(u => u.active === 1).length.toString(), icon: UserCheck, status: "healthy" },
    { label: "Premium Users", value: users.filter(u => u.role === "premium").length.toString(), icon: Crown, status: "healthy" },
    { label: "Admin Users", value: users.filter(u => u.role === "admin").length.toString(), icon: Shield, status: "warning" }
  ];

  const systemHealth = [
    { label: "API Server", status: "Operational", uptime: "99.9%" },
    { label: "Database", status: "Operational", uptime: "99.8%" },
    { label: "Cache Server", status: "Operational", uptime: "99.8%" },
    { label: "CDN", status: "Operational", uptime: "100%" }
  ];

  const systemEvents = [
    { event: "Database backup completed", time: "2 hours ago", status: "success" },
    { event: "Security scan performed", time: "4 hours ago", status: "success" },
    { event: "High memory usage detected", time: "6 hours ago", status: "warning" },
    { event: "User registration spike", time: "8 hours ago", status: "info" },
    { event: "API rate limit reached", time: "10 hours ago", status: "warning" }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-normal text-gray-900">System Overview</h1>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">ROOT ACCESS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {systemStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-normal text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
            {systemHealth.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${service.status === "Operational" ? "bg-green-500" : "bg-yellow-500"}`}></div>
                  <span className="font-medium">{service.label}</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${service.status === "Operational" ? "text-green-600" : "text-yellow-600"}`}>{service.status}</p>
                  <p className="text-xs text-gray-500">Uptime: {service.uptime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-normal text-gray-900 mb-4">Recent System Events</h2>
          <div className="space-y-3">
            {systemEvents.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${item.status === "success" ? "bg-green-500" : item.status === "warning" ? "bg-yellow-500" : "bg-blue-500"}`}></div>
                  <span className="text-sm text-gray-700">{item.event}</span>
                </div>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-normal text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center">
            <RefreshCw className="w-6 h-6 text-gray-700 mb-2" />
            <span className="text-sm font-medium text-center">Restart Services</span>
          </button>
          <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center">
            <Database className="w-6 h-6 text-gray-700 mb-2" />
            <span className="text-sm font-medium text-center">Backup Database</span>
          </button>
          <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center">
            <Upload className="w-6 h-6 text-gray-700 mb-2" />
            <span className="text-sm font-medium text-center">Deploy Update</span>
          </button>
          <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center">
            <Shield className="w-6 h-6 text-gray-700 mb-2" />
            <span className="text-sm font-medium text-center">Security Scan</span>
          </button>
        </div>
      </div>
    </>
  );
}