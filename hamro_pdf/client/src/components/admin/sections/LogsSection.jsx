// FILE: src/components/admin/sections/LogsSection.jsx
// COMPLETE CODE - NO TRUNCATION

export default function LogsSection() {
  return (
    <>
      <h1 className="text-3xl font-normal text-gray-900 mb-8">System Logs</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
            <option>All Logs</option>
            <option>Error Logs</option>
            <option>Access Logs</option>
            <option>Security Logs</option>
          </select>
        </div>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="mb-1">
              [2025-10-09 14:32:{String(i).padStart(2, "0")}] INFO: System operation completed successfully
            </div>
          ))}
        </div>
      </div>
    </>
  );
}