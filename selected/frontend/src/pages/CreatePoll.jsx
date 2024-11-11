import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenManager from "../services/tokenManagerService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSnackbar } from "notistack";
import { logPerformance } from "../services/performanceLoggingService";

function CreatePoll() {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expirationTime, setExpirationTime] = useState("");
  const [resultsVisible, setResultsVisible] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let start = Date.now(); // perf log 1 of 4
    const tokenManager = TokenManager(navigate);
    await tokenManager.ensureToken().catch((error) => { navigate("/login"); });
    const url = process.env.REACT_APP_API_BASE_URL;
    await fetch(`${url}/api/poll`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        QuestionText: questionText,
        Options: options,
        ExpirationTime: expirationTime,
        ResultsVisible: resultsVisible,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        let stop = Date.now(); // perf log 2 of 4
        let split = stop - start; // perf log 3 of 4
        logPerformance("create poll", start, stop, split); // perf log 4 of 4
        enqueueSnackbar("Your poll was created successfully.", {
          variant: "success",
        });
        navigate("/polls");
      })
      .catch((error) => {
        enqueueSnackbar("There was an error creating your poll.", {
          variant: "error",
        });
        console.log(error);
        
        // If error code is > 400, then redirect to login
        if (error.response && error.response.status > 400) {
          window.localStorage.clear();
          navigate("/login");
        }
      });
  };

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div className="container mx-auto min-h-screen">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
          <label className="block mb-2 text-lg">Question:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
          <label className="block mb-2 text-lg">Options:</label>
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
              className="w-full p-2 border text-black border-gray-300 rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={() => setOptions([...options, ""])}
            className="mt-2 p-2 bg-green-500 text-white rounded"
          >
            Add Option
          </button>
          <label className="block m-2 text-lg">Expiration Time:</label>
          <input
            type="datetime-local"
            value={expirationTime}
            onChange={(e) => setExpirationTime(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
          <div className="mt-3 grid grid-cols-10">
            <input
              id="resultsVis"
              name="resultsVis"
              type="checkbox"
              defaultChecked={resultsVisible}
              value={resultsVisible}
              onChange={(e) => {
                setResultsVisible(!resultsVisible);
              }}
              className="mt-1 col-span-1 w-full p-2 border text-black border-gray-300 rounded"
            />{" "}
            <label
              className="col-span-9 block mb-2 text-lg"
              htmlFor="resultsVis"
            >
              Make results available to participants
            </label>
          </div>
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
