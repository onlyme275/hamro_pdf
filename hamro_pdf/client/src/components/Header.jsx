import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
  logout,
} from "../store/slices/userSlice";
import { tools } from "../data/toolsData";


const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const navigation = [
    { name: "Compress PDF", to: "/compress" },
    { name: "Merge PDF", to: "/merge" },
    { name: "Convert PDF", to: "/convert" },
    { name: "Split PDF", to: "/split" },
    { name: "Pricing", to: "/pricing" },
    { name: "DateConverter", to: "/dateconverter"},
    { name: "Contact", to: "/contact" },
  ];

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (!storedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredSearchResults = searchQuery.trim()
    ? tools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  // Handle search result click
  const handleSearchResultClick = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    navigate("/login");
    setIsUserMenuOpen(false);
  };

  // Determine user role
  const getUserRole = () => {
    if (!isAuthenticated || !user) return null;
    if (user.role === "admin") return "admin";
    if (
      user.subscription === "premium" ||
      user.isPremium ||
      user.plan === "premium" ||
      user.role === "premium"
    )
      return "premium";
    return "user";
  };

  const userRole = getUserRole();

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (userRole === "admin") return "/dashboard/admin";
    if (userRole === "premium") return "/dashboard/premium";
    return "/dashboard";
  };

  const getUserMenuItems = () => {
    if (!isAuthenticated) {
      return [
        { name: "Sign In", to: "/login", icon: "login" },
        { name: "Sign Up", to: "/register", icon: "register" },
      ];
    }

    const baseMenuItems = [
      {
        name: "Account Settings",
        to: "/account-settings",
        icon: "settings",
      },
      { name: "Team", to: "/team", icon: "team" },
      { name: "Signatures", to: "/signatures", icon: "signatures" },
      { name: "Workflows", to: "/workflows", icon: "workflows" },
    ];

    // Add role-specific dashboard link
    if (userRole === "admin") {
      baseMenuItems.unshift({
        name: "Admin Dashboard",
        to: "/dashboard/admin",
        icon: "dashboard",
      });
    } else if (userRole === "premium") {
      baseMenuItems.unshift({
        name: "Premium Dashboard",
        to: "/dashboard/premium",
        icon: "dashboard",
      });
    } else {
      baseMenuItems.unshift({
        name: "Dashboard",
        to: "/dashboard",
        icon: "dashboard",
      });
    }

    // Add upgrade option for non-premium users
    if (userRole !== "premium" && userRole !== "admin") {
      baseMenuItems.push({
        name: "Upgrade to Premium",
        to: "/upgrade",
        icon: "upgrade",
        special: true,
      });
    }

    baseMenuItems.push({
      name: "Sign Out",
      action: handleLogout,
      icon: "logout",
    });

    return baseMenuItems;
  };

  const getIcon = (iconType) => {
    const iconClass = "w-4 h-4 mr-3";

    switch (iconType) {
      case "login":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
        );
      case "register":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        );
      case "settings":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      case "team":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      case "signatures":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        );
      case "workflows":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m9-11h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-5-9l3 3m0 0l-3 3m3-3H9"
            />
          </svg>
        );
      case "dashboard":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "upgrade":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case "logout":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getUserInitial = () => {
    if (!user) return "U";
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user.name) return user.name;
    return "User";
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Hamburger Menu & Navigation */}
          <div className="flex items-center flex-1">
            {/* Hamburger Menu Button */}
            <button
              className="inline-flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 ml-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center justify-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-red-600 dark:text-white">
                HAMRO
                <span className="text-blue-600 dark:text-red-400">pdf</span>
              </span>
            </Link>
          </div>

          {/* Right Section - Search & User */}
          <div className="flex items-center justify-end flex-1 space-x-4">
            {/* Search Bar */}
            <div
              className="hidden md:block relative max-w-xs w-full"
              ref={searchRef}
            >
              <input
                type="text"
                placeholder="Type to find a tool"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="w-full pl-4 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
              <button className="absolute right-0 top-0 h-full px-3 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Search Results Dropdown */}
              {showSearchResults && filteredSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">
                      Found {filteredSearchResults.length} tool
                      {filteredSearchResults.length !== 1 ? "s" : ""}
                    </div>
                    {filteredSearchResults.map((tool) => (
                      <Link
                        key={tool.id}
                        to={tool.href}
                        onClick={handleSearchResultClick}
                        className="flex items-center px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center mr-3 group-hover:from-blue-100 group-hover:to-red-100 dark:group-hover:from-gray-600 dark:group-hover:to-gray-500">
                          <span className="text-xl">{tool.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {tool.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {tool.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Message */}
              {showSearchResults &&
                searchQuery &&
                filteredSearchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                      No tools found for "{searchQuery}"
                    </div>
                  </div>
                )}
            </div>

            {/* Mobile Search Button */}
            <button className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center transition-colors duration-200"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User menu"
              >
                {isAuthenticated && user ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getUserInitial()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {userRole || "user"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
                <svg
                  className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transition-colors duration-200">
                  {isAuthenticated && user && (
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {getUserInitial()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {getUserDisplayName()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 capitalize font-medium">
                            {userRole || "user"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {getUserMenuItems().map((item, index) => (
                    <div key={index}>
                      {item.to ? (
                        <Link
                          to={item.to}
                          className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                            item.special
                              ? "text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                              : ""
                          }`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {getIcon(item.icon)}
                          {item.name}
                          {item.special && (
                            <span className="ml-auto text-yellow-500 dark:text-yellow-400">
                              ⭐
                            </span>
                          )}
                        </Link>
                      ) : (
                        <button
                          onClick={item.action}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          {getIcon(item.icon)}
                          {item.name}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="py-3 space-y-1 bg-white dark:bg-gray-900">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Search Bar */}
              <div className="px-4 py-2 md:hidden">
                <input
                  type="text"
                  placeholder="Search for a tool"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
