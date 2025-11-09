import React, { useEffect, useState } from "react";
import api from "../../infrastructure/apiClient.ts";
import type { Route } from "../../../core/domain/types.ts";

export default function PoolingPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [year, setYear] = useState(2024);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    api.get("/routes", { params: { year } }).then(res => {
      setRoutes(res.data);
    });
  }, [year]);

  function toggle(routeId: string) {
    setSelected(s => ({ ...s, [routeId]: !s[routeId] }));
  }

  function buildMembers() {
    // For demo: get cb_before by calling computeCB endpoint for each selected
    return Promise.all(Object.entries(selected).filter(([k,v]) => v).map(async ([routeId]) => {
      const r = await api.get("/compliance/cb", { params: { shipId: routeId, year }});
      return { shipId: routeId, cbBefore: r.data.cb_before };
    }));
  }

  async function createPool() {
    const members = await buildMembers();
    const res = await api.post("/pools", { year, members });
    setResult(res.data);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Pooling</h2>

      <div className="mb-4">
        <label>Year: <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border p-1 w-28" /></label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {routes.map(r => (
          <div key={r.routeId} className="bg-white p-2 border flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.routeId} — {r.vesselType}</div>
              <div className="text-sm">GHG: {r.ghgIntensity}</div>
            </div>
            <input type="checkbox" checked={!!selected[r.routeId]} onChange={() => toggle(r.routeId)} />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={createPool}>Create Pool</button>
      </div>

      {result && (
        <div className="mt-4 bg-white p-3">
          <h3 className="font-semibold">Pool Result (id: {result.poolId})</h3>
          <pre className="text-sm">{JSON.stringify(result.members, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
