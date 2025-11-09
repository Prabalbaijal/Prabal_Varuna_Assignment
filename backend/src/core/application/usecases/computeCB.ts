import prisma from "../../../../infrastructure/prismaClient.js"
import { computeCB, TARGET_INTENSITY } from "../../domain/compliance.js";

export async function computeCBForShip(routeId: string, year: number) {
  const route = await prisma.route.findUnique({ where: { routeId }});
  if (!route) throw new Error("Route not found");
  const cb = computeCB(TARGET_INTENSITY, route.ghgIntensity, route.fuelConsumption);
  await prisma.shipCompliance.create({ data: { shipId: routeId, year, cbGco2eq: cb }});
  return {cb_before: cb};
}
