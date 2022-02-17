import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Donors } from "./donors";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Donors />} path="/donors" />
      <Route element={<span>Hi</span>} path="/" />
    </Routes>
  );
}
