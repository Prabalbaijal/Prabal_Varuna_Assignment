import prisma from "../../../../infrastructure/prismaClient.js";

export async function getBankedAmount(shipId: string, year: number) {
  const res = await prisma.bankEntry.aggregate({
    where: { shipId, year },
    _sum: { amountGco2eq: true }
  });
  return res._sum.amountGco2eq ?? 0;
}

export async function bankSurplus(shipId: string, year: number, amount: number) {
  if (amount <= 0) throw new Error("Amount must be positive");
  const existing = await prisma.shipCompliance.findFirst({ where: { shipId, year }, orderBy: { createdAt: "desc" }});
  const available = existing?.cbGco2eq ?? 0;
  if (available <= 0) throw new Error("No surplus available to bank");
  if (amount > available) throw new Error("Cannot bank more than available surplus");
  const entry = await prisma.bankEntry.create({ data: { shipId, year, amountGco2eq: amount }});
  return entry;
}

export async function applyBanked(shipId: string, year: number, amount: number) {
  const banked = await getBankedAmount(shipId, year);
  if (amount <= 0) throw new Error("Amount must be positive");
  if (amount > banked) throw new Error("Insufficient banked amount");
  const entry = await prisma.bankEntry.create({ data: { shipId, year, amountGco2eq: -amount }});
  return entry;
}
