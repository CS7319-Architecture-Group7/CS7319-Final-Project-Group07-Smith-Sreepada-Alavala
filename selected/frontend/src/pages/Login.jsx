import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TokenManager from "../services/tokenManagerService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSnackbar } from "notistack";

import { useAuth } from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const { login, user } = useAuth();
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [codeSent, setCodeSent] = useState(false);
  const [passcode, setPasscode] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = process.env.REACT_APP_API_BASE_URL;
    await fetch(`${url}/login`, {
      method: "POST",
      credentails: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "User not found") {
          enqueueSnackbar("No user with that email.", { variant: "error" });
          navigate("/register", { state: { emailId: email } });
        }
        if (response.message === "Passcode sent to email") {
          setCodeSent(true);
          setId(response.id);
          enqueueSnackbar(
            "A on time passcode will be sent shortly to your email.",
            { variant: "success" }
          );
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        enqueueSnackbar("Login failed.", { variant: "error" });
      });
  };

  const handleValidateOTP = async (e) => {
    e.preventDefault();
    const url = process.env.REACT_APP_API_BASE_URL;
    await fetch(`${url}/validate_otp`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passcode }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.token) {
          TokenManager(navigate).saveToken(response.token);
          login({ email: email, id: id });
          enqueueSnackbar("You have logged in successfully.", {
            variant: "success",
          });

          navigate("/top-polls");
        } else {
          console.error("Validation failed:", response);
          enqueueSnackbar("Login failed.", { variant: "error" });
          return;
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        enqueueSnackbar("Login failed.", { variant: "error" });
      });
  };

  const handleRegister = async () => {
    navigate("/register", { state: { emailId: email } });
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (() => TokenManager(navigate).isTokenExpired(token) === true) {
      localStorage.setItem("user", null);
    }
    if (user) {
      navigate("/top-polls", { state: { emailId: email } });
    }
  }, []);

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="mb-5 text-center text-xl">
        <div className="text-8xl">Quick Polls</div>
        <div className="text-xl">Please log in or register</div>
      </div>
      <div className="container mx-auto min-h-screen">
        <form onSubmit={handleLogin} className="max-w-sm mx-auto p-4">
          <label className="block mb-2 text-lg">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded"
          />
          {codeSent === true ? (
            <></>
          ) : (
            <button
              type="submit"
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Login
            </button>
          )}
        </form>
        {codeSent ? (
          <form onSubmit={handleValidateOTP} className="max-w-sm mx-auto p-4">
            <label className="block mb-2 text-lg">One-time Passcode:</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full p-2 border text-black border-gray-300 rounded"
            />
            <button
              type="submit"
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </form>
        ) : (
          <></>
        )}
        <form onSubmit={handleRegister} className="max-w-sm mx-auto p-4">
          <label className="block mb-2 text-lg">New user?:</label>
          <button
            type="submit"
            className="mt-2 p-2 bg-blue-500 text-white rounded"
          >
            Register
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
