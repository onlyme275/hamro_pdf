// FILE: src/components/admin/cards/StatsCard.jsx
// COMPLETE CODE - NO TRUNCATION

export default function StatsCard({ label, value, icon: Icon, status = "healthy" }) {
  const statusColors = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-gray-700" />
        <span className={`w-3 h-3 rounded-full ${statusColors[status]}`}></span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}