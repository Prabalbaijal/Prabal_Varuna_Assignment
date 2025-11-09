import React, { useEffect, useState } from "react";
import api from "../../infrastructure/apiClient.ts";
import type { Route } from "../../../core/domain/types.ts";
import toast, { Toaster } from "react-hot-toast";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filters, setFilters] = useState({ vesselType: "", fuelType: "", year: "" });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    fetchRoutes();
  }, [page]);

  async function fetchRoutes() {
    setLoading(true);
    const toastId = toast.loading("Fetching routes...");
    try {
      const res = await api.get("/routes", {
        params: { ...filters, page, limit: pageSize },
      });
      setRoutes(res.data.data);
      setTotalPages(res.data.totalPages);
      toast.success("Routes loaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load routes", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function setBaseline(routeId: string) {
    const toastId = toast.loading("Setting baseline...");
    try {
      await api.post(`/routes/${routeId}/baseline`);
      toast.success("Baseline set successfully!", { id: toastId });
      fetchRoutes();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to set baseline", { id: toastId });
    }
  }

  function handleFilterApply() {
    setPage(1);
    fetchRoutes();
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-gray-200">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-3xl font-bold mb-6 text-blue-400">🚢 Routes Dashboard</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 bg-gray-800 p-4 rounded-xl shadow-md">
        <input
          placeholder="Vessel Type"
          className="border border-gray-700 rounded-lg p-2 w-48 bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.vesselType}
          onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value }))}
        />
        <input
          placeholder="Fuel Type"
          className="border border-gray-700 rounded-lg p-2 w-48 bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.fuelType}
          onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value }))}
        />
        <input
          placeholder="Year"
          className="border border-gray-700 rounded-lg p-2 w-32 bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.year}
          onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
        />
        <button
          onClick={handleFilterApply}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Loading..." : "Apply Filters"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-xl">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="p-3 text-left w-32">Route ID</th>
              <th className="p-3 text-left w-24">Vessel</th>
              <th className="p-3 text-left w-24">Fuel</th>
              <th className="p-3 text-right w-16">Year</th>
              <th className="p-3 text-right w-28">GHG Intensity</th>
              <th className="p-3 text-right w-24">Fuel (t)</th>
              <th className="p-3 text-right w-24">Distance</th>
              <th className="p-3 text-right w-24">Emissions</th>
              <th className="p-3 text-center w-28"></th>
            </tr>
          </thead>

          <tbody>
            {routes?.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-400">
                  {loading ? "Loading routes..." : "No routes found"}
                </td>
              </tr>
            ) : (
              routes?.map(r => (
                <tr
                  key={r.id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="p-3 font-medium text-blue-300">{r.routeId}</td>
                  <td className="p-3">{r.vesselType}</td>
                  <td className="p-3">{r.fuelType}</td>
                  <td className="p-3 text-right">{r.year}</td>
                  <td className="p-3 text-right">{r.ghgIntensity}</td>
                  <td className="p-3 text-right">{r.fuelConsumption}</td>
                  <td className="p-3 text-right">{r.distance}</td>
                  <td className="p-3 text-right">{r.totalEmissions}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setBaseline(r.routeId)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition cursor-pointer"
                    >
                      Set Baseline
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
            <button
              key={pNum}
              onClick={() => setPage(pNum)}
              className={`px-3 py-1 rounded-lg ${
                pNum === page ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600 cursor-pointer"
              }`}
            >
              {pNum}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
