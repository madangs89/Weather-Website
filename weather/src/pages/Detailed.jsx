import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadCityCurrent,
  loadCityForecast,
  addFavorite,
  removeFavorite,
} from "../redux/weatherSlice";
import {
  Cloud,
  Wind,
  Droplets,
  Sun,
  Gauge,
  Eye,
  Thermometer,
  Star,
  ArrowLeft,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Detailed = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cities, favorites, unit, status } = useSelector(
    (state) => state.weather
  );
  const [loading, setLoading] = useState(true);

  const isFav = favorites.includes(city);
  const cityData = cities[city]?.current?.current;
  const forecastData = cities[city]?.forecast?.forecast?.forecastday || [];

  // Load data when page opens
  useEffect(() => {
    const load = async () => {
      await dispatch(loadCityCurrent(city));
      await dispatch(loadCityForecast({ city, days: 7 }));
      setLoading(false);
    };
    load();
  }, [dispatch, city]);

  const toggleFavorite = () => {
    if (isFav) dispatch(removeFavorite(city));
    else dispatch(addFavorite(city));
  };

  // Hourly chart (use 1st forecast day)
  const hourly = forecastData[0]?.hour?.map((h) => ({
    time: h.time.split(" ")[1],
    temp: unit === "C" ? h.temp_c : h.temp_f,
  }));

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700">
        <p className="text-2xl font-semibold mb-4">City not found 😕</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-[#0d131c] font-display px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-8">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="p-2 text-[#0d131c]">
            <span className="material-symbols-outlined text-2xl">
              <ArrowLeft />
            </span>
          </button>
        </div>

        {/* City Title */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-4xl font-black tracking-[-0.03em]">
            {cities[city]?.current?.location?.name},{" "}
            {cities[city]?.current?.location?.country}
          </p>
        </div>

        {/* Current Overview */}
        <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">
          Current Overview
        </h2>
        <div className="p-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex justify-center items-center w-full lg:w-48 mb-4 lg:mb-0">
              <img
                src={`https:${cityData.condition?.icon}`}
                alt={cityData.condition?.text}
                className="w-24 h-24"
              />
            </div>
            <div className="flex-grow flex flex-col justify-center gap-4 lg:px-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-6xl font-bold leading-tight">
                    {Math.round(
                      unit === "C" ? cityData.temp_c : cityData.temp_f
                    )}
                    °
                  </p>
                  <p className="text-gray-600 text-lg mt-1">
                    {cityData.condition?.text}
                  </p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center gap-2 px-4 h-10 rounded-lg font-medium transition ${
                    isFav
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  <Star
                    className="text-current"
                    fill={isFav ? "currentColor" : "none"}
                    size={18}
                  />
                  {isFav ? "Favorited" : "Add to Favorites"}
                </button>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <p className="text-gray-600">
                Wind: {cityData.wind_kph} km/h | Pressure:{" "}
                {cityData.pressure_mb} hPa | Humidity: {cityData.humidity}% | UV
                Index: {cityData.uv}
              </p>
            </div>
          </div>
        </div>

        {/* Forecast & Hourly */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 pt-5">
          {/* 7 Day Forecast */}
          <div className="flex flex-col">
            <h2 className="text-[22px] font-bold pb-3">7-Day Forecast</h2>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {forecastData.map((f, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition"
                  >
                    <p className="text-lg font-semibold">
                      {new Date(f.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <img
                      src={`https:${f.day.condition.icon}`}
                      alt={f.day.condition.text}
                      className="w-10 h-10"
                    />
                    <p className="text-gray-600 text-sm">
                      {f.day.condition.text}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {Math.round(
                        unit === "C" ? f.day.avgtemp_c : f.day.avgtemp_f
                      )}
                      °
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hourly Chart */}
          <div className="flex flex-col">
            <h2 className="text-[22px] font-bold pb-3">Hourly Forecast (24h)</h2>
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-4 h-80 flex items-center justify-center">
              {hourly && hourly.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(v) => `${v}°${unit}`}
                      labelFormatter={(l) => `Time: ${l}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm">No hourly data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <h2 className="text-[22px] font-bold px-4 pb-3 pt-8">Detailed Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          <StatCard
            icon={<Sun size={20} />}
            label="Sunrise & Sunset"
            value={`${cities[city]?.forecast?.forecast?.forecastday[0]?.astro?.sunrise} / ${cities[city]?.forecast?.forecast?.forecastday[0]?.astro?.sunset}`}
          />
          <StatCard
            icon={<Thermometer size={20} />}
            label="Feels Like"
            value={`${Math.round(
              unit === "C" ? cityData.feelslike_c : cityData.feelslike_f
            )}°`}
          />
          <StatCard
            icon={<Eye size={20} />}
            label="Visibility"
            value={`${cityData.vis_km} km`}
          />
          <StatCard
            icon={<Droplets size={20} />}
            label="Dew Point"
            value={`${cityData.dewpoint_c || "-"}°`}
          />
          <StatCard
            icon={<Gauge size={20} />}
            label="Pressure"
            value={`${cityData.pressure_mb} hPa`}
          />
          <StatCard
            icon={<Cloud size={20} />}
            label="Cloud Coverage"
            value={`${cityData.cloud}%`}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      <p className="text-sm font-medium">{label}</p>
    </div>
    <p className="text-2xl font-bold text-[#0d131c]">{value}</p>
  </div>
);

export default Detailed;
