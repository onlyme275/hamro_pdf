// FILE: src/components/admin/sections/SecuritySection.jsx
// COMPLETE CODE - NO TRUNCATION

import { AlertCircle } from "lucide-react";

export default function SecuritySection() {
  const securityEvents = [
    { type: "Failed Login", time: "2 minutes ago", ip: "192.168.1.1" },
    { type: "Permission Changed", time: "1 hour ago", ip: "10.0.0.1" },
    { type: "New Admin Added", time: "3 hours ago", ip: "172.16.0.1" },
    { type: "Password Reset", time: "5 hours ago", ip: "192.168.2.1" }
  ];

  const securitySettings = [
    { label: "Two-Factor Authentication", checked: true },
    { label: "IP Whitelisting", checked: false },
    { label: "Session Timeout (30 min)", checked: true },
    { label: "Audit Logging", checked: true }
  ];

  return (
    <>
      <h1 className="text-3xl font-normal text-gray-900 mb-8">Security Center</h1>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h3 className="font-bold text-red-800">Security Alert</h3>
            <p className="text-red-600">
              3 failed login attempts detected from suspicious IP addresses
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4">Security Events</h3>
          <div className="space-y-3">
            {securityEvents.map((event, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between">
                  <span className="font-medium text-sm">{event.type}</span>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">IP: {event.ip}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4">Security Settings</h3>
          <div className="space-y-4">
            {securitySettings.map((setting, i) => (
              <label key={i} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">{setting.label}</span>
                <input 
                  type="checkbox" 
                  defaultChecked={setting.checked} 
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500" 
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}