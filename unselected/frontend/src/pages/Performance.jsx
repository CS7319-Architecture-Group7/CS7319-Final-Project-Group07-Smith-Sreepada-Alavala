import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TokenManager from "../services/tokenManagerService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  //  CartesianGrid,
  Tooltip,
} from "recharts";

function Performance() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [chart1Nums, setChart1Nums] = useState([]);
  const [chart2Nums, setChart2Nums] = useState([]);
  const [loading, setLoading] = useState(true);

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
    "#7a6a4f",
    "#8b7d6b",
  ];

  useEffect(() => {
    let rawData = [];
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
          rawData = response;
          //console.log("results: ", rawData);
          // rawData.forEach((item) => {
          //   console.log("this: ", item.message);
          // });
          //          setResults([...data]);
          buildChartData();
        })
        .catch((error) => {
          // If error code is > 400, then redirect to login
          if (error.response && error.response.status > 400) {
            window.localStorage.clear();
            navigate("/login");
          } else {
            console.log(error);
          }
        });
    };

    const buildChartData = async () => {
      let cat1 = "Client-Server";
      let cat2 = "Publish-subscribe";
      let options = [
        "createPoll",
        "addComment",
        "answerPoll",
        "getTopPolls",
        "getPolls",
        "getPollById",
        "getOptions",
        "getAnswers",
        "getComments",
        "getResults",
        "updatePoll",
        "deletePoll",
      ];
      let res1counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let res1totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let res1avgs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let res2counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let res2totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let res2avgs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let dataObjects1 = [];
      let dataObjects2 = [];
      rawData.forEach((item) => {
        // parse
        let stringArray = item.message.split(",");
        if (stringArray[0] === "from: Client-server") {
          switch (stringArray[1]) {
            case " method: create poll": {
              res1counts[0]++;
              res1totals[0] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: add comment": {
              res1counts[1]++;
              res1totals[1] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: answer poll": {
              res1counts[2]++;
              res1totals[2] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get top polls": {
              res1counts[3] = res1counts[3] + 1;
              res1totals[3] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get polls": {
              res1counts[4]++;
              res1totals[4] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get single poll": {
              res1counts[5]++;
              res1totals[5] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get options": {
              res1counts[6]++;
              res1totals[6] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get poll answers": {
              res1counts[7]++;
              res1totals[7] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get comments": {
              res1counts[8]++;
              res1totals[8] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get results": {
              res1counts[9]++;
              res1totals[9] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: update poll": {
              res1counts[10]++;
              res1totals[10] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: delete poll": {
              res1counts[11]++;
              res1totals[11] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            default: {
            }
          }
        } else {
          switch (stringArray[1]) {
            case "method: create poll": {
              res2counts[0]++;
              res2totals[0] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: add comment": {
              res2counts[1]++;
              res2totals[1] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: answer poll": {
              res2counts[2]++;
              res2totals[2] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get top polls": {
              res2counts[3]++;
              res2totals[3] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get polls": {
              res2counts[4]++;
              res2totals[4] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get single poll": {
              res2counts[5]++;
              res2totals[5] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get options": {
              res2counts[6]++;
              res2totals[6] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get poll answers": {
              res2counts[7]++;
              res2totals[7] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get comments": {
              res2counts[8]++;
              res2totals[8] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: get results": {
              res2counts[9]++;
              res2totals[9] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: update poll": {
              res2counts[10]++;
              res2totals[10] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            case " method: delete poll": {
              res2counts[11]++;
              res2totals[11] += parseInt(stringArray[2].split(" ")[2]);
              break;
            }
            default: {
            }
          }
        }
      });
      for (let i = 0; i < 12; i++) {
        if (res1counts[i] != 0) {
          res1avgs[i] = (res1totals[i] / res1counts[i]).toFixed(2);
        } else {
          res1avgs[i] = 0;
        }
        if (res2counts[i] != 0) {
          res2avgs[i] = (res2totals[i] / res2counts[i]).toFixed(2);
        } else {
          res2avgs[i] = 0;
        }
        dataObjects1.push({
          id: i,
          name: options[i],
          value: parseFloat(res1avgs[i]),
        });
        dataObjects2.push({
          id: i,
          name: options[i],
          value: parseFloat(res2avgs[i]),
        });
      }
      console.log(dataObjects1);
      console.log(...dataObjects2);
      //{id: 0, name: "Honeysuckle...", value: 0}
      setChart1Nums(dataObjects1);
      setChart2Nums(dataObjects2);
    };

    fetchResults();
    setLoading(false);
  }, []);

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      {console.log("this - ", chart1Nums)}{" "}
      <div className="container min-h-screen p-3">
        <div className="block mb-2 text-2xl mx-auto ">
          {loading ? (
            <div>
              <div>Some awesome chart will go here soon</div>
            </div>
          ) : (
            <div>
              <div className="text-center mx-auto text-5xl">
                Average Response Times by Architecture
              </div>
              <div className="text-center mx-auto text-xl">Milliseconds</div>
              <div className="px-20">Client-Server Architecture:</div>
              <div className="m-5 p-5">
                <BarChart
                  width={1400}
                  height={300}
                  data={chart1Nums}
                  margin={{
                    top: 50,
                    right: 0,
                    left: 0,
                    bottom: 50,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#000000"
                    tick={{ fontSize: 13 }}
                    textAnchor="end"
                    scaleToFit="true"
                    verticalAnchor="start"
                    interval={0}
                    angle="-45"
                  />
                  <YAxis allowDecimals={false} stroke="#000000" />
                  <Tooltip
                    contentStyle={{
                      color: "#000",
                      backgroundColor: "#555",
                    }}
                    cursor={{ fill: "#7777" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#000"
                    label={{ stroke: "#fff", position: "top" }}
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.id} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </div>
              <div className="px-20">Publish-Subscribe Architecture:</div>
              <div className="m-5 p-5">
                <BarChart
                  width={1400}
                  height={300}
                  data={chart2Nums}
                  margin={{
                    top: 50,
                    right: 0,
                    left: 0,
                    bottom: 50,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#000000"
                    tick={{ fontSize: 13 }}
                    textAnchor="end"
                    scaleToFit="true"
                    verticalAnchor="start"
                    interval={0}
                    angle="-45"
                  />
                  <YAxis allowDecimals={false} stroke="#000000" />
                  <Tooltip
                    contentStyle={{
                      color: "#000",
                      backgroundColor: "#555",
                    }}
                    cursor={{ fill: "#7777" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#000"
                    label={{ stroke: "#fff", position: "top" }}
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.id} fill={colors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Performance;
