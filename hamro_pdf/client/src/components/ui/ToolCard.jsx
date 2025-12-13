import { Link } from "react-router-dom";

export function ToolCard({ icon, title, description, isNew = false, href = "#" }) {
  return (
    <Link href={href} className="block">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 h-full hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-shrink-0 text-gray-700 dark:text-gray-300">
              {icon}
            </div>
            {isNew && (
              <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-xs font-medium px-2 py-1 rounded">
                New!
              </span>
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}