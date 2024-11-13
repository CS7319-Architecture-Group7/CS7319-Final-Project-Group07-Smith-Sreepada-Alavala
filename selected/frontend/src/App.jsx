import "./App.css";
import React, { useEffect } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Polls from "./pages/Polls";
import CreatePoll from "./pages/CreatePoll";
import UpdatePoll from "./pages/UpdatePoll";
import ParticpateInPoll from "./pages/ParticpateInPoll";
import Results from "./pages/Results";
import About from "./pages/About";
import Register from "./pages/Register";
import UserRoute from "./components/UserRoute";
import TopPollsPage from "./pages/TopPolls";

const App = () => {
  useEffect(() => {
    // Define the beforeunload event handler
    const handleBeforeUnload = (event) => {
      // Remove Local Storage
      // window.localStorage.clear();
    };

    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // Empty dependency array ensures it only runs once on mount/unmount

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/validate-otp" element={<ValidateOTP />} /> */}
        <Route
          path="/top-polls"
          element={
            <UserRoute>
              <TopPollsPage />
            </UserRoute>
          }
        />
        <Route
          path="/polls"
          element={
            <UserRoute>
              <Polls />
            </UserRoute>
          }
        />
        <Route
          path="/create-poll"
          element={
            <UserRoute>
              <CreatePoll />
            </UserRoute>
          }
        />
        <Route
          path="/update-poll"
          element={
            <UserRoute>
              <UpdatePoll />
            </UserRoute>
          }
        />
        <Route
          path="/participate"
          element={
            <UserRoute>
              <ParticpateInPoll />
            </UserRoute>
          }
        />
        <Route
          path="/results"
          element={
            <UserRoute>
              <Results />
            </UserRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
