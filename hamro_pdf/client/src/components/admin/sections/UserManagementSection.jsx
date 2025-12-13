// FILE: src/components/admin/sections/UserManagementSection.jsx
// 100% COMPLETE CODE - NO TRUNCATION - FULL FILE

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { UserPlus, Users, UserCheck, Crown, Shield } from "lucide-react";
import StatsCard from "../cards/StatsCard";
import SearchAndFilters from "../common/SearchandFilters";
import UserTable from "../tables/UserTable";
import Pagination from "../common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";
import AddUserModal from "../modals/AddUserModal";
import EditUserModal from "../modals/EditUserModal";
import DeleteUserModal from "../modals/DeleteUserModal";
import ResetPasswordModal from "../modals/ResetPasswordModal";
import { addUser, updateUserProfile, deleteUser, resetPassword, getAllUsers } from "../../../store/slices/userSlice";

export default function UserManagementSection({ users, loading, currentUser }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [addFormData, setAddFormData] = useState({
    name: "", 
    email: "", 
    password: "", 
    role: "user", 
    phone: "", 
    address: ""
  });

  const [editFormData, setEditFormData] = useState({
    name: "", 
    email: "", 
    role: "", 
    phone: "", 
    address: "", 
    active: 1
  });

  const [newPassword, setNewPassword] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "active" && user.active === 1) ||
                         (statusFilter === "inactive" && user.active === 0);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const handleAddUser = async () => {
    try {
      await dispatch(addUser(addFormData)).unwrap();
      setShowAddModal(false);
      setAddFormData({ 
        name: "", 
        email: "", 
        password: "", 
        role: "user", 
        phone: "", 
        address: "" 
      });
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      address: user.address || "",
      active: user.active
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await dispatch(updateUserProfile({
        userId: selectedUser.id,
        updateData: editFormData
      })).unwrap();
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleResetPassword = async () => {
    try {
      await dispatch(resetPassword({
        userId: selectedUser.id,
        newPassword: newPassword
      })).unwrap();
      setShowPasswordModal(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to reset password:", err);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await dispatch(updateUserProfile({
        userId: user.id,
        updateData: { active: user.active === 1 ? 0 : 1 }
      })).unwrap();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      await dispatch(updateUserProfile({
        userId: user.id,
        updateData: { role: newRole }
      })).unwrap();
    } catch (err) {
      console.error("Failed to change role:", err);
    }
  };

  const systemStats = [
    { 
      label: "Total Users", 
      value: users.length.toString(), 
      icon: Users, 
      status: "healthy" 
    },
    { 
      label: "Active Users", 
      value: users.filter(u => u.active === 1).length.toString(), 
      icon: UserCheck, 
      status: "healthy" 
    },
    { 
      label: "Premium Users", 
      value: users.filter(u => u.role === "premium").length.toString(), 
      icon: Crown, 
      status: "healthy" 
    },
    { 
      label: "Admin Users", 
      value: users.filter(u => u.role === "admin").length.toString(), 
      icon: Shield, 
      status: "warning" 
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-normal text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all users in your system</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {systemStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onRefresh={() => dispatch(getAllUsers())}
        />

        {loading ? (
          <LoadingSpinner message="Loading users..." />
        ) : (
          <>
            <UserTable
              users={currentUsers}
              currentUser={currentUser}
              onEdit={handleEditUser}
              onDelete={(user) => { setSelectedUser(user); setShowDeleteModal(true); }}
              onResetPassword={(user) => { setSelectedUser(user); setShowPasswordModal(true); }}
              onToggleStatus={handleToggleStatus}
              onChangeRole={handleChangeRole}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              indexOfFirstItem={indexOfFirstUser}
              indexOfLastItem={indexOfLastUser}
              totalItems={filteredUsers.length}
            />
          </>
        )}
      </div>

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
        formData={addFormData}
        setFormData={setAddFormData}
        loading={loading}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateUser}
        user={selectedUser}
        formData={editFormData}
        setFormData={setEditFormData}
        loading={loading}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        user={selectedUser}
        loading={loading}
      />

      <ResetPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleResetPassword}
        user={selectedUser}
        password={newPassword}
        setPassword={setNewPassword}
        loading={loading}
      />
    </>
  );
}