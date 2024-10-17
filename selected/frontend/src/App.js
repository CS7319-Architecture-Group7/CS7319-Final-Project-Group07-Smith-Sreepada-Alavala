import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import ValidateOTP from './components/validate-otp';
import PollList from './components/poll-list';
import CreatePoll from './components/create-poll';
import UpdatePoll from './components/update-poll';
import About from './components/about';

const App = () => {
  return (
    //<BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/validate-otp" element={<ValidateOTP />} />
          <Route path="/polls" element={<PollList />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/update-poll" element={<UpdatePoll />} />
          <Route path="*" element={<About />} />
        </Routes>
      </div>
    //</BrowserRouter>
  );
}

export default App;
