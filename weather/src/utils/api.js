// src/utils/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_WEATHER_API_URL;
const KEY = import.meta.env.VITE_WEATHER_API_KEY;

const api = axios.create({
  baseURL: BASE,
  params: {
    key: KEY
  },
});

// Fetch current + forecast (WeatherAPI has endpoints like /current.json and /forecast.json)
export async function fetchCurrent(city) {
  const res = await api.get('/current.json', { params: { q: city } });
  return res.data; // {location, current}
}

export async function fetchForecast(city, days = 7, hourly = false) {
  // forecast.json?key=...&q=city&days=7&aqi=no&alerts=no
  const res = await api.get('/forecast.json', { params: { q: city, days, aqi: 'no', alerts: 'no' } });
  return res.data; // {location, current, forecast}
}

export async function searchAutocomplete(query) {
  // WeatherAPI has a search endpoint /search.json?key=...&q=London
  const res = await api.get('/search.json', { params: { q: query } });
  return res.data; // array of location results
}
