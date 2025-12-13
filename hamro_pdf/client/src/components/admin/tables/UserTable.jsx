// FILE: src/components/admin/tables/UserTable.jsx
// COMPLETE CODE - NO TRUNCATION

import { UserX } from "lucide-react";
import UserTableRow from "./UserTableRow";

export default function UserTable({
  users,
  currentUser,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
  onChangeRole
}) {
  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <UserX className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No users found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Auth
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              currentUser={currentUser}
              onEdit={onEdit}
              onDelete={onDelete}
              onResetPassword={onResetPassword}
              onToggleStatus={onToggleStatus}
              onChangeRole={onChangeRole}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}