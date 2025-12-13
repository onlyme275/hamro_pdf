// FILE: src/components/admin/sections/SettingsSection.jsx
// COMPLETE CODE - NO TRUNCATION

export default function SettingsSection() {
  return (
    <>
      <h1 className="text-3xl font-normal text-gray-900 mb-8">System Settings</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Name
                </label>
                <input 
                  type="text" 
                  defaultValue="HAMRO PDF Admin" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Email
                </label>
                <input 
                  type="email" 
                  defaultValue="support@hamropdf.com" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" 
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}