// src/components/Navbar.jsx
import React, { useState } from "react";
import { CloudSun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUnit } from "../redux/weatherSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.weather.unit);

  const handleUnitChange = (u) => {
    dispatch(setUnit(u));
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2">
          <CloudSun className="text-blue-500 text-3xl" />
          <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
            Weather Analytics
          </h1>
        </div>

        {/* Middle: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-blue-600">
            Dashboard
          </Link>
          <Link
            to="/favorites"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Favorites
          </Link>
          <Link
            to="/settings"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Settings
          </Link>
        </nav>

        {/* Right: Temp Toggle + Profile + Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Temperature toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => handleUnitChange("C")}
              className={`px-3 py-1.5 text-sm font-semibold ${
                unit === "C"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              °C
            </button>
            <button
              onClick={() => handleUnitChange("F")}
              className={`px-3 py-1.5 text-sm font-semibold ${
                unit === "F"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              °F
            </button>
          </div>

          {/* Profile */}
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/a/AGNmyxY7N7b7s5oZp5iKCNxOHhFzRzvK6UvM6e0Y9FdW=s96-c')",
            }}
          ></div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center"
          >
            <span className="material-symbols-outlined text-gray-700 text-3xl">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col px-6 py-4 space-y-3">
            <Link to="/" className="text-sm font-medium text-blue-600">
              Dashboard
            </Link>
            <Link
              to="/favorites"
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              Favorites
            </Link>
            <Link
              to="settings"
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              Settings
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
