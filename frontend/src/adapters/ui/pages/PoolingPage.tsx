import React, { useEffect, useState } from "react";
import api from "../../infrastructure/apiClient.ts";
import type { Route } from "../../../core/domain/types.ts";
import toast, { Toaster } from "react-hot-toast";

export default function PoolingPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [year, setYear] = useState(2024);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  async function loadRoutes() {
    const toastId = toast.loading("Loading routes...");
    try {
      const res = await api.get("/routes", { params: { year } });
      setRoutes(res.data.data);
      toast.success("Routes loaded successfully!", { id: toastId });
    } catch (e: any) {
      toast.error(e.response?.data?.error ?? "Failed to load routes", { id: toastId });
    }
  }

  function toggle(routeId: string) {
    setSelected((s) => ({ ...s, [routeId]: !s[routeId] }));
  }

  async function buildMembers() {
    const checked = Object.entries(selected).filter(([_, v]) => v);
    if (checked.length === 0) {
      toast.error("Select at least one route!");
      return [];
    }

    const toastId = toast.loading("Fetching compliance data...");
    try {
      const members = await Promise.all(
        checked.map(async ([routeId]) => {
          const r = await api.get("/compliance/cb", {
            params: { shipId: routeId, year },
          });
          return { shipId: routeId, cbBefore: r.data.cb_before };
        })
      );
      toast.success("Members ready!", { id: toastId });
      return members;
    } catch (e: any) {
      toast.error("Error fetching CB data", { id: toastId });
      return [];
    }
  }

  async function createPool() {
    const members = await buildMembers();
    if (members.length === 0) return;

    const toastId = toast.loading("Creating pool...");
    try {
      const res = await api.post("/pools", { year, members });
      setResult(res.data);
      toast.success("Pool created successfully!", { id: toastId });
    } catch (e: any) {
      toast.error(e.response?.data?.error ?? "Failed to create pool", { id: toastId });
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-2xl font-bold mb-6 text-white">🧩 Pooling Dashboard</h2>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-gray-300">
          Year:{" "}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 text-gray-100 p-2 rounded w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <button
          onClick={loadRoutes}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition cursor-pointer"
        >
          Reload
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {routes.length === 0 ? (
          <div className="col-span-2 text-center text-gray-400">No routes found</div>
        ) : (
          routes.map((r) => (
            <div
              key={r.routeId}
              className={`p-3 rounded-xl flex justify-between items-center border ${
                selected[r.routeId]
                  ? "bg-blue-700 border-blue-500"
                  : "bg-gray-800 border-gray-700"
              } transition hover:border-blue-400`}
            >
              <div>
                <div className="font-semibold text-white">
                  {r.routeId} — {r.vesselType}
                </div>
                <div className="text-sm text-gray-400">GHG: {r.ghgIntensity}</div>
              </div>
              <input
                type="checkbox"
                checked={!!selected[r.routeId]}
                onChange={() => toggle(r.routeId)}
                className="w-5 h-5 accent-blue-500 cursor-pointer"
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition cursor-pointer"
          onClick={createPool}
        >
          Create Pool
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-md">
          <h3 className="font-semibold text-blue-400 mb-2">
            Pool Result (ID: {result.poolId})
          </h3>
          <pre className="text-sm bg-gray-900 p-3 rounded-lg text-gray-300 overflow-auto max-h-64">
            {JSON.stringify(result.members, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
