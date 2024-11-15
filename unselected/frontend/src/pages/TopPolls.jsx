import React, { useEffect, useState } from "react";
import TokenManager from "../services/tokenManagerService";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaVoteYea } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { logPerformance } from "../services/performanceLoggingService";

function TopPollsPage() {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState(polls);
  const navigate = useNavigate();
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

  // const chartOptions = {
  //   layout: "horizontal", // This makes the chart horizontal
  // };

  const filterPolls = (term) => {
    let newList = [];
    if (polls.length !== 0) {
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

    if (
      poll !== undefined &&
      poll.Answers !== undefined &&
      poll.Answers.length > 0
    ) {
      poll.Answers.forEach((answer) => {
        if (poll.PollId === answer.PollId) {
          total++;
        }
      });
    }
    return total;
  };

  useEffect(() => {
    const fetchTopNPolls = async () => {
      let start = Date.now(); // perf log 1 of 4
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken().catch((error) => { navigate("/login"); });
      const url = process.env.REACT_APP_UNSELECTED_API_BASE_URL;
      await fetch(`${url}/api/pollpopular/10`, {
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
          logPerformance("get top polls", start, stop, split); // perf log 4 of 4
          const data = Array.from(response);

          // Generate chart data for each poll
          data.forEach(async (poll) => {
            poll.ChartData = await getChartDataSet(poll);
          });

          console.log(data);

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

    const getChartDataSet = async (poll) => {
      if (
        poll === undefined ||
        poll.Options === undefined ||
        poll.Answers === undefined
      )
        return [];
      let chartData = [];

      for (let i = 0; i < poll.Options.length; i++) {
        chartData.push({
          id: i,
          name:
            poll.Options[i].OptionText.length > 7
              ? poll.Options[i].OptionText.toString().substring(0, 7) + "..."
              : poll.Options[i].OptionText.toString(),
          value: poll.Answers.filter(
            (item) => item.OptionId === poll.Options[i].PollOptionId
          ).length,
        });
      }

      return chartData;
    };

    fetchTopNPolls();

    ///////////////////////////////////////////////////////////////
    ////////// Client Server Architecture implementation //////////
    ////////// Check for latest polls every 10 seconds /////////////
    ///////////////////////////////////////////////////////////////
    const intervalId = setInterval(fetchTopNPolls, 10000); // Fetch data every 10 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

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
        <div className="text-5xl m-4">Top 10 Polls:</div>
        <div className="grid grid-cols-12 text-xl text-center underline mb-3">
          <div className="col-span-2">Poll Question</div>
          <div className="col-span-1">Responses</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Participate</div>
          <div className="col-span-7">Report</div>
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
                <div className="grid grid-cols-12 text-center">
                  <div className="col-span-2">{poll.QuestionText}</div>
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
                  <div className="col-span-7">
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart
                        data={poll.ChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <YAxis
                          type="number"
                          dataKey="value"
                          allowDecimals={false}
                          stroke="#000000"
                        />
                        <XAxis
                          type="category"
                          dataKey="name"
                          stroke="#000000"
                          tick={{ fontSize: 17 }}
                        />
                        <Tooltip
                          contentStyle={{
                            color: "#000",
                            backgroundColor: "#555",
                          }}
                          cursor={{ fill: "#7777" }}
                        />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
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

export default TopPollsPage;
