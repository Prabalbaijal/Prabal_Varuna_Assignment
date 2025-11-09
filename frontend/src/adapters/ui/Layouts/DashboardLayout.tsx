import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { name: "Routes", path: "/routes" },
  { name: "Compare", path: "/compare" },
  { name: "Banking", path: "/banking" },
  { name: "Pooling", path: "/pooling" },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow p-4">
        <h1 className="text-xl font-bold">FuelEU Compliance Dashboard</h1>
      </header>

      <nav className="p-4 flex gap-2 bg-gray-800">
        {tabs.map((t) => (
          <NavLink
            key={t.name}
            to={t.path}
            className={({ isActive }) =>
              `px-3 py-1 rounded ${isActive ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"}`
            }
          >
            {t.name}
          </NavLink>
        ))}
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
