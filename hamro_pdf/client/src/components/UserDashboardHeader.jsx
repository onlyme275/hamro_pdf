// components/UserDashboardHeader.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectUser, selectIsAdmin } from "@/store/slices/userSlice";
import { Bell } from "lucide-react";

export default function UserDashboardHeader() {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, {user?.name || "User"}!</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-600">
                {isAdmin ? "Admin" : user?.role || "User"}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}