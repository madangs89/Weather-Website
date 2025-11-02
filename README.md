# 🌤️ Weather Analytics Dashboard — MERN + Redux Project

A **real-time weather analytics dashboard** built using **React + Redux Toolkit**, fetching live data from the **WeatherAPI**.  
It provides users with live updates, detailed city forecasts, interactive charts, and personalization options such as favorites and temperature units.

---

## 🚀 Features

### 🌦️ Core Functionality
- **Live Weather Dashboard** — Displays current temperature, condition, humidity, wind speed, and "feels like" for top Indian cities.
- **Detailed City View** — View 7-day forecasts, hourly trends, and in-depth weather stats for each city.
- **Search Cities** — Search any city using autocomplete suggestions powered by WeatherAPI.
- **Favorites** — Mark or unmark cities as favorites for quick access. Data is persisted using `localStorage`.
- **Auto Refresh** — Updates weather data automatically every few seconds/minutes (based on user settings).
- **Unit Toggle (°C/°F)** — Switch between Celsius and Fahrenheit instantly.
- **Error Handling** — Clean UI alerts for failed API calls, with retry option.

---

## ⚙️ Settings Page
Manage your personal preferences:
- 🌡 Choose temperature unit — Celsius / Fahrenheit  
- ⏱ Select auto-refresh interval (30s / 1min / 2min)  
- 🧹 Clear cache — Removes saved favorites and cached weather data  

---

## 🧩 Tech Stack

| Layer | Technologies Used |
|--------|-------------------|
| **Frontend** | React.js, React Router, Redux Toolkit |
| **State Management** | Redux Toolkit + Async Thunks |
| **UI Library** | Tailwind CSS + Lucide Icons |
| **Data Source** | WeatherAPI (Current + Forecast endpoints) |
| **Visualization** | Recharts (for hourly temperature trends) |
| **Persistence** | LocalStorage for favorites & settings |

---

## 🗂️ Folder Structure

weather-dashboard/
├── src/
│ ├── components/
│ │ └── Navbar.jsx
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Detailed.jsx
│ │ ├── Favorites.jsx
│ │ └── Settings.jsx
│ ├── redux/
│ │ └── weatherSlice.js
│ ├── utils/
│ │ └── api.js
│ ├── App.jsx
│ ├── index.js
│ └── index.css
└── package.json

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository
bash
git clone[https://github.com/your-username/weather-dashboard.git](https://github.com/madangs89/Weather-Website.git)
cd weather-dashboard

2️⃣ Install Dependencies
npm install

3️⃣ Add WeatherAPI Key

Create a .env file in the root directory and add your API key:
VITE_WEATHER_API_KEY=<Your Key>
VITE_WEATHER_API_URL=https://api.weatherapi.com/v1
(You can get your key from https://www.weatherapi.com
)

4️⃣ Start the App
npm run dev

Visit the app at http://localhost:5173


🖼️ Screenshots
| Dashboard                                                             | Detailed View                                                        | Settings                                                             | Favorites                                                            |
| --------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| <img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/0f0f5fd6-8222-4831-924c-6c8786b45409" />| <img width="1919" height="917" alt="image" src="https://github.com/user-attachments/assets/bd2306bf-c182-41a5-8abb-925500c26704" />| <img width="1917" height="911" alt="image" src="https://github.com/user-attachments/assets/36c13919-e942-411e-972d-96fa5eae26eb" /> |<img width="1919" height="918" alt="image" src="https://github.com/user-attachments/assets/f859b6d6-e5d9-4af5-ba61-c37972d443b3" />\



🧠 Key Highlights

Efficient state management with Redux Toolkit slices and async thunks.
Real-time auto-refresh with interval control.
Elegant error handling with retry and visual alerts.
Responsive UI across all devices (mobile-friendly).
Clear and maintainable code with modular components.
