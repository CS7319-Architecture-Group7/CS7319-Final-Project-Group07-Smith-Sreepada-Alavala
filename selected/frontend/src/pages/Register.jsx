import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSnackbar } from "notistack";

const Register = () => {
  const location = useLocation();
  // const emailId = location.state?.emailId || "";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState(location.state?.emailId || "");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:5001";
    let bodyContent = {
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
    };
    console.log("Sending email");
    await fetch(`${url}/register`, {
      method: "POST",
      credentails: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyContent), //JSON.stringify(firstName, lastName, emailId),
    })
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar("You registered successfully.", {
            variant: "success",
          });
          navigate("/login");
        }
      })
      .catch((error) => {
        enqueueSnackbar("Registration failed.", { variant: "error" });
        console.error("Registration failed:", error);
      });
  };

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="container mx-auto min-h-screen">
        <h2>Welcome! - Please register.</h2>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
          <div>
            <label className="block mb-2">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-2 border text-black border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-2 border text-black border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
              className="w-full p-2 border text-black border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Register
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
