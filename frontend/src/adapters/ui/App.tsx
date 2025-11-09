import React, { useState } from "react";
import RoutesPage from "./pages/RoutesPage";
import ComparePage from "./pages/ComparePage";
import BankingPage from "./pages/BankingPage";
import PoolingPage from "./pages/PoolingPage";

export default function App() {
  const tabs = ["Routes", "Compare", "Banking", "Pooling"];
  const [active, setActive] = useState("Routes");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-4">
        <h1 className="text-2xl font-bold text-blue-400">FuelEU Compliance Dashboard</h1>
      </header>

      {/* Navigation Tabs */}
      <nav className="p-4 flex gap-2 bg-gray-800 shadow-inner rounded-b-lg">
        {tabs.map(t => (
          <button
            key={t}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              active === t
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
            }`}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {active === "Routes" && <RoutesPage />}
        {active === "Compare" && <ComparePage />}
        {active === "Banking" && <BankingPage />}
        {active === "Pooling" && <PoolingPage />}
      </main>
    </div>
  );
}
