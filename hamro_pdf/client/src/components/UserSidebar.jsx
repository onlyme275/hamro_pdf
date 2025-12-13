// components/UserSidebar.jsx
import React from "react";
import { FileText, PenTool, User, Settings } from "lucide-react";

export default function UserSidebar({ activeView, setActiveView }) {
  const menuItems = [
    { icon: <FileText size={18} />, label: "My Files", view: "myfiles" },
    { icon: <PenTool size={18} />, label: "My Signatures", view: "mysignatures" },
    { icon: <User size={18} />, label: "Profile", view: "profile" },
    { icon: <Settings size={18} />, label: "Settings", view: "settings" },
  ];

  return (
    <aside className="w-64 bg-orange-600 text-white flex flex-col p-6 space-y-4">
      <h2 className="text-2xl font-bold tracking-wide mb-6">User Panel</h2>
      <nav className="space-y-3">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveView(item.view)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
              activeView === item.view
                ? "bg-orange-700 font-semibold"
                : "hover:bg-orange-700"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}