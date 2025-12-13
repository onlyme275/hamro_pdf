// FILE: src/components/admin/tables/UserTableRow.jsx
// COMPLETE CODE - NO TRUNCATION

import { Edit2, Lock, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function UserTableRow({
  user,
  currentUser,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
  onChangeRole
}) {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin": 
        return "bg-red-100 text-red-800";
      case "premium": 
        return "bg-yellow-100 text-yellow-800";
      default: 
        return "bg-blue-100 text-blue-800";
    }
  };

  const isCurrentUser = user.id === currentUser?.id;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.phone || "No phone"}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {user.email}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={user.role}
          onChange={(e) => onChangeRole(user, e.target.value)}
          disabled={isCurrentUser}
          className={`px-3 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(user.role)} ${
            isCurrentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"
          }`}
        >
          <option value="admin">Admin</option>
          <option value="premium">Premium</option>
          <option value="user">Normal</option>
        </select>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(user)}
          disabled={isCurrentUser}
          className={`px-3 py-1 text-xs rounded-full font-medium flex items-center space-x-1 ${
            user.active === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          } ${isCurrentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"}`}
        >
          {user.active === 1 ? (
            <>
              <CheckCircle className="w-3 h-3" />
              <span>Active</span>
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" />
              <span>Inactive</span>
            </>
          )}
        </button>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
          {user.auth_provider || user.authProvider || "local"}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
            title="Edit User"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onResetPassword(user)}
            className="text-yellow-600 hover:text-yellow-700 p-1 hover:bg-yellow-50 rounded transition-colors"
            title="Reset Password"
          >
            <Lock className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(user)}
            disabled={isCurrentUser}
            className={`text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors ${
              isCurrentUser ? "cursor-not-allowed opacity-50" : ""
            }`}
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}