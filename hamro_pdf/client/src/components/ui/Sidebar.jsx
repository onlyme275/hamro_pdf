import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Users,
  Settings,
  FileText,
  ChevronDown,
  Workflow,
  Clock,
  Eye,
  Send,
  Inbox,
  Edit3,
  File,
  Building,
  Package,
  Receipt,
  LogOut,
  Home,
  BarChart3,
  Zap,
  Target,
  Activity,
  Database,
  Shield,
  Crown,
  Sparkles,
  Image,
} from "lucide-react";

export default function Sidebar({
  userType,
  activeSection,
  setActiveSection,
  userData,
}) {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    settings: false,
    signatures: false,
    billing: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Normal User Sidebar
  if (userType === "user") {
    return (
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-4">
          {/* User Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Registered
                </div>
                <div className="text-sm text-gray-600">
                  {userData.firstName} {userData.lastName}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection("profile")}
              className="w-full flex items-center justify-between text-gray-700 font-medium mb-2"
            >
              <span className="text-sm">Profile</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedSections.profile ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.profile && (
              <div className="ml-2 space-y-1">
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                    activeSection === "profile"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>My account</span>
                </button>
                <button
                  onClick={() => setActiveSection("security")}
                  className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                    activeSection === "security"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Security</span>
                </button>
                <button
                  onClick={() => setActiveSection("team")}
                  className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                    activeSection === "team"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Team</span>
                </button>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection("settings")}
              className="w-full flex items-center justify-between text-gray-700 font-medium mb-2"
            >
              <span className="text-sm">Settings</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedSections.settings ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.settings && (
              <div className="ml-2 space-y-1">
                <button
                  onClick={() => setActiveSection("workflows")}
                  className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                    activeSection === "workflows"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Workflow className="w-4 h-4" />
                  <span>Workflows</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <Clock className="w-4 h-4" />
                  <span>Last tasks</span>
                </button>
              </div>
            )}
          </div>

          {/* Signatures Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection("signatures")}
              className="w-full flex items-center justify-between text-gray-700 font-medium mb-2"
            >
              <span className="text-sm">Signatures</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedSections.signatures ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.signatures && (
              <div className="ml-2 space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <Send className="w-4 h-4" />
                  <span>Sent</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <Inbox className="w-4 h-4" />
                  <span>Inbox</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <Edit3 className="w-4 h-4" />
                  <span>Signed</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <File className="w-4 h-4" />
                  <span>Templates</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <Users className="w-4 h-4" />
                  <span>Contacts</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            )}
          </div>

          {/* Billing Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection("billing")}
              className="w-full flex items-center justify-between text-gray-700 font-medium mb-2"
            >
              <span className="text-sm">Billing</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedSections.billing ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.billing && (
              <div className="ml-2 space-y-1">
                <button
                  onClick={() => setActiveSection("billing")}
                  className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                    activeSection === "billing"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Plans & Packages</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <Building className="w-4 h-4" />
                  <span>Business details</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 text-gray-600 hover:bg-gray-50">
                  <Receipt className="w-4 h-4" />
                  <span>Invoices</span>
                </button>
              </div>
            )}
          </div>

          {/* Back to Dashboard Selection */}
          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to="/dashboard"
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Switch Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Premium User Sidebar
  if (userType === "premium") {
    return (
      <div className="w-64 bg-gradient-to-b from-yellow-50 to-white border-r border-gray-200 min-h-screen">
        <div className="p-4">
          <div className="mb-6 p-3 bg-yellow-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="w-6 h-6 text-yellow-600" />
              <span className="font-bold text-gray-900">Premium Member</span>
            </div>
            <p className="text-xs text-gray-600">All features unlocked</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "dashboard"
                  ? "bg-yellow-100 text-gray-900"
                  : "text-gray-600 hover:bg-yellow-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveSection("analytics")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "analytics"
                  ? "bg-yellow-100 text-gray-900"
                  : "text-gray-600 hover:bg-yellow-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Advanced Analytics</span>
            </button>
            <button
              onClick={() => setActiveSection("tools")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "tools"
                  ? "bg-yellow-100 text-gray-900"
                  : "text-gray-600 hover:bg-yellow-50"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Premium Tools</span>
            </button>
            <button
              onClick={() => setActiveSection("campaigns")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "campaigns"
                  ? "bg-yellow-100 text-gray-900"
                  : "text-gray-600 hover:bg-yellow-50"
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Campaigns</span>
            </button>
            <button
              onClick={() => setActiveSection("reports")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "reports"
                  ? "bg-yellow-100 text-gray-900"
                  : "text-gray-600 hover:bg-yellow-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Custom Reports</span>
            </button>
            <button
              onClick={() => setActiveSection("settings")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "settings"
                  ? "bg-yellow-100 text-gray-900"
                  : "text-gray-600 hover:bg-yellow-50"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to="/dashboard"
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-yellow-50 rounded transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Switch Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin Sidebar
  if (userType === "admin") {
    return (
      <div className="w-64 bg-gray-900 text-white min-h-screen">
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-red-500" />
              <span className="font-bold">Admin Panel</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveSection("overview")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "overview"
                  ? "bg-red-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>System Overview</span>
            </button>
            <button
              onClick={() => setActiveSection("users")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "users" ? "bg-red-600" : "hover:bg-gray-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </button>
            <button
              onClick={() => setActiveSection("system")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "system" ? "bg-red-600" : "hover:bg-gray-800"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>System Monitor</span>
            </button>
            <button
              onClick={() => setActiveSection("database")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "database"
                  ? "bg-red-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Database</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("splash");
                navigate("/dashboard/admin/splash");
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "splash" ? "bg-red-600" : "hover:bg-gray-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Splash Screen</span>
            </button>

            {/* NEW: Ads Management */}
            <button
              onClick={() => {
                setActiveSection("ads");
                navigate("/dashboard/admin/ads");
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "ads" ? "bg-red-600" : "hover:bg-gray-800"
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Ads Management</span>
            </button>

            <button
              onClick={() => setActiveSection("security")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "security"
                  ? "bg-red-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveSection("logs")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "logs" ? "bg-red-600" : "hover:bg-gray-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>System Logs</span>
            </button>
            <button
              onClick={() => setActiveSection("settings")}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                activeSection === "settings"
                  ? "bg-red-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to="/dashboard"
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-800 rounded transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Switch Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
