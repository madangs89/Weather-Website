import React, { useState } from "react";
import { CloudSun, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUnit } from "../redux/weatherSlice";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.weather.unit);

  const handleUnitChange = (u) => {
    dispatch(setUnit(u));
  };

  // helper: for active link styling
  const linkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2">
          <CloudSun className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
            Weather Analytics
          </h1>
        </div>

        {/* Middle: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/favorites" className={linkClasses}>
            Favorites
          </NavLink>
          <NavLink to="/settings" className={linkClasses}>
            Settings
          </NavLink>
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
            className="w-10 h-10 rounded-full bg-cover bg-center border border-gray-200"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/a/AGNmyxY7N7b7s5oZp5iKCNxOHhFzRzvK6UvM6e0Y9FdW=s96-c')",
            }}
          ></div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="text-gray-700 w-6 h-6" />
            ) : (
              <Menu className="text-gray-700 w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <nav className="flex flex-col px-6 py-4 space-y-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Favorites
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
