import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Star, Droplets, Wind, Thermometer } from "lucide-react";
import {
  loadCityCurrent,
  addFavorite,
  removeFavorite,
  setCityData,
} from "../redux/weatherSlice";
import { searchAutocomplete, fetchCurrent } from "../utils/api";
import { Link } from "react-router-dom";

const famousIndianCities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { cities, favorites, unit } = useSelector((state) => state.weather);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH INITIAL TOP CITIES ----------------
  const loadTopCities = useCallback(async () => {
    const toLoad = famousIndianCities.slice(0, 8);
    for (let c of toLoad) {
      await dispatch(loadCityCurrent(c));
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    loadTopCities();

    // Auto-refresh every 1 minute
    const interval = setInterval(() => {
      loadTopCities();
      favorites.forEach((city) => dispatch(loadCityCurrent(city)));
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, loadTopCities, favorites]);

  // ---------------- SEARCH AUTOCOMPLETE ----------------
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setSearchResults([]);
      return;
    }

    const id = setTimeout(async () => {
      try {
        const res = await searchAutocomplete(searchQuery);
        setSuggestions(res || []);
      } catch {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(id);
  }, [searchQuery]);

  // ---------------- FETCH SEARCH RESULT ----------------
  const handleSearchSelect = async (name) => {
    setSearchQuery(name);
    setSuggestions([]);
    try {
      const data = await fetchCurrent(name);
      // save to Redux to make it globally available
      dispatch(setCityData({ city: name, data }));
      setSearchResults([{ city: name, data }]);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FAVORITES TOGGLE ----------------
  const toggleFavorite = async (city, data) => {
    if (favorites.includes(city)) {
      dispatch(removeFavorite(city));
    } else {
      // ensure weather data is cached before adding
      if (!cities[city]) {
        const res = await fetchCurrent(city);
        dispatch(setCityData({ city, data: res }));
      }
      dispatch(addFavorite(city));
    }
  };

  // ---------------- RENDER CARD ----------------
  const renderCityCard = (city, data) => {
    if (!data || !data.current) {
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
    const isFav = favorites.includes(city);

    return (
      <div
        key={city}
        className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform"
      >
        <button
          onClick={() => toggleFavorite(city, data)}
          className={`absolute top-4 right-4 ${
            isFav ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
          } transition`}
        >
          <Star size={20} fill={isFav ? "currentColor" : "none"} />
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
              <p className="text-sm font-semibold">
                {Math.round(
                  unit === "C" ? current.feelslike_c : current.feelslike_f
                )}
                °
              </p>
              <p className="text-xs text-gray-500">Feels Like</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Global Weather Overview
          </h1>
          <p className="text-gray-500">
            Search and explore live weather updates.
          </p>
        </div>

        {/* Search */}
        <div className="relative flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 px-4 pl-10 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border border-gray-200 rounded-lg shadow-md mt-1 w-full z-20 max-h-60 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSearchSelect(s.name)}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {s.name}, {s.region}, {s.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6">
              Search Results for "{searchQuery}"
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((r) => renderCityCard(r.city, r.data))}
            </div>
          </section>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <section id="favorites" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((city) =>
                renderCityCard(city, cities[city] || {})
              )}
            </div>
          </section>
        )}

        {/* Top Cities */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {favorites.length ? "Top Indian Cities" : "Top Cities"}
          </h2>
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
              {famousIndianCities
                .slice(0, 8)
                .map((city) => renderCityCard(city, cities[city]))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
