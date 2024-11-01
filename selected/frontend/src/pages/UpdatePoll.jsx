import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TokenManager from "../services/tokenManagerService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSnackbar } from "notistack";

function UpdatePoll() {
  const location = useLocation();
  const pollId = location.state?.pollId;
  const [poll, setPoll] = useState([]);
  const [pollOptions, setPollOptions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([...pollOptions]);
  const [ids, setIds] = useState([]);
  const [expirationTime, setExpirationTime] = useState("");
  const [resultsVisible, setResultsVisible] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting");
    console.log(pollId);
    console.log(questionText);
    console.log(options);
    console.log(ids);
    console.log(expirationTime);
    console.log(resultsVisible);

    const tokenManager = TokenManager(navigate);
    await tokenManager.ensureToken();
    const url = "http://localhost:5001";
    await fetch(`${url}/api/poll`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        PollId: pollId,
        QuestionText: questionText,
        Options: options,
        Ids: ids,
        ExpirationTime: expirationTime,
        ResultsVisible: resultsVisible,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        enqueueSnackbar("Your poll was updated successfully.", {
          variant: "success",
        });
        navigate("/polls");
      })
      .catch((error) => {
        enqueueSnackbar("There was an error updating your poll.", {
          variant: "error",
        });
        console.log(error);
      });
  };

  useEffect(() => {
    let p;
    // let r = [];
    let o = [];
    let i = [];
    // let c = [];
    // const fetchResults = async (pollId) => {
    //   const tokenManager = TokenManager(navigate);
    //   await tokenManager.ensureToken();
    //   const url = "http://localhost:5001";
    //   await fetch(`${url}/api/results/${pollId}`, {
    //     method: "GET",
    //     credentials: "include",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((response) => {
    //       const data = response;
    //       console.log("results", data);
    //       r = [...data];
    //       setResults([...data]);
    //       fetchPoll(pollId);
    //     });
    // };

    const fetchPoll = async (pollId) => {
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken();
      const url = "http://localhost:5001";
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
          console.log("poll", response[0]);
          p = response[0];
          setPoll(response[0]);
          setQuestionText(p.QuestionText);
          setExpirationTime(p.ExpirationDateTime);
          fetchPollOptions(pollId);
        });
    };

    const fetchPollOptions = async (pollId) => {
      const tokenManager = TokenManager(navigate);
      await tokenManager.ensureToken();
      const url = "http://localhost:5001";
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
          console.log("options", response);
          setPollOptions(response);
          o = [...response];
          // setAnswer(response[0].PollOptionId);
          //          fetchComments(pollId);
          o = response.map((item) => item.OptionText);
          i = response.map((item) => item.PollOptionId);
          setOptions([...o]);
          setIds([...i]);
          console.log("these are the options:", ...o);
          console.log("these are the ids:", ...i);
        })
        .catch((err) => console.log(err));
    };

    // const fetchComments = async (pollId) => {
    //   const tokenManager = TokenManager(navigate);
    //   await tokenManager.ensureToken();
    //   const url = "http://localhost:5001";
    //   await fetch(`${url}/api/comment/${pollId}`, {
    //     method: "GET",
    //     credentials: "include",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((response) => {
    //       console.log("comments", response);
    //       setComments([...response]);
    //       c = [...response];
    //       setLoading(false);
    //       buildChartDataSet();
    //     });
    // };

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
    // fetchResults(pollId);
    fetchPoll(pollId);
  }, []);

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div className="container mx-auto min-h-screen">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
          <label className="block mb-2 text-lg">Question:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
          <label className="block mb-2 text-lg">Options:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              className="w-full p-2 border text-black border-gray-300 rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={() => setOptions([...options, ""])}
            className="mt-2 p-2 bg-green-500 text-white rounded"
          >
            Add Option
          </button>
          <label className="block m-2 text-lg">Expiration Time:</label>
          <input
            type="datetime-local"
            value={expirationTime}
            onChange={(e) => setExpirationTime(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
          <div className="mt-3 grid grid-cols-10">
            <input
              id="resultsVis"
              name="resultsVis"
              type="checkbox"
              defaultChecked={resultsVisible}
              value={resultsVisible}
              onChange={(e) => {
                setResultsVisible(!resultsVisible);
              }}
              className="mt-1 col-span-1 w-full p-2 border text-black border-gray-300 rounded"
            />{" "}
            <label
              className="col-span-9 block mb-2 text-lg"
              htmlFor="resultsVis"
            >
              Make results available to participants
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Update Poll
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default UpdatePoll;
