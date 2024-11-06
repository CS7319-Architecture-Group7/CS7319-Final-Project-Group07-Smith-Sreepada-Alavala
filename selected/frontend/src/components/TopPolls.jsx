import React, { useEffect, useState } from "react";
import TokenManager from "../services/tokenManagerService";
import { useNavigate, useLocation } from "react-router-dom";

function TopPolls() {
  const [topPolls, setTopPolls] = useState([]);
  const [pollId, setPollId] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTopNPolls = async () => {
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken();
      const url = process.env.REACT_APP_API_BASE_URL;
      await fetch(`${url}/api/pollpopular/10`, { // Need to add TopN to environment configuration
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          const data = Array.from(response);
          console.log(data);
          setTopPolls(data);
        });
    };
    fetchTopNPolls();
  }, [pollId, navigate, location]);

  return (
    <div className="bg-sky-700 text-slate-100">
      <div className="container mx-auto min-h-screen">
        <div className="text-2xl m-4">Popular Polls:</div>
        <div className="text-xl underline mb-3"></div>
        {!topPolls ? (
          <div className="text-2xl text-center mt-8">
            There are no popular polls in the Database
          </div>
        ) : (
          <ul>
            {topPolls.map((poll) => (
              <li
                key={poll.PollId}
                className="mb-2 p-2 border border-gray-300 rounded"
              >
                <div className="col-span-3">
                  <button
                    // className="mx-3 relative rounded-full px-3 py-1 text-sm leading-6 text-slate-100 ring-1 ring-black hover:bg-sky-500"
                    className="mx-3 relative px-3 py-1 text-xl leading-6 text-slate-100 hover:text-slate-300"
                    onClick={() => {
                      setPollId(poll.PollId);
                      navigate("/participate", {
                        state: { pollId: poll.PollId },
                      });
                    }}
                  >
                    {poll.QuestionText}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TopPolls;
