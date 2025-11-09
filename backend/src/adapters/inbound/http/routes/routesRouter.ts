import { Router } from "express";
import prisma from "../../../../../infrastructure/prismaClient.js"
const router = Router();

router.get("/", async (req,res) => {
  const { vesselType, fuelType, year } = req.query;
  const where: any = {};
  if (vesselType) where.vesselType = String(vesselType);
  if (fuelType) where.fuelType = String(fuelType);
  if (year) where.year = Number(year);
  const data = await prisma.route.findMany({ where });
  res.json(data);
});

router.post("/:routeId/baseline", async (req,res) => {
  const { routeId } = req.params;
  const route = await prisma.route.findUnique({ where: { routeId }});
  if (!route) return res.status(404).json({ error: "route not found" });
  await prisma.route.updateMany({ where: { year: route.year }, data: { isBaseline: false }});
  const updated = await prisma.route.update({ where: { routeId }, data: { isBaseline: true }});
  res.json(updated);
});

export default router;
