import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GamePage() {
  const navigate = useNavigate();
  const [round, setRound] = useState(1);
  const [scrambledWord, setScrambledWord] = useState("");
  const [unscrambledWord, setUnscrambledWord] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [score, setScore] = useState(0);
  const [showUnscrambledWord, setShowUnscrambledWord] = useState(false);
  const [wordGenerated, setWordGenerated] = useState(false);
  const [guessResult, setGuessResult] = useState(""); // To store the guess result message
  const [showGuessResult, setShowGuessResult] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    // This effect will run after the state is updated
    const updateStats = async () => {
      console.log(
        "stats update called. score: " + score + " accuracy: " + accuracy
      );
      try {
        // Now, the state is guaranteed to be updated before making the POST request
        await axios.post("http://127.0.0.1:8000/stats/update-stats/", {
          score: score,
          accuracy: accuracy,
        });
      } catch (error) {
        console.error("Error making POST request:", error);
      }
    };

    console.log("updating stats...");
    updateStats();
  }, [score, accuracy]); // The effect depends on score and accuracy

  function generateScrambledWord() {
    axios
      .get("http://127.0.0.1:8000/api/retrieve-word/")
      .then((response) => {
        // Access the response data directly using response.data
        setUnscrambledWord(response.data.unscrambledWord);
        setScrambledWord(response.data.scrambledWord);
        setShowUnscrambledWord(true);
        setWordGenerated(true);

        console.log("Unscrambled Word:", response.data.unscrambledWord);
      })
      .catch((error) => {
        console.error("Axios error trying ot generate a word:", error);
      });

    if (!showForm) {
      setShowForm(true);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guess = document.getElementById("guessInput").value;
    const guessStr = guess.toString();
    let newScore = score;
    let newAccuracy = accuracy;
    let newGuessResult = "";

    console.log("submited");
    if (guessStr.toLowerCase() === unscrambledWord.toLowerCase()) {
      newScore += 1;
      newAccuracy += 100.0;
      newGuessResult = "Correct"; // Set the message to "Correct" for a correct guess
    } else {
      console.log("im in here");
      const curAccuracy = levenshteinDistance(
        guessStr.toLowerCase(),
        unscrambledWord.toLowerCase()
      );
      newAccuracy += curAccuracy;
      newGuessResult = unscrambledWord; // Set the message to the correct word for an incorrect guess
    }

    setScore(newScore);
    setAccuracy(newAccuracy);
    setGuessResult(newGuessResult); // Set the guess result message
    setShowGuessResult(true); // Display the guess result message

    await delay(5000); // Wait for 5 seconds

    setRound(round + 1);
    setShowGuessResult(false);

    if (round >= 3) {
      navigate("/end-game-stats");
    } else {
      generateScrambledWord();
      var form = document.getElementById("guessForm");
      form.reset();
    }
  };

  //calculate accuracy
  function levenshteinDistance(s1, s2) {
    console.log("s1: ", s1, "s2: ", s2);
    const len1 = s1.length;
    const len2 = s2.length;

    // Create a matrix to store the distances
    const matrix = [];
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Calculate distances
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Deletion
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );
      }
    }

    // The Levenshtein distance is the value in the bottom-right cell of the matrix
    const distance = matrix[len1][len2];

    // Calculate accuracy (lower distance means higher accuracy)
    const maxLen = Math.max(len1, len2);
    const accuracy = 1 - distance / maxLen;

    return accuracy;
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-black">
      <h1 className="text-white">Round {round}</h1>
      {showUnscrambledWord && (
        <div className="mt-2 justify-content-center">
          <p className="text-white">Scrambled Word: {scrambledWord}</p>
        </div>
      )}
      {showForm && (
        <form id="guessForm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control-lg mb-1"
              id="guessInput"
              placeholder="Type Here..."
            />
          </div>
          <div className="d-flex justify-content-center">
            <button className="mb-1 btn btn-success btn-md" type="submit">
              Make Guess
            </button>
          </div>
        </form>
      )}
      {!wordGenerated && (
        <button
          type="button"
          className="btn btn-md"
          style={{ backgroundColor: "#dc3545" }}
          onClick={generateScrambledWord}
        >
          Generate Word
        </button>
      )}
      {showGuessResult && (
        <div className="mt-2 justify-content-center">
          <p
            className={
              guessResult === "Correct" ? "text-success" : "text-danger"
            }
          >
            {guessResult}
          </p>
        </div>
      )}
    </div>
  );
}
