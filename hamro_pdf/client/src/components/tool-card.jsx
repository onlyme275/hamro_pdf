import { Link } from "react-router-dom";

export function ToolCard({ icon, title, description, isNew = false }) {
  return (
    <Link href="#" className="block">
      <div className="bg-white border rounded-lg p-6 h-full hover:shadow-md transition-shadow">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-shrink-0">{icon}</div>
            {isNew && (
              <span className="inline-block bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded">
                New!
              </span>
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 flex-grow">{description}</p>
        </div>
      </div>
    </Link>
  );
}
