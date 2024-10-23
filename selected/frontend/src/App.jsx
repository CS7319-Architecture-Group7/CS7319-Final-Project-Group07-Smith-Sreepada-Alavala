import "./App.css";
import React from "react";
import { AuthProvider } from "./hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
//import ValidateOTP from "./components/validate-otp";
import Polls from "./pages/Polls";
import CreatePoll from "./pages/CreatePoll";
import UpdatePoll from "./pages/UpdatePoll";
import About from "./pages/About";
//import Register from "./components/register";
import SplashPage from "./pages/SplashPage";
import UserRoute from "./components/UserRoute";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} />
          <Route path="/validate-otp" element={<ValidateOTP />} /> */}
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
        <Route path="*" element={<SplashPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
