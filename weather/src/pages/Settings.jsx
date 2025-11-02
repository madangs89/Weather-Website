import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUnit, setRefreshInterval } from "../redux/weatherSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { unit, refreshInterval } = useSelector((state) => state.weather);

  const handleUnitChange = (e) => {
    dispatch(setUnit(e.target.value));
  };

  const handleIntervalChange = (e) => {
    dispatch(setRefreshInterval(Number(e.target.value)));
  };

  const clearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 border border-gray-200">
        {/* Header */}
        <h1 className="text-3xl font-extrabold mb-6">⚙️ Settings</h1>
        <p className="text-gray-500 mb-8">
          Manage your weather dashboard preferences below.
        </p>

        {/* Temperature Unit */}
        <div className="mb-8">
          <label className="block font-semibold mb-2">Temperature Unit</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="unit"
                value="C"
                checked={unit === "C"}
                onChange={handleUnitChange}
              />
              °C (Celsius)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="unit"
                value="F"
                checked={unit === "F"}
                onChange={handleUnitChange}
              />
              °F (Fahrenheit)
            </label>
          </div>
        </div>

        {/* Auto Refresh Interval */}
        <div className="mb-8">
          <label className="block font-semibold mb-2">
            Auto-Refresh Interval
          </label>
          <select
            value={refreshInterval}
            onChange={handleIntervalChange}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Controls how often the weather data refreshes automatically.
          </p>
        </div>

        {/* Clear Cache */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-3 text-red-600">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Clear all saved favorites and cached weather data.
          </p>
          <button
            onClick={clearCache}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
