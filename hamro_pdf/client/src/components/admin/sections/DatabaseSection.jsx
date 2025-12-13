// FILE: src/components/admin/sections/DatabaseSection.jsx
// COMPLETE CODE - NO TRUNCATION

export default function DatabaseSection() {
  return (
    <>
      <h1 className="text-3xl font-normal text-gray-900 mb-8">Database Management</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium">Database Status</h3>
            <p className="text-sm text-gray-600">MySQL Database Server</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Connected
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Size</p>
            <p className="text-2xl font-bold text-gray-900">1.2 GB</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Tables</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Backup Now
          </button>
          <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Optimize
          </button>
        </div>
      </div>
    </>
  );
}