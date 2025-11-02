// src/pages/Dashboard.jsx
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
  const [tick, setTick] = useState(0); // forces per-second re-render for "Updated Xs ago"

  // helper: unified list we want to keep fresh (favorites + top)
  const getRefreshList = useCallback(() => {
    const top = famousIndianCities.slice(0, 8);
    const combined = Array.from(new Set([...favorites, ...top]));
    return combined;
  }, [favorites]);

  // ---------- initial load: fetch favorites + top cities ----------
  const initialLoad = useCallback(async () => {
    setLoading(true);
    const toLoad = getRefreshList();
    try {
      const promises = toLoad.map((c) => dispatch(loadCityCurrent(c)).unwrap().catch(() => null));
      // wait all to complete
      await Promise.all(promises);
    } catch (e) {
      // ignore per-city errors; we still continue
      console.error("initial load error", e);
    } finally {
      setLoading(false);
    }
  }, [dispatch, getRefreshList]);

  useEffect(() => {
    initialLoad();

    // refresh every 60s for all relevant cities
    const interval = setInterval(async () => {
      const toRefresh = getRefreshList();
      // dispatch refetches in parallel
      await Promise.all(toRefresh.map((c) => dispatch(loadCityCurrent(c)).unwrap().catch(() => null)));
    }, 60000);

    // tick every second to update "Updated Xs ago" displays
    const tickInterval = setInterval(() => setTick((t) => t + 1), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(tickInterval);
    };
  }, [dispatch, initialLoad, getRefreshList]);

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
      } catch (err) {
        console.error("autocomplete error", err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [searchQuery]);

  // ---------------- FETCH SEARCH RESULT (inline) ----------------
  const handleSearchSelect = async (name) => {
    setSearchQuery(name);
    setSuggestions([]);
    try {
      // fetch current weather and cache it into Redux (so it persists)
      const data = await fetchCurrent(name);
      dispatch(setCityData({ city: name, data }));
      setSearchResults([{ city: name, data }]);
    } catch (err) {
      console.error("search select error", err);
      setSearchResults([]);
    }
  };

  // ---------------- FAVORITES TOGGLE ----------------
  const toggleFavorite = async (city) => {
    if (favorites.includes(city)) {
      dispatch(removeFavorite(city));
      return;
    }
    // ensure we have data cached before marking favorite
    if (!cities[city]) {
      try {
        const res = await fetchCurrent(city);
        dispatch(setCityData({ city, data: res }));
      } catch (err) {
        console.error("error fetching city before favorite:", err);
        // still attempt to add favorite even if fetch failed (optional)
      }
    }
    dispatch(addFavorite(city));
  };

  // ---------------- helpers for UI freshness indicator ----------------
  const getCityLastUpdatedSecs = (city) => {
    const last = cities[city]?.lastUpdated || null;
    if (!last) return null;
    const secs = Math.floor((Date.now() - last) / 1000);
    return secs;
  };

  const getGlobalLastUpdatedSecs = () => {
    // compute most recent lastUpdated among loaded cities
    const allCities = Object.keys(cities);
    if (allCities.length === 0) return null;
    let latest = 0;
    for (const c of allCities) {
      const l = cities[c]?.lastUpdated || 0;
      if (l > latest) latest = l;
    }
    if (!latest) return null;
    return Math.floor((Date.now() - latest) / 1000);
  };

  // ---------------- render card ----------------
  const renderCityCard = (city, data) => {
    if (!data || !data.current) {
      // still show skeleton when we truly have no cached data
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
    const lastSecs = getCityLastUpdatedSecs(city);

    return (
      <div
        key={city}
        className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform"
      >
        <button
          onClick={() => toggleFavorite(city)}
          className={`absolute top-4 right-4 ${
            isFav ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
          } transition`}
          aria-label={isFav ? "Remove favorite" : "Add favorite"}
        >
          <Star size={20} fill={isFav ? "currentColor" : "none"} />
        </button>

        <div className="cursor-default">
          <div className="flex items-start gap-4">
            <img
              src={`https:${current.condition?.icon}`}
              alt={current.condition?.text || city}
              className="w-12 h-12"
            />
            <div>
              <Link
                to={`/city/${encodeURIComponent(city)}`}
                className="text-lg cursor-pointer font-bold"
              >
                {city}
              </Link>
              <p className="text-sm text-gray-500">{current.condition?.text}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-6xl font-black">{Math.round(temp)}°</p>
            <div className="text-xs text-gray-400 text-right">
              {lastSecs === null ? (
                <span>—</span>
              ) : lastSecs < 60 ? (
                <span>Updated {lastSecs}s ago</span>
              ) : lastSecs < 3600 ? (
                <span>Updated {Math.floor(lastSecs / 60)}m ago</span>
              ) : (
                <span>Updated {Math.floor(lastSecs / 3600)}h ago</span>
              )}
            </div>
          </div>

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
                {Math.round(unit === "C" ? current.feelslike_c : current.feelslike_f)}
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
  const globalLastSecs = getGlobalLastUpdatedSecs();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Global Weather Overview
            </h1>
            <p className="text-gray-500">Search and explore live weather updates.</p>
          </div>

          <div className="text-sm text-gray-500 text-right">
            {globalLastSecs === null ? (
              <div>Not updated yet</div>
            ) : globalLastSecs < 60 ? (
              <div>Updated {globalLastSecs}s ago</div>
            ) : globalLastSecs < 3600 ? (
              <div>Updated {Math.floor(globalLastSecs / 60)}m ago</div>
            ) : (
              <div>Updated {Math.floor(globalLastSecs / 3600)}h ago</div>
            )}
            <div className="text-xs text-gray-400">Auto-refresh every 60s</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex flex-col sm:flex-row gap-3 mb-6">
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
                    {s.name}{s.region ? `, ${s.region}` : ""}{s.country ? `, ${s.country}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((r) => renderCityCard(r.city, r.data))}
            </div>
          </section>
        )}

        {/* Favorites */}
        <section id="favorites" className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500 mb-6">No favorites yet — click the star on any card to add.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {favorites.map((city) => renderCityCard(city, cities[city] || {}))}
            </div>
          )}
        </section>

        {/* Top Cities */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Top Indian Cities</h2>
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
              {famousIndianCities.slice(0, 8).map((city) => renderCityCard(city, cities[city]))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
