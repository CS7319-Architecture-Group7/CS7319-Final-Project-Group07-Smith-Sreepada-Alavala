import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TokenManager from "../services/tokenManagerService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopPolls from "../components/TopPolls";
import { useSnackbar } from "notistack";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  //  CartesianGrid,
  Tooltip,
} from "recharts";
import { useAuth } from "../hooks/useAuth";
import { logPerformance } from "../services/performanceLoggingService";

function Results() {
  const location = useLocation();
  const pollId = location.state?.pollId;
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [poll, setPoll] = useState([]);
  const [pollOptions, setPollOptions] = useState([]);
  const [comments, setComments] = useState([]);
  //  const [answer, setAnswer] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [commentText, setCommentText] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const colors = [
    "#5a8b5d",
    "#bec991",
    "#907350",
    "#5f8971",
    "#36563e",
    "#eedfd7",
    "#dfb591",
    "#a15755",
    "#81272e",
    "#351d1b",
  ];

  const handleComment = async (e) => {
    e.preventDefault();
    let start = Date.now(); // perf log 1 of 4
    const tokenManager = TokenManager(navigate);
    await tokenManager.ensureToken().catch((error) => {
      navigate("/login");
    });
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
        //        console.log(response);
        let stop = Date.now(); // perf log 2 of 4
        let split = stop - start; // perf log 3 of 4
        logPerformance("add comment", start, stop, split); // perf log 4 of 4
        enqueueSnackbar("You commented on the poll successfully.", {
          variant: "success",
        });
        navigate("/polls");
      })
      .catch((error) => {
        enqueueSnackbar("There was an error commenting on the poll.", {
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
    let r = [];
    let o = [];
    let c = [];
    const fetchResults = async (pollId) => {
      let start = Date.now(); // perf log 1 of 4
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken().catch((error) => {
        navigate("/login");
      });
      const url = process.env.REACT_APP_API_BASE_URL;
      await fetch(`${url}/api/results/${pollId}`, {
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
          logPerformance("get results", start, stop, split); // perf log 4 of 4
          const data = response;
          console.log("results", data);
          r = [...data];
          setResults([...data]);
          fetchPoll(pollId);
        })
        .catch((error) => {
          // If error code is > 400, then redirect to login
          if (error.response && error.response.status > 400) {
            window.localStorage.clear();
            navigate("/login");
          }
        });
    };

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
          //          console.log("poll", response[0]);
          let stop = Date.now(); // perf log 2 of 4
          let split = stop - start; // perf log 3 of 4
          logPerformance("get single poll", start, stop, split); // perf log 4 of 4
          p = response[0];
          setPoll(response[0]);
          fetchPollOptions(pollId);
        })
        .catch((error) => {
          // If error code is > 400, then redirect to login
          if (error.response && error.response.status > 400) {
            window.localStorage.clear();
            navigate("/login");
          }
        });
    };

    const fetchPollOptions = async (pollId) => {
      let start = Date.now(); // perf log 1 of 4
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken().catch((error) => {
        navigate("/login");
      });
      const url = process.env.REACT_APP_API_BASE_URL;
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
          let stop = Date.now(); // perf log 2 of 4
          let split = stop - start; // perf log 3 of 4
          logPerformance("get options", start, stop, split); // perf log 4 of 4
          console.log("options", response);
          setPollOptions(response);
          o = [...response];
          // setAnswer(response[0].PollOptionId);
          fetchComments(pollId);
        })
        .catch((error) => {
          // If error code is > 400, then redirect to login
          if (error.response && error.response.status > 400) {
            window.localStorage.clear();
            navigate("/login");
          }
        });
    };

    const fetchComments = async (pollId) => {
      let start = Date.now(); // perf log 1 of 4
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken().catch((error) => {
        navigate("/login");
      });
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
          let stop = Date.now(); // perf log 2 of 4
          let split = stop - start; // perf log 3 of 4
          logPerformance("get comments", start, stop, split); // perf log 4 of 4
          console.log("comments", response);
          setComments([...response]);
          c = [...response];
          setLoading(false);
          buildChartDataSet();
        })
        .catch((error) => {
          // If error code is > 400, then redirect to login
          if (error.response && error.response.status > 400) {
            window.localStorage.clear();
            navigate("/login");
          }
        });
    };

    const buildChartDataSet = async () => {
      console.log("here:");
      console.log(p);
      console.log(...o);
      console.log(...r);
      console.log(...c);
      let tempData = [];
      let hasVotes = [];
      o.forEach((opt) => {
        if (r.some((item, index) => item.OptionText === opt.OptionText)) {
          hasVotes.push(true);
        } else {
          hasVotes.push(false);
        }
      });

      let counter = 0;
      console.log("votes", ...hasVotes);
      for (let i = 0; i < hasVotes.length; i++) {
        if (hasVotes[i]) {
          console.log({
            name: o[i].OptionText.toString().substring(0, 13) + "...",
            value: r[counter].Votes,
          });
          tempData.push({
            id: i,
            name: o[i].OptionText.toString().substring(0, 13) + "...",
            value: r[counter].Votes,
          });
          counter++;
        } else {
          console.log({
            name: o[i].OptionText.toString().substring(0, 13) + "...",
            value: 0,
          });
          tempData.push({
            id: i,
            name: o[i].OptionText.toString().substring(0, 13) + "...",
            value: 0,
          });
        }
      }
      console.log("tempdata", tempData);
      setData([...tempData]);
      setLoading(false);
    };
    fetchResults(pollId);
  }, []);

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div className="container mx-auto min-h-screen p-3">
        {/* {poll.ResultsVisible === 0 ? (
          <div className="text-3xl text-center mt-8">
            This creator of this has opted to keep the results confidential.
          </div>
        ) : ( */}
        <div className="grid grid-cols-10 mb-2">
          <div className="col-span-7 block mb-2 text-lg">
            <div className="max-w-lg mx-auto p-4">
              <div className="block mb-2 text-3xl">Results:</div>
              {poll.UserId}
              <div className="block mb-2 text-3xl">
                {loading ? (
                  <div>Some awesome chart will go here soon</div>
                ) : (
                  <div>
                    <BarChart width={700} height={300} data={data}>
                      <XAxis
                        dataKey="name"
                        stroke="#000000"
                        tick={{ fontSize: 17 }}
                      />
                      <YAxis allowDecimals={false} stroke="#000000" />
                      <Tooltip
                        contentStyle={{
                          color: "#000",
                          backgroundColor: "#555",
                        }}
                        cursor={{ fill: "#7777" }}
                      />
                      <Bar dataKey="value" fill="#000">
                        {data.map((entry, index) => (
                          <Cell key={entry.id} fill={colors[index % 20]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </div>
                )}
              </div>
              <div className="block mb-2 text-2xl">{poll.QuestionText}</div>
              {pollOptions.map((item, index) => (
                <div key={index}>
                  {item.OptionText}
                  {results.map((result) =>
                    result.OptionID === item.PollOptionId
                      ? " - " + result.Votes + " votes"
                      : null
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleComment} className="max-w-lg mx-auto p-4">
              <div>
                <div className="block mt-5 mb-2 text-3xl">Comments:</div>
                {comments.length === 0 ? (
                  <div className="text-lg text-center mt-8">
                    There are no currently comments for this poll.
                  </div>
                ) : (
                  <div>
                    <div className="block m-4 text-lg text-center grid grid-cols-10 ">
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
        {/* )} */}
      </div>
      <Footer />
    </div>
  );
}

export default Results;
