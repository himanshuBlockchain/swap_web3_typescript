import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home";
import LimitPage from "../pages/Limit";
import SwapPage from "../pages/Swap";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/swap" element={<SwapPage />} />
        <Route path="/limit" element={<LimitPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
