import React, { useState } from "react";
import TokenManager from "../services/tokenManagerService";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

function UpdatePoll() {
  const [poll, setPoll] = useState({
    QuestionText: "",
    Options: [""],
    ExpirationTime: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tokenManager = TokenManager(navigate);
    await tokenManager.ensureToken();
    const response = await fetch("/api/poll", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(poll),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="container mx-auto min-h-screen">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
          <label className="block mb-2">Question:</label>
          <input
            type="text"
            value={poll.QuestionText}
            onChange={(e) => setPoll({ ...poll, QuestionText: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <label className="block mb-2">Options:</label>
          {poll.Options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...poll.Options];
                newOptions[index] = e.target.value;
                setPoll({ ...poll, Options: newOptions });
              }}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={() => setPoll({ ...poll, Options: [...poll.Options, ""] })}
            className="mt-2 p-2 bg-green-500 text-white rounded"
          >
            Add Option
          </button>
          <label className="block mb-2">Expiration Time:</label>
          <input
            type="datetime-local"
            value={poll.ExpirationTime}
            onChange={(e) =>
              setPoll({ ...poll, ExpirationTime: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Update Poll
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default UpdatePoll;
