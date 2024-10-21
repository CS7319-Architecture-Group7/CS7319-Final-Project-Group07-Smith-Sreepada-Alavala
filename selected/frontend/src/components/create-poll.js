import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenManager from "../services/tokenManagerService";
import Header from "./header";
import Footer from "./footer";

function CreatePoll() {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expirationTime, setExpirationTime] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tokenManager = TokenManager(navigate);
    await tokenManager.ensureToken();
    const response = await fetch("/api/poll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        QuestionText: questionText,
        Options: options,
        ExpirationTime: expirationTime,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
          <label className="block mb-2">Question:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <label className="block mb-2">Options:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={() => setOptions([...options, ""])}
            className="mt-2 p-2 bg-green-500 text-white rounded"
          >
            Add Option
          </button>
          <label className="block mb-2">Expiration Time:</label>
          <input
            type="datetime-local"
            value={expirationTime}
            onChange={(e) => setExpirationTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Create Poll
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default CreatePoll;
