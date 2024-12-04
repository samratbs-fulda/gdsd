import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import React from "react";
import ListingDetailsPage from "./pages/ListingDetailsPage";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/listing/:listingid" element={<ListingDetailsPage />} />
      </Routes>
    </div>
  );
};

export default App;
