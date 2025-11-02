// src/redux/weatherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrent, fetchForecast } from '../utils/api';

// Async thunks
export const loadCityCurrent = createAsyncThunk('weather/loadCurrent', async (city) => {
  const res = await fetchCurrent(city);
  return { city, data: res };
});

export const loadCityForecast = createAsyncThunk('weather/loadForecast', async ({ city, days }) => {
  const res = await fetchForecast(city, days);
  return { city, data: res };
});

// initialState
const initialState = {
  cities: {}, // { [cityName]: { current: {}, forecast: {}, lastUpdated: timestamp } }
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  unit: 'C', // 'C' or 'F'
  status: 'idle',
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addFavorite(state, action) {
      const city = action.payload;
      if (!state.favorites.includes(city)) {
        state.favorites.push(city);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter(c => c !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    setUnit(state, action) {
      state.unit = action.payload;
    },
    setCityData(state, action) {
      const { city, data } = action.payload;
      state.cities[city] = { ...(state.cities[city]||{}), ...data, lastUpdated: Date.now() };
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCityCurrent.pending, (s) => { s.status = 'loading'; })
      .addCase(loadCityCurrent.fulfilled, (s, a) => {
        const city = a.payload.city;
        s.cities[city] = { ...(s.cities[city] || {}), current: a.payload.data, lastUpdated: Date.now() };
        s.status = 'succeeded';
      })
      .addCase(loadCityCurrent.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; })
      .addCase(loadCityForecast.pending, (s) => { s.status = 'loading'; })
      .addCase(loadCityForecast.fulfilled, (s, a) => {
        const city = a.payload.city;
        s.cities[city] = { ...(s.cities[city] || {}), forecast: a.payload.data, lastUpdated: Date.now() };
        s.status = 'succeeded';
      })
      .addCase(loadCityForecast.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; });
  }
});

export const { addFavorite, removeFavorite, setUnit, setCityData } = weatherSlice.actions;
export const weatherReducer = weatherSlice.reducer;
