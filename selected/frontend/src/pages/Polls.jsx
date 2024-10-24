import React, { useEffect, useState } from "react";
import TokenManager from "../services/tokenManagerService";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaTrash } from "react-icons/fa";
import { FaVoteYea } from "react-icons/fa";

// key props error

function Polls() {
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
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="container mx-auto min-h-screen">
        <h1 className="text-2xl mb-4">Active Polls</h1>
        <div className="grid grid-cols-10">
          <div className="col-span-3">Poll Question</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Expires</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Delete</div>
          <div className="col-span-1">Vote</div>
        </div>
        <ul>
          {polls.map((poll, index) => (
            <li
              key={poll.PollId}
              className="mb-2 p-2 border border-gray-300 rounded"
            >
              <div className="grid grid-cols-10">
                <div className="col-span-3">{poll.QuestionText}</div>
                <div className="col-span-2">{poll.CreatedDate}</div>
                <div className="col-span-2">{poll.ExpirationDateTime}</div>
                <div className="col-span-1">
                  {new Date().toLocaleDateString() < poll.ExpirationDateTime
                    ? "Active"
                    : "Inactive"}
                </div>
                <div className="col-span-1">
                  <button
                    // className="mx-3 relative rounded-full px-3 py-1 text-sm leading-6 text-slate-100 ring-1 ring-black hover:bg-sky-500"
                    className="mx-3 relative px-3 py-1 text-sm leading-6 text-slate-100 hover:text-slate-300"
                    onClick={() => console.log("This will delete this poll")}
                  >
                    <FaTrash className="text-tron-black dark:text-tron-medium-grey" />
                  </button>
                </div>
                <div className="col-span-1">
                  {" "}
                  <button
                    className="mx-3 relative px-3 py-1 text-lg leading-6 text-slate-100 hover:text-slate-300"
                    onClick={
                      console.log(
                        "This will nav to the vote page for this poll"
                      )
                      // () => navigate("/vote-in-poll")
                    }
                  >
                    <FaVoteYea className="text-tron-black dark:text-tron-medium-grey" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}

export default Polls;
