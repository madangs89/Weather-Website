import React from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Detailed from "./pages/Detailed";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/city/:city" element={<Detailed />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default App;
