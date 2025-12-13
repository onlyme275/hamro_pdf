// FILE: src/components/admin/sections/SystemMonitorSection.jsx
// COMPLETE CODE - NO TRUNCATION

import { BarChart3 } from "lucide-react";

export default function SystemMonitorSection() {
  const metrics = [
    { label: "CPU Usage", value: "42%", color: "blue" },
    { label: "Memory Usage", value: "68%", color: "green" },
    { label: "Disk Usage", value: "82%", color: "yellow" },
    { label: "Network", value: "35%", color: "purple" }
  ];

  return (
    <>
      <h1 className="text-3xl font-normal text-gray-900 mb-8">System Monitor</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4">Server Performance</h3>
          <div className="space-y-4">
            {metrics.map((metric, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{metric.label}</span>
                  <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${metric.color}-600 h-2 rounded-full transition-all`} 
                    style={{ width: metric.value }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4">Network Traffic</h3>
          <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Network traffic chart</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}