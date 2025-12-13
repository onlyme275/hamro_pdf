// components/UserStatsCards.jsx
import React from "react";

export default function UserStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-600"
        >
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            {stat.title}
          </h3>
          <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}