import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import React from "react";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </div>
  );
};

export default App;
