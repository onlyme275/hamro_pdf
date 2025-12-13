// components/MyTools.jsx
import React from "react";
import { FileText, Download, Upload, Share2, Archive, Trash2 } from "lucide-react";

export default function MyTools() {
  const tools = [
    {
      id: 1,
      icon: <Upload size={24} />,
      title: "Upload Documents",
      description: "Upload and manage your PDF files",
      action: "Upload",
      color: "bg-blue-500",
    },
    {
      id: 2,
      icon: <Download size={24} />,
      title: "Download History",
      description: "View and download your processed files",
      action: "View",
      color: "bg-green-500",
    },
    {
      id: 3,
      icon: <FileText size={24} />,
      title: "My Documents",
      description: "Manage all your documents in one place",
      action: "Manage",
      color: "bg-purple-500",
    },
    {
      id: 4,
      icon: <Share2 size={24} />,
      title: "Shared Files",
      description: "Files shared with you by other users",
      action: "Access",
      color: "bg-orange-500",
    },
    {
      id: 5,
      icon: <Archive size={24} />,
      title: "Archive",
      description: "Access your archived documents",
      action: "Browse",
      color: "bg-yellow-500",
    },
    {
      id: 6,
      icon: <Trash2 size={24} />,
      title: "Trash",
      description: "Recover or permanently delete files",
      action: "Open",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Tools</h2>
        <p className="text-gray-600">
          Access and manage your PDF tools and documents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200"
          >
            <div
              className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
            >
              {tool.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {tool.title}
            </h3>
            <p className="text-gray-600 mb-4 text-sm">{tool.description}</p>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              {tool.action}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Document_2024.pdf
                </p>
                <p className="text-xs text-gray-500">Uploaded 2 hours ago</p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Completed
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Download size={20} className="text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Report_Final.pdf
                </p>
                <p className="text-xs text-gray-500">Downloaded 1 day ago</p>
              </div>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Success
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}