import React from "react";
import { useNavigate } from "react-router-dom";
import Scramble from "react-scramble";
import axios from "axios";

export default function LandingPage() {
  const navigate = useNavigate();

  const populateWords = async () => {
    try {
      // Now, the state is guaranteed to be updated before making the POST request
      await axios.get("http://127.0.0.1:8000/api/populate-words/");
    } catch (error) {
      console.error("Error making GET request:", error);
    }
    navigate("/game");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-black">
      <h1 className="text-white">
        <Scramble
          autoStart
          text="Ekreb"
          steps={[
            {
              roll: 50,
              action: "+",
              type: "all",
            },
            {
              action: "-",
              type: "forward",
            },
          ]}
        />
      </h1>
      <button
        type="button"
        className="btn btn-md mt-2"
        style={{ backgroundColor: '#20c997' }}
        onClick={populateWords}
      >
        Start Game
      </button>
    </div>
  );
}
