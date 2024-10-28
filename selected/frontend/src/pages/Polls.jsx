import React, { useEffect, useState } from "react";
import TokenManager from "../services/tokenManagerService";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaTrash } from "react-icons/fa";
import { FaVoteYea } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa";
import { FaComment } from "react-icons/fa";

function Polls() {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState(polls);
  const [pollAnswers, setPollAnswers] = useState([]);
  const navigate = useNavigate();

  const filterPolls = (term) => {
    let newList = [];
    if (polls.length != 0) {
      polls.forEach((poll, idx) => {
        if (poll.QuestionText.toUpperCase().includes(term.toUpperCase())) {
          newList.push(poll);
        }
      });
    }
    setFilteredPolls(newList);
  };

  const tallyResponses = (poll) => {
    let total = 0;
    pollAnswers.forEach((answer) => {
      if (poll.PollId === answer.PollId) {
        total++;
      }
    });
    return total;
  };

  useEffect(() => {
    const fetchPolls = async () => {
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken();
      const url = "http://localhost:5001";
      await fetch(`${url}/api/poll`, {
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
          setPolls(data);
          setFilteredPolls(data);
        });
    };

    const fetchPollAnswers = async () => {
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken();
      const url = "http://localhost:5001";
      await fetch(`${url}/api/pollanswer`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setPollAnswers(response);
        });
    };

    fetchPolls();
    fetchPollAnswers();
  }, []);

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="container mx-auto min-h-screen">
        <div className="text-xl text-center mb-3">
          Search Polls
          <input
            className="m-2 rounded-md p-2 text-black"
            type="text"
            name="term"
            placeholder="Search term"
            onChange={(event) => filterPolls(event.target.value)}
          ></input>
        </div>
        <div className="text-5xl m-4">Polls:</div>
        <div className="grid grid-cols-10 text-xl text-center underline mb-3">
          <div className="col-span-3">Poll Question</div>
          <div className="col-span-1">Responses</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Participate</div>
          <div className="col-span-1">Comments</div>
          <div className="col-span-1">Report</div>
          <div className="col-span-1">Edit</div>
          <div className="col-span-1">Delete</div>
        </div>
        {!polls ? (
          <div className="text-3xl text-center mt-8">
            There are no currently polls in the Database
          </div>
        ) : (
          <ul>
            {filteredPolls.map((poll) => (
              <li
                key={poll.PollId}
                className="mb-2 p-2 border border-gray-300 rounded"
              >
                <div className="grid grid-cols-10 text-center">
                  <div className="col-span-3">{poll.QuestionText}</div>
                  <div className="col-span-1">{tallyResponses(poll)}</div>
                  <div className="col-span-1">
                    {new Date().toLocaleDateString() < poll.ExpirationDateTime
                      ? "Active"
                      : "Inactive"}
                  </div>
                  <div className="col-span-1">
                    <button
                      // className="mx-3 relative rounded-full px-3 py-1 text-sm leading-6 text-slate-100 ring-1 ring-black hover:bg-sky-500"
                      className="mx-3 relative px-3 py-1 text-xl leading-6 text-slate-100 hover:text-slate-300"
                      onClick={() => {
                        navigate("/participate", {
                          state: { pollId: poll.PollId },
                        });
                      }}
                    >
                      <FaVoteYea className="text-tron-black dark:text-tron-medium-grey" />
                    </button>
                  </div>
                  <div className="col-span-1">
                    <button
                      // className="mx-3 relative rounded-full px-3 py-1 text-sm leading-6 text-slate-100 ring-1 ring-black hover:bg-sky-500"
                      className="mx-3 relative px-3 py-1 text-xl leading-6 text-slate-100 hover:text-slate-300"
                      onClick={() => {
                        navigate("/participate", {
                          state: { pollId: poll.PollId },
                        });
                      }}
                    >
                      <FaComment className="text-tron-black dark:text-tron-medium-grey" />
                    </button>
                  </div>

                  <div className="col-span-1">
                    <button
                      // className="mx-3 relative rounded-full px-3 py-1 text-sm leading-6 text-slate-100 ring-1 ring-black hover:bg-sky-500"
                      className="mx-3 relative px-3 py-1 text-xl leading-6 text-slate-100 hover:text-slate-300"
                      onClick={() => {
                        navigate("/results", {
                          state: { pollId: poll.PollId },
                        });
                      }}
                    >
                      <FaChartPie className="text-tron-black dark:text-tron-medium-grey" />
                    </button>
                  </div>
                  <div className="col-span-1">
                    {" "}
                    <button
                      className="mx-3 relative px-3 py-1 text-xl leading-6 text-slate-100 hover:text-slate-300"
                      onClick={
                        () =>
                          console.log(
                            "This will nav to the edit page for this poll"
                          )
                        // () => navigate("/vote-in-poll")
                      }
                    >
                      <FaEdit className="text-tron-black dark:text-tron-medium-grey" />
                    </button>
                  </div>
                  <div className="col-span-1">
                    <button
                      // className="mx-3 relative rounded-full px-3 py-1 text-sm leading-6 text-slate-100 ring-1 ring-black hover:bg-sky-500"
                      className="mx-3 relative px-3 py-1 text-xl leading-6 text-slate-100 hover:text-slate-300"
                      onClick={() => console.log("This will delete this poll")}
                    >
                      <FaTrash className="text-tron-black dark:text-tron-medium-grey" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Polls;
