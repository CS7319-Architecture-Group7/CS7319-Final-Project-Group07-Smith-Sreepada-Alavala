import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TokenManager from "../services/tokenManagerService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSnackbar } from "notistack";
import { logPerformance } from "../services/performanceLoggingService";

function UpdatePoll() {
  const location = useLocation();
  const pollId = location.state?.pollId;
  const [poll, setPoll] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting");
    console.log(pollId);
    console.log(expirationTime);
    let start = Date.now(); // perf log 1 of 4

    const tokenManager = TokenManager(navigate);
    await tokenManager.ensureToken().catch((error) => {
      navigate("/login");
    });
    const url = process.env.REACT_APP_API_BASE_URL;
    await fetch(`${url}/api/poll`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        PollId: pollId,
        ExpirationTime: expirationTime,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        let stop = Date.now(); // perf log 2 of 4
        let split = stop - start; // perf log 3 of 4
        logPerformance("update poll", start, stop, split); // perf log 4 of 4
        console.log(response);
        enqueueSnackbar("Your poll was updated successfully.", {
          variant: "success",
        });
        navigate("/polls");
      })
      .catch((error) => {
        enqueueSnackbar("There was an error updating your poll.", {
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

  useEffect(() => {
    let p;
    const fetchPoll = async (pollId) => {
      let start = Date.now(); // perf log 1 of 4
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken().catch((error) => {
        navigate("/login");
      });
      const url = process.env.REACT_APP_API_BASE_URL;
      await fetch(`${url}/api/poll/${pollId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          let stop = Date.now(); // perf log 2 of 4
          let split = stop - start; // perf log 3 of 4
          logPerformance("get single poll", start, stop, split); // perf log 4 of 4
          console.log("poll", response[0]);
          p = response[0];
          setPoll(response[0]);
          setQuestionText(p.QuestionText);
          setExpirationTime(p.ExpirationDateTime);
        })
        .catch((error) => {
          // If error code is > 400, then redirect to login
          if (error.response && error.response.status > 400) {
            window.localStorage.clear();
            navigate("/login");
          }
        });
    };

    fetchPoll(pollId);
  }, []);

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div className="container mx-auto min-h-screen">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
          <label className="block mb-2 text-lg">Question:</label>
          <div>{questionText}</div>
          <label className="block m-2 text-lg">Expiration Time:</label>
          <input
            type="datetime-local"
            value={expirationTime}
            onChange={(e) => setExpirationTime(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded"
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
