import prisma from "../../../../infrastructure/prismaClient.js";
import { percentDiff } from "../../domain/compliance.js";

export async function computeComparison(year: number) {
  const baseline = await prisma.route.findFirst({ where: { year, isBaseline: true }});
  if (!baseline) throw new Error("No baseline for year " + year);
  const others = await prisma.route.findMany({ where: { year, NOT: { id: baseline.id } }});
  const rows = others.map(o => ({
    routeId: o.routeId,
    baseline: baseline.ghgIntensity,
    comparison: o.ghgIntensity,
    percentDiff: percentDiff(baseline.ghgIntensity, o.ghgIntensity),
    compliant: o.ghgIntensity <= baseline.ghgIntensity * 0.98 // fallback
  }));
  return { baseline, rows };
}
