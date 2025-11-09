import { Router } from "express";
import { bankSurplus, applyBanked, getBankedAmount } from "../../../../core/application/usecases/banking.js";
const router = Router();

router.get("/records", async (req,res) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "shipId & year required" });
  const amt = await getBankedAmount(String(shipId), Number(year));
  res.json({ banked: amt });
});

router.post("/bank", async (req,res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || amount == null) return res.status(400).json({ error: "shipId, year, amount required" });
  try {
    const entry = await bankSurplus(String(shipId), Number(year), Number(amount));
    res.json(entry);
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/apply", async (req,res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || amount == null) return res.status(400).json({ error: "shipId, year, amount required" });
  try {
    const entry = await applyBanked(String(shipId), Number(year), Number(amount));
    res.json(entry);
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
