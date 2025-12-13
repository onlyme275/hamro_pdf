// components/UserProfileSummary.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectUser, selectIsAdmin } from "@/store/slices/userSlice";
import { User, Mail, Shield } from "lucide-react";

export default function UserProfileSummary() {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Profile Summary
        </h3>
        <p className="text-sm text-gray-600">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Profile Summary
      </h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <User size={18} className="text-orange-600 mt-1" />
          <div>
            <p className="text-xs text-gray-600">Name</p>
            <p className="text-sm font-medium text-gray-800">
              {user.name || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail size={18} className="text-orange-600 mt-1" />
          <div>
            <p className="text-xs text-gray-600">Email</p>
            <p className="text-sm font-medium text-gray-800">
              {user.email || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Shield size={18} className="text-orange-600 mt-1" />
          <div>
            <p className="text-xs text-gray-600">Role</p>
            <p className="text-sm font-medium text-gray-800">
              {isAdmin ? "Admin" : user.role || "User"}
            </p>
          </div>
        </div>

        {user.phone && (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center text-orange-600 mt-1">
              📱
            </div>
            <div>
              <p className="text-xs text-gray-600">Phone</p>
              <p className="text-sm font-medium text-gray-800">{user.phone}</p>
            </div>
          </div>
        )}

        {user.address && (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center text-orange-600 mt-1">
              📍
            </div>
            <div>
              <p className="text-xs text-gray-600">Address</p>
              <p className="text-sm font-medium text-gray-800">{user.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}