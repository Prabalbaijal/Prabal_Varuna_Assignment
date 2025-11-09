import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../Layouts/DashboardLayout"
import RoutesPage from "../pages/RoutesPage";
import ComparePage from "../pages/ComparePage";
import BankingPage from "../pages/BankingPage";
import PoolingPage from "../pages/PoolingPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RoutesPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="banking" element={<BankingPage />} />
        <Route path="pooling" element={<PoolingPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
