import React, { useEffect, useState } from "react";
import TokenManager from "../services/tokenManagerService";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

function PollList() {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken();

      const response = await fetch("/api/poll", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setPolls(data);
    };

    fetchPolls();
  }, []);

  return (
    <div>
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="container mx-auto min-h-screen">
        <h1 className="text-2xl mb-4">Active Polls</h1>
        <ul>
          {polls.map((poll) => (
            <li
              key={poll.id}
              className="mb-2 p-2 border border-gray-300 rounded"
            >
              {poll.QuestionText}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}

export default PollList;
