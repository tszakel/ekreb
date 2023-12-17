import React from "react";
//import axios from "axios";

import LandingPage from "./components/LandingPage";
import GamePage from "./components/GamePage.js";
import EndGameStatsPage from "./components/EndGameStatsPage.js";

// import bootstrap
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap-icons/font/bootstrap-icons.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/end-game-stats" element={<EndGameStatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
