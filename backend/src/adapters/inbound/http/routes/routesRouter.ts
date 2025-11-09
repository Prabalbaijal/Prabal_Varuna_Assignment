import { Router } from "express";
import prisma from "../../../../../infrastructure/prismaClient.js"
import { computeComparison } from "../../../../core/application/usecases/computeComparison.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const { vesselType, fuelType, year, page = "1", limit = "10" } = req.query;

    // Filtering
    const where: any = {};
    if (vesselType) where.vesselType = String(vesselType);
    if (fuelType) where.fuelType = String(fuelType);
    if (year) where.year = Number(year);

    // Pagination params
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Total count (for frontend page numbers)
    const totalCount = await prisma.route.count({ where });

    // Fetch paginated data
    const data = await prisma.route.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { routeId: "asc" }, // optional, define order
    });

    res.json({
      data,
      page: pageNumber,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


router.post("/:routeId/baseline", async (req,res) => {
  const { routeId } = req.params;
  const route = await prisma.route.findUnique({ where: { routeId }});
  if (!route) return res.status(404).json({ error: "route not found" });
  await prisma.route.updateMany({ where: { year: route.year }, data: { isBaseline: false }});
  const updated = await prisma.route.update({ where: { routeId }, data: { isBaseline: true }});
  res.json(updated);
});

router.get("/comparison", async (req, res) => {
  const { year } = req.query;
  if (!year) return res.status(400).json({ error: "year is required" });

  try {
    const data = await computeComparison(Number(year));
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


export default router;
