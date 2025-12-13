// pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserSidebar from "@/components/UserSidebar";
import UserDashboardHeader from "@/components/UserDashboardHeader";
import Profile from "@/components/Profile";
import MyFiles from "@/components/MyFiles";
import MySignatures from "@/components/MySignatures";
import Settings from "@/components/Settings";
import { selectUser, getUserProfile } from "@/store/slices/userSlice";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [activeView, setActiveView] = useState("myfiles");

  // Fetch user profile if needed
  useEffect(() => {
    if (user?.id) {
      dispatch(getUserProfile(user.id));
    }
  }, [dispatch, user?.id]);

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return <Profile />;
      case "myfiles":
        return <MyFiles />;
      case "mysignatures":
        return <MySignatures />;
      case "settings":
        return <Settings />;
      default:
        return <MyFiles />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <UserSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col">
        <UserDashboardHeader />
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
}