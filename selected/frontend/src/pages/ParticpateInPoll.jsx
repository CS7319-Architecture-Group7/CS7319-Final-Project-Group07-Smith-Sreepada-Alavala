import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TokenManager from "../services/tokenManagerService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopPolls from "../components/TopPolls";
import { useSnackbar } from "notistack";
import { logPerformance } from "../services/performanceLoggingService";

function ParticipateInPoll() {
  const location = useLocation();
  const pollId = location.state?.pollId;
  const navigate = useNavigate();
  const [poll, setPoll] = useState([]);
  const [pollOptions, setPollOptions] = useState([]);
  const [comments, setComments] = useState([]);
  const [answer, setAnswer] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [commentText, setCommentText] = useState("");

  const handleAnswer = async (e) => {
    e.preventDefault();
    let start = Date.now(); // perf log 1 of 4
    const tokenManager = TokenManager(navigate);
    await tokenManager.ensureToken();
    const url = process.env.REACT_APP_API_BASE_URL;
    await fetch(`${url}/api/pollanswer`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        PollId: pollId,
        OptionId: answer,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        let stop = Date.now(); // perf log 2 of 4
        let split = stop - start; // perf log 3 of 4
        logPerformance("answer poll", start, stop, split); // perf log 4 of 4
        enqueueSnackbar("Your answered the poll successfully.", {
          variant: "success",
        });
        navigate("/top-polls");
      })
      .catch((error) => {
        enqueueSnackbar("There was an error answering the poll.", {
          variant: "error",
        });
        console.log(error);
      });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    let start = Date.now(); // perf log 1 of 4
    const tokenManager = TokenManager(navigate);
    await tokenManager.ensureToken();
    const url = process.env.REACT_APP_API_BASE_URL;
    await fetch(`${url}/api/comment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        PollId: pollId,
        Content: commentText,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        let stop = Date.now(); // perf log 2 of 4
        let split = stop - start; // perf log 3 of 4
        logPerformance("add comment", start, stop, split); // perf log 4 of 4
        enqueueSnackbar("Your answered the poll successfully.", {
          variant: "success",
        });
        navigate("/top-polls");
      })
      .catch((error) => {
        enqueueSnackbar("There was an error answering the poll.", {
          variant: "error",
        });
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchPoll = async (pollId) => {
      let start = Date.now(); // perf log 1 of 4
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken();
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
          logPerformance("get poll", start, stop, split); // perf log 4 of 4
          const data = Array.from(response);
          console.log("r poll", data[0]);
          setPoll(data[0]);
        });
    };

    const fetchPollOptions = async (pollId) => {
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken();
      const url = process.env.REACT_APP_API_BASE_URL;
      console.log(pollId);
      await fetch(`${url}/api/polloption/${pollId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("r options", response);
          setPollOptions(response);
          setAnswer(response[0].PollOptionId);
        })
        .catch((err) => console.log(err));
    };

    const fetchComments = async (pollId) => {
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken();
      const url = process.env.REACT_APP_API_BASE_URL;
      await fetch(`${url}/api/comment/${pollId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("r coments", response);
          setComments(response);
        });
    };

    fetchPoll(pollId);
    fetchPollOptions(pollId);
    fetchComments(pollId);
  }, [pollId, navigate]);

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div className="container mx-auto min-h-screen p-3">
        {new Date().toISOString() > poll.ExpirationDateTime ? (
          <div className="text-3xl text-center mt-8">
            This poll is now closed.
          </div>
        ) : (
          <div className="grid grid-cols-10 mb-2">
            <div className="col-span-7 block mb-2 text-lg">
              <form onSubmit={handleAnswer} className="max-w-lg mx-auto p-4">
                <div className="block mb-2 text-3xl">Question:</div>
                <div className="block mb-2 text-lg">{poll.QuestionText}</div>
                <div className="block mt-5 mb-2 text-2xl">Options:</div>
                <ul>
                  <div className="block mb-2 text-lg">
                    {pollOptions.map((option, index) => (
                      <li key={index} className="grid grid-cols-10 mb-2">
                        <input
                          id="answer"
                          name="answer"
                          type="radio"
                          value={answer}
                          onChange={(e) => {
                            setAnswer(option.PollOptionId);
                          }}
                          className="mt-1 col-span-1 w-full p-2 border text-black border-gray-300 rounded"
                          checked={answer === option.PollOptionId}
                        />
                        <label
                          className="col-span-9 block mb-2 text-lg"
                          htmlFor="answer"
                        >
                          <div>{option.OptionText}</div>
                        </label>
                      </li>
                    ))}
                  </div>
                </ul>
                <button
                  type="submit"
                  className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                  Answer Poll
                </button>
              </form>
              <form onSubmit={handleComment} className="max-w-lg mx-auto p-4">
                <div>
                  <div className="block mt-5 mb-2 text-3xl">Comments:</div>
                  {comments.length === 0 ? (
                    <div className="text-lg text-center mt-8">
                      There are no currently comments for this poll.
                    </div>
                  ) : (
                    <div>
                      <div className="block mb-2 text-lg text-center mb-2 grid grid-cols-10 ">
                        <div className="col-span-1 m-2">User</div>
                        <div className="col-span-3 m-2">Date</div>
                        <div className="col-span-6 m-2">Comment</div>
                      </div>

                      <ul>
                        <div className="block mb-2 text-lg mb-2 text-center">
                          {comments.map((comment, index) => (
                            <li
                              key={index}
                              className="grid grid-cols-10 m-1 border border-gray-300 rounded"
                            >
                              <div className="col-span-1 m-2">
                                {comment.UserId}
                              </div>
                              <div className="col-span-3 m-2">
                                {comment.CreatedDate.substring(0, 10)}
                              </div>
                              <div className="col-span-6 m-2 text-start">
                                {comment.Content}
                              </div>
                            </li>
                          ))}
                        </div>
                      </ul>
                    </div>
                  )}
                </div>
                <label
                  className="col-span-9 block mb-2 mt-5 text-2xl"
                  htmlFor="commentText"
                >
                  Add your comment:
                </label>
                <input
                  id="commentText"
                  name="commentText"
                  type="text"
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                  }}
                  className="mt-1 col-span-1 w-full p-2 border text-black border-gray-300 rounded"
                />
                <button
                  type="submit"
                  className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                  Submit Comment
                </button>
              </form>
            </div>
            <div className="col-span-3 block mb-2 text-lg">
              <TopPolls />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ParticipateInPoll;
