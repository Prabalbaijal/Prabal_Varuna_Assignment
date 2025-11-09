import React, { useState } from "react";
import api from "../../infrastructure/apiClient.ts";

export default function BankingPage() {
  const [shipId, setShipId] = useState("R001");
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<number | null>(null);
  const [banked, setBanked] = useState<number | null>(null);

  async function loadCB() {
    const res = await api.get("/compliance/cb", { params: { shipId, year }});
    setCb(res.data.cb_before);
    const rec = await api.get("/banking/records", { params: { shipId, year }});
    setBanked(rec.data.banked);
  }

  async function bank(amountStr: string) {
    const amount = Number(amountStr);
    try {
      await api.post("/banking/bank", { shipId, year, amount });
      alert("Banked");
      loadCB();
    } catch (e:any) {
      alert(e.response?.data?.error ?? e.message);
    }
  }

  async function apply(amountStr: string) {
    const amount = Number(amountStr);
    try {
      await api.post("/banking/apply", { shipId, year, amount });
      alert("Applied");
      loadCB();
    } catch (e:any) {
      alert(e.response?.data?.error ?? e.message);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Banking</h2>
      <div className="flex gap-2 mb-3">
        <input value={shipId} onChange={e => setShipId(e.target.value)} className="border p-1" />
        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border p-1 w-28" />
        <button className="bg-blue-500 text-white px-3 rounded" onClick={loadCB}>Load CB</button>
      </div>
      <div className="bg-white p-3">
        <div>CB Before: {cb ?? "-"}</div>
        <div>Banked: {banked ?? "-"}</div>
      </div>

      <div className="mt-3 flex gap-2">
        <input placeholder="amount" id="bankAmt" className="border p-1" />
        <button onClick={() => bank((document.getElementById("bankAmt") as HTMLInputElement).value)} className="bg-green-500 text-white px-3 rounded">Bank</button>
        <input placeholder="amount" id="applyAmt" className="border p-1" />
        <button onClick={() => apply((document.getElementById("applyAmt") as HTMLInputElement).value)} className="bg-yellow-600 text-white px-3 rounded">Apply</button>
      </div>
    </div>
  );
}
