import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaVideo, FaUserCircle, FaBars } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 mr-2"
          onClick={toggleMobileMenu}
        >
          <FaBars size={20} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-red-600 font-bold text-xl mr-1">Media</span>
          <span className="bg-red-600 text-white font-bold px-1 rounded">
            Tube
          </span>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-grow mx-8 max-w-xl relative"
        >
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-100 hover:bg-gray-200 px-5 rounded-r-full border border-l-0 border-gray-300"
          >
            <FaSearch className="text-gray-600" />
          </button>
        </form>

        {/* User Section */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              {/* Upload Video Button */}
              <Link
                to="/upload"
                className="hidden md:flex items-center mr-6 text-blue-600 hover:text-blue-800"
              >
                <FaVideo className="mr-1" />
                <span>Upload</span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center focus:outline-none"
                >
                  <FaUserCircle size={32} className="text-gray-700" />
                  <span className="ml-2 hidden md:block">{user?.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    {user?.role === "creator" && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Creator Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search (shows when mobile menu is open) */}
      {showMobileMenu && (
        <div className="md:hidden px-4 py-3 bg-gray-50">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-gray-100 hover:bg-gray-200 px-5 rounded-r-full border border-l-0 border-gray-300"
            >
              <FaSearch className="text-gray-600" />
            </button>
          </form>

          {isAuthenticated && (
            <Link
              to="/upload"
              className="flex items-center mt-3 text-blue-600 hover:text-blue-800"
            >
              <FaVideo className="mr-1" />
              <span>Upload Video</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
