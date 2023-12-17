import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GamePage() {
  const navigate = useNavigate();

  const [accuracy, setAccuracy] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function fetchGameStats() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/stats/retrieve-stats/"
        );
        const responseData = response.data;

        if (Array.isArray(responseData) && responseData.length === 1) {
          const statsData = responseData[0];
          if (
            typeof statsData.score === "number" &&
            typeof statsData.accuracy === "number"
          ) {
            setAccuracy(statsData.accuracy);
            setScore(statsData.score);
            console.log("Stats retrieved successfully");
          } else {
            console.error(
              "Invalid score or accuracy values in the response data."
            );
          }
        } else {
          console.error("Invalid response data structure.");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    // Fetch stats only once when the component initially renders
    fetchGameStats();
  }, []);

  async function resetStats() {
    try {
      await axios.post("http://127.0.0.1:8000/reset-stats/");
      // Stats have been reset, you can reset the state or navigate as needed
      console.log("Stats reset successfully");
    } catch (error) {
      console.error("Error resetting stats:", error);
    }
  }

  function playAnotherGame() {
    resetStats();
    navigate("/");
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-black">
      <h1 className="text-white">Game Stats</h1>
      <h3 className="text-white">Score: {score}</h3>
      <h3 className="text-white">Accuracy: {(accuracy / 3).toFixed(2)}%</h3>
      <button
        type="button"
        className="btn btn-md mt-2"
        style={{ backgroundColor: "#dc3545" }}
        onClick={playAnotherGame}
      >
        Play Again?
      </button>
    </div>
  );
}
