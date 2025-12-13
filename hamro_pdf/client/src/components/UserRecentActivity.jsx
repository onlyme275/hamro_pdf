// components/UserRecentActivity.jsx
import React from "react";
import { Activity } from "lucide-react";

export default function UserRecentActivity({ activities }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
      </div>
      <div className="space-y-3">
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex justify-between items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm text-gray-700">{activity.message}</p>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                {activity.time}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No recent activity</p>
        )}
      </div>
    </div>
  );
}