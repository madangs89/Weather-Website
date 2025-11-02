// src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Droplets, Wind, Thermometer, Star } from "lucide-react";
import { loadCityCurrent, removeFavorite } from "../redux/weatherSlice";
import { Link } from "react-router-dom";

const Favorites = () => {
  const dispatch = useDispatch();
  const { favorites, cities, unit } = useSelector((state) => state.weather);

  const [loading, setLoading] = useState(true);

  // Fetch all favorite city weather when page loads
  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length > 0) {
        for (let city of favorites) {
          await dispatch(loadCityCurrent(city));
        }
      }
      setLoading(false);
    };
    fetchFavorites();
  }, [dispatch, favorites]);

  const handleRemove = (city) => {
    dispatch(removeFavorite(city));
  };

  const renderCityCard = (city, data) => {
    if (!data) {
      return (
        <div
          key={city}
          className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      );
    }

    const current = data.current?.current || data.current;
    const temp = unit === "C" ? current.temp_c : current.temp_f;

    return (
      <div
        key={city}
        className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform"
      >
        <button
          onClick={() => handleRemove(city)}
          className="absolute top-4 right-4 text-yellow-400 hover:text-gray-400 transition"
        >
          <Star size={20} fill="currentColor" />
        </button>

        <div className="cursor-default">
          <div className="flex items-start gap-4">
            <img
              src={`https:${current.condition?.icon}`}
              alt={current.condition?.text}
              className="w-12 h-12"
            />
            <div>
              <Link
                to={`/city/${city}`}
                className="text-lg cursor-pointer font-bold"
              >
                {city}
              </Link>
              <p className="text-sm text-gray-500">{current.condition?.text}</p>
            </div>
          </div>

          <p className="text-6xl font-black mt-4">{Math.round(temp)}°</p>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t border-gray-200 pt-4">
            <div className="flex flex-col items-center gap-1">
              <Droplets size={18} className="text-gray-500" />
              <p className="text-sm font-semibold">{current.humidity}%</p>
              <p className="text-xs text-gray-500">Humidity</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Wind size={18} className="text-gray-500" />
              <p className="text-sm font-semibold">{current.wind_kph} km/h</p>
              <p className="text-xs text-gray-500">Wind</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Thermometer size={18} className="text-gray-500" />
              <p className="text-sm font-semibold">{current.feelslike_c}°</p>
              <p className="text-xs text-gray-500">Feels Like</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Your Favorite Cities
          </h1>
          <p className="text-gray-500">
            Manage and view real-time weather analytics for your saved cities.
          </p>
        </div>

        {/* No favorites message */}
        {favorites.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/744/744922.png"
              alt="No favorites"
              className="w-24 h-24 mb-6 opacity-70"
            />
            <h3 className="text-2xl font-semibold mb-2">
              You haven't added any favorites yet!
            </h3>
            <p className="text-gray-500">
              Go back to the Dashboard and star your favorite cities 🌤️
            </p>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <section>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((city) => renderCityCard(city, cities[city]))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Favorites;
