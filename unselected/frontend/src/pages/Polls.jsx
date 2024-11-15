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
import { logPerformance } from "../services/performanceLoggingService";
import { useSnackbar } from "notistack";

function Polls() {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState(polls);
  const [pollAnswers, setPollAnswers] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [refreshCue, setRefreshCue] = useState(true);

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

  const handleDelete = async (pollId) => {
    console.log("This will delete this poll ", pollId);
    let start = Date.now(); // perf log 1 of 4
    const tokenManager = TokenManager(navigate);
    await tokenManager.ensureToken().catch((error) => {
      navigate("/login");
    });
    const url = process.env.REACT_APP_UNSELECTED_API_BASE_URL;
    await fetch(`${url}/api/poll`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        PollId: pollId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        let stop = Date.now(); // perf log 2 of 4
        let split = stop - start; // perf log 3 of 4
        logPerformance("delete poll", start, stop, split); // perf log 4 of 4
        console.log(response);
        enqueueSnackbar("You deleted the poll successfully.", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar("There was an error deleting the poll.", {
          variant: "error",
        });
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchPolls = async () => {
      let start = Date.now(); // perf log 1 of 4
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken().catch((error) => {
        navigate("/login");
      });
      const url = process.env.REACT_APP_UNSELECTED_API_BASE_URL;
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
          let stop = Date.now(); // perf log 2 of 4
          let split = stop - start; // perf log 3 of 4
          logPerformance("get polls", start, stop, split); // perf log 4 of 4
          const data = Array.from(response);
          setPolls(data);
          setFilteredPolls(data);
        })
        .catch((error) => {
          // If error code is > 400, then redirect to login
          if (error.response && error.response.status > 400) {
            window.localStorage.clear();
            navigate("/login");
          }
        });
    };

    const fetchPollAnswers = async () => {
      let start = Date.now(); // perf log 1 of 4
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken().catch((error) => {
        navigate("/login");
      });
      const url = process.env.REACT_APP_UNSELECTED_API_BASE_URL;
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
          let stop = Date.now(); // perf log 2 of 4
          let split = stop - start; // perf log 3 of 4
          logPerformance("get poll answers", start, stop, split); // perf log 4 of 4
          setPollAnswers(response);
        })
        .catch((error) => {
          // If error code is > 400, then redirect to login
          if (error.response && error.response.status > 400) {
            window.localStorage.clear();
            navigate("/login");
          }
        });
    };

    fetchPolls();
    fetchPollAnswers();
  }, [refreshCue]);

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="container mx-auto min-h-screen p-3">
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
        <div className="grid grid-cols-9 text-xl text-center underline mb-3">
          <div className="col-span-3">Poll Question</div>
          <div className="col-span-1">Responses</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Participate</div>
          {/* <div className="col-span-1">Comments</div> */}
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
                <div></div>
                <div className="grid grid-cols-9 text-center">
                  <div className="col-span-3">{poll.QuestionText}</div>
                  <div className="col-span-1">{tallyResponses(poll)}</div>
                  <div className="col-span-1">
                    {new Date().toISOString() < poll.ExpirationDateTime
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
                      <div className="grid grid-cols-2">
                        <FaVoteYea className="mx-1 col-span-1 text-white" />
                        <FaComment className="mx-1 col-span-1 text-white" />
                      </div>
                    </button>
                  </div>
                  <div className="col-span-1">
                    <button
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
                      onClick={() => {
                        console.log(
                          "This will nav to the edit page for this poll"
                        );
                        navigate("/update-poll", {
                          state: { pollId: poll.PollId },
                        });
                      }}
                    >
                      <FaEdit className="text-tron-black dark:text-tron-medium-grey" />
                    </button>
                  </div>
                  <div className="col-span-1">
                    <button
                      // className="mx-3 relative rounded-full px-3 py-1 text-sm leading-6 text-slate-100 ring-1 ring-black hover:bg-sky-500"
                      className="mx-3 relative px-3 py-1 text-xl leading-6 text-slate-100 hover:text-slate-300"
                      onClick={() => {
                        //console.log("do it");
                        handleDelete(poll.PollId);
                        setRefreshCue(!refreshCue);
                        //                       navigate(0); // refresh
                      }}
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
