import { Router } from "express";
import { computeCBForShip } from "../../../../core/application/usecases/computeCB.js";
const router = Router();

router.get("/cb", async (req,res) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "shipId & year required" });
  try {
    const cb = await computeCBForShip(String(shipId), Number(year));
    res.json(cb);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/adjusted-cb", async (req,res) => {
  // For simplicity return latest CB and banked amount combined
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "shipId & year required" });
  const ship = String(shipId);
  const yr = Number(year);
  const latestCB = await (await import("../../../../../infrastructure/prismaClient.js")).default.shipCompliance.findFirst({ where: { shipId: ship, year: yr }, orderBy: { createdAt: "desc" }});
  const bankedAggregate = await (await import("../../../../../infrastructure/prismaClient.js")).default.bankEntry.aggregate({ where: { shipId: ship, year: yr }, _sum: { amountGco2eq: true }});
  const cb_before = latestCB?.cbGco2eq ?? 0;
  const banked = bankedAggregate._sum.amountGco2eq ?? 0;
  const adjusted = cb_before + banked;
  res.json({ cb_before, banked, adjusted_cb: adjusted });
});

export default router;
