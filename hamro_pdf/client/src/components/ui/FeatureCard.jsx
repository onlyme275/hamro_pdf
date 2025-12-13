// src/components/ui/FeatureCard.jsx
"use client";

export default function FeatureCard({ icon, title, description, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-lg dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-200">
      <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center mb-4 transition-colors duration-200`}>
        {typeof icon === 'string' ? (
          <span className="text-2xl">{icon}</span>
        ) : (
          icon
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}