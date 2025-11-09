import React, { useEffect, useState } from "react";
import api from "../../infrastructure/apiClient.ts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import toast, { Toaster } from "react-hot-toast";

const TARGET = 89.3368;

export default function ComparePage() {
  const [rows, setRows] = useState<any[]>([]);
  const [baselineVal, setBaselineVal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const toastId = toast.loading("Loading comparison...");
    try {
      const res = await api.get("/routes/comparison", { params: { year: 2024 }});
      const baseline = res.data.baseline?.ghgIntensity ?? TARGET;
      setBaselineVal(baseline);
      const data = res.data.rows.map((r:any) => ({
        name: r.routeId,
        baseline,
        comparison: r.comparison,
        percentDiff: ((r.comparison / baseline) - 1) * 100,
        compliant: r.comparison <= TARGET
      }));
      setRows(data);
      toast.success("Comparison loaded!", { id: toastId });
    } catch (err:any) {
      console.error(err);
      toast.error("Failed to load comparison", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-6 text-white">📊 Routes Comparison (Target {TARGET})</h2>

      {/* Table Card */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="p-3 text-left">Route</th>
              <th className="p-3 text-center">Baseline</th>
              <th className="p-3 text-center">Comparison</th>
              <th className="p-3 text-center">% Diff</th>
              <th className="p-3 text-center">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  {loading ? "Loading..." : "No data found"}
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr
                  key={i}
                  className={`border-t border-gray-700 hover:bg-gray-700 transition ${r.compliant ? "" : "bg-red-900/30"}`}
                >
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="text-center">{r.baseline.toFixed(2)}</td>
                  <td className="text-center">{r.comparison.toFixed(2)}</td>
                  <td className={`text-center font-semibold ${r.percentDiff > 0 ? "text-red-400" : "text-green-400"}`}>
                    {r.percentDiff.toFixed(2)}%
                  </td>
                  <td className="text-center">{r.compliant ? "✅" : "❌"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Chart Card */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-white">GHG Intensity Comparison</h3>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={rows} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#f9fafb" }}
                formatter={(value:number) => value.toFixed(2)}
              />
              <Legend wrapperStyle={{ color: "#f9fafb" }} />
              <Bar dataKey="baseline" name="Baseline" fill="#3b82f6" radius={[4,4,0,0]}>
                <LabelList dataKey="baseline" position="top" formatter={(val:number)=>val.toFixed(1)} fill="#f9fafb"/>
              </Bar>
              <Bar dataKey="comparison" name="Comparison" fill="#10b981" radius={[4,4,0,0]}>
                <LabelList dataKey="comparison" position="top" formatter={(val:number)=>val.toFixed(1)} fill="#f9fafb"/>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
