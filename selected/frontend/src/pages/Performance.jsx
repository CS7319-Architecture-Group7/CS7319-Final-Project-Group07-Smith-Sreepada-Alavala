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

function Performance() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [poll, setPoll] = useState([]);
  const [pollOptions, setPollOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
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

  useEffect(() => {
    const fetchResults = async () => {
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken().catch((error) => {
        navigate("/login");
      });
      const url = process.env.REACT_APP_API_BASE_URL;
      await fetch(`${url}/performance`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          const data = response;
          console.log("results: ", data);
          data.forEach((item) => {
            console.log(item.message);
          });
          setResults([...data]);
        })
        .catch((error) => {
          // If error code is > 400, then redirect to login
          if (error.response && error.response.status > 400) {
            window.localStorage.clear();
            navigate("/login");
          }
        });
    };

    // const buildChartDataSet = async () => {
    //   console.log("here:");
    //   console.log(p);
    //   console.log(...o);
    //   console.log(...r);
    //   console.log(...c);
    //   let tempData = [];
    //   let hasVotes = [];
    //   o.forEach((opt) => {
    //     if (r.some((item, index) => item.OptionText === opt.OptionText)) {
    //       hasVotes.push(true);
    //     } else {
    //       hasVotes.push(false);
    //     }
    //   });

    //   let counter = 0;
    //   console.log("votes", ...hasVotes);
    //   for (let i = 0; i < hasVotes.length; i++) {
    //     if (hasVotes[i]) {
    //       console.log({
    //         name: o[i].OptionText.toString().substring(0, 13) + "...",
    //         value: r[counter].Votes,
    //       });
    //       tempData.push({
    //         id: i,
    //         name: o[i].OptionText.toString().substring(0, 13) + "...",
    //         value: r[counter].Votes,
    //       });
    //       counter++;
    //     } else {
    //       console.log({
    //         name: o[i].OptionText.toString().substring(0, 13) + "...",
    //         value: 0,
    //       });
    //       tempData.push({
    //         id: i,
    //         name: o[i].OptionText.toString().substring(0, 13) + "...",
    //         value: 0,
    //       });
    //     }
    //   }
    //   console.log("tempdata", tempData);
    //   setData([...tempData]);
    //   setLoading(false);
    // };
    fetchResults();
    // buildChartDataSet();
  }, []);

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div className="container mx-auto min-h-screen p-3">
        <div className="grid grid-cols-10 mb-2">
          <div className="col-span-7 block mb-2 text-lg">
            <div className="max-w-lg mx-auto p-4">
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Performance;
