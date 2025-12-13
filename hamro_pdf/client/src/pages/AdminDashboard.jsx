// src/pages/AdminDashboardPage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/ui/Sidebar";
import OverviewSection from "../components/admin/sections/OverviewSection";
import UserManagementSection from "../components/admin/sections/UserManagementSection";
import SystemMonitorSection from "../components/admin/sections/SystemMonitorSection";
import DatabaseSection from "../components/admin/sections/DatabaseSection";
import SecuritySection from "../components/admin/sections/SecuritySection";
import LogsSection from "../components/admin/sections/LogsSection";
import SettingsSection from "../components/admin/sections/SettingsSection";
import AdsSection from "../components/admin/sections/AdsSection";
import { getAllUsers, clearNotifications } from "../store/slices/userSlice";


export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { users, loading, error, message } = useSelector((state) => state.user);
  const currentUser = useSelector((state) => state.user.user);
  const [activeSection, setActiveSection] = useState("users");

  useEffect(() => {
    if (activeSection === "users") {
      dispatch(getAllUsers());
    }
  }, [dispatch, activeSection]);

  useEffect(() => {
    if (message) {
      alert(message);
      dispatch(clearNotifications());
      dispatch(getAllUsers());
    }
    if (error) {
      alert(error);
      dispatch(clearNotifications());
    }
  }, [message, error, dispatch]);

  const userData = {
    firstName: currentUser?.name?.split(" ")[0] || "Admin",
    lastName: currentUser?.name?.split(" ")[1] || "User",
    email: currentUser?.email || "admin@example.com",
    country: "United States",
    timezone: "UTC",
    type: "admin"
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection users={users} />;
      case "users":
        return <UserManagementSection users={users} loading={loading} currentUser={currentUser} />;
      case "system":
        return <SystemMonitorSection />;
      case "database":
        return <DatabaseSection />;
      case "ads":
        return <AdsSection />;
      case "security":
        return <SecuritySection />;
      case "logs":
        return <LogsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <UserManagementSection users={users} loading={loading} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          userType="admin"
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userData={userData}
        />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}