import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFire,
  FaMusic,
  FaFilm,
  FaGamepad,
  FaNewspaper,
  FaLightbulb,
} from "react-icons/fa";

const categories = [
  { name: "Home", icon: <FaHome />, path: "/" },
  { name: "Trending", icon: <FaFire />, path: "/?category=trending" },
  { name: "Music", icon: <FaMusic />, path: "/?category=music" },
  { name: "Movies", icon: <FaFilm />, path: "/?category=movies" },
  { name: "Gaming", icon: <FaGamepad />, path: "/?category=gaming" },
  { name: "News", icon: <FaNewspaper />, path: "/?category=news" },
  { name: "Learning", icon: <FaLightbulb />, path: "/?category=learning" },
];

const Sidebar = () => {
  const location = useLocation();

  // Check if we're on the video page to hide sidebar on mobile
  const isVideoPage = location.pathname.includes("/video/");

  // Determine if category is active
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    if (path !== "/" && location.search.includes(path.split("?")[1])) {
      return true;
    }
    return false;
  };

  return (
    <aside
      className={`bg-white w-64 fixed left-0 top-16 bottom-0 overflow-y-auto transition-all z-10 shadow-md 
                      ${isVideoPage ? "hidden md:block" : "hidden md:block"}`}
    >
      <div className="py-4">
        <ul>
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                to={category.path}
                className={`flex items-center px-6 py-3 hover:bg-gray-100 transition-colors
                          ${
                            isActive(category.path)
                              ? "text-red-600 font-medium bg-gray-100"
                              : "text-gray-700"
                          }`}
              >
                <span className="mr-4">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
