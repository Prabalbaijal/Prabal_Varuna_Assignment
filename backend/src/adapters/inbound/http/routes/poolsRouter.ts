import { Router } from "express";
import { createPool } from "../../../../core/application/usecases/pooling.js";
const router = Router();

router.post("/", async (req,res) => {
  const { year, members } = req.body;
  if (!year || !members) return res.status(400).json({ error: "year & members required" });
  try {
    const result = await createPool(Number(year), members);
    res.json(result);
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
