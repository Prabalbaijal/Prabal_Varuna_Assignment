import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "../Components/Header";

interface Tab {
  label: string;
  path: string;
}

const tabs: Tab[] = [
  { label: "Routes", path: "/" },
  { label: "Compare", path: "/compare" },
  { label: "Banking", path: "/banking" },
  { label: "Pooling", path: "/pooling" },
];

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />

      <nav className="p-4 flex gap-2 bg-gray-800 shadow-inner rounded-b-lg flex justify-center">
        {tabs.map((t) => (
          <NavLink
            key={t.path}
            to={t.path}
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
