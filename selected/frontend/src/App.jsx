import "./App.css";
import React, { useEffect } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Polls from "./pages/Polls";
import CreatePoll from "./pages/CreatePoll";
import UpdatePoll from "./pages/UpdatePoll";
import About from "./pages/About";
import Register from "./pages/Register";
import UserRoute from "./components/UserRoute";

const App = () => {
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
        <Route path="*" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
