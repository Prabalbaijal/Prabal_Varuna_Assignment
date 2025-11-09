import React, { useState } from "react";
import api from "../../infrastructure/apiClient.ts";
import toast, { Toaster } from "react-hot-toast";

export default function BankingPage() {
  const [shipId, setShipId] = useState("R001");
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<number | null>(null);
  const [banked, setBanked] = useState<number | null>(null);

  async function loadCB() {
    const toastId = toast.loading("Loading compliance data...");
    try {
      const res = await api.get("/compliance/cb", { params: { shipId, year } });
      setCb(res.data.cb_before);
      const rec = await api.get("/banking/records", { params: { shipId, year } });
      setBanked(rec.data.banked);
      toast.success("Data loaded successfully!", { id: toastId });
    } catch (e: any) {
      toast.error(e.response?.data?.error ?? "Failed to load data", { id: toastId });
    }
  }

  async function bank(amountStr: string) {
    const amount = Number(amountStr);
    if (!amount) return toast.error("Enter a valid amount!");
    const toastId = toast.loading("Banking credits...");
    try {
      await api.post("/banking/bank", { shipId, year, amount });
      toast.success("Credits banked successfully!", { id: toastId });
      loadCB();
    } catch (e: any) {
      toast.error(e.response?.data?.error ?? e.message, { id: toastId });
    }
  }

  async function apply(amountStr: string) {
    const amount = Number(amountStr);
    if (!amount) return toast.error("Enter a valid amount!");
    const toastId = toast.loading("Applying credits...");
    try {
      await api.post("/banking/apply", { shipId, year, amount });
      toast.success("Credits applied successfully!", { id: toastId });
      loadCB();
    } catch (e: any) {
      toast.error(e.response?.data?.error ?? e.message, { id: toastId });
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-2xl font-bold mb-6 text-white">🏦 Banking Dashboard</h2>

      <div className="flex gap-3 mb-4">
        <input
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ship ID"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 text-gray-100 p-2 rounded w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Year"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition cursor-pointer"
          onClick={loadCB}
        >
          Load CB
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-md mb-4">
        <div className="mb-2">
          CB Before: <span className="font-semibold text-blue-400">{cb ?? "-"}</span>
        </div>
        <div>
          Banked: <span className="font-semibold text-green-400">{banked ?? "-"}</span>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          placeholder="Amount"
          id="bankAmt"
          className="bg-gray-800 border border-gray-700 text-gray-100 p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() =>
            bank((document.getElementById("bankAmt") as HTMLInputElement).value)
          }
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition cursor-pointer"
        >
          Bank
        </button>

        <input
          placeholder="Amount"
          id="applyAmt"
          className="bg-gray-800 border border-gray-700 text-gray-100 p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          onClick={() =>
            apply((document.getElementById("applyAmt") as HTMLInputElement).value)
          }
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition cursor-pointer "
        >
          Apply
        </button>
      </div>
    </div>
  );
}
