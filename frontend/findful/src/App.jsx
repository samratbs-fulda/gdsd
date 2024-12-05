import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import React from "react";
import Chat from "./pages/Chat/Chat";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
};

export default App;
