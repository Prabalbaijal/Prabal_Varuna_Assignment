import prisma from "../../../../infrastructure/prismaClient.js";

export async function createPool(year: number, members: { shipId: string, cbBefore: number }[]) {
  const sum = members.reduce((s,m) => s + m.cbBefore, 0);
  if (sum < -1e-6) throw new Error(`Total pool CB must be >= 0, got ${sum}`);


  const items = members.map(m => ({ ...m, cbAfter: m.cbBefore }));
  items.sort((a,b) => b.cbAfter - a.cbAfter);

  for (let i=0;i<items.length;i++) {
    if (items[i]!.cbAfter <= 0) continue;
    for (let j=items.length-1;j>=0 && items[i]!.cbAfter>0;j--) {
      if (i===j) continue;
      if (items[j]!.cbAfter >= 0) continue;
      const needed = Math.abs(items[j]!.cbAfter);
      const transfer = Math.min(items[i]!.cbAfter, needed);
      items[i]!.cbAfter -= transfer;
      items[j]!.cbAfter += transfer;
    }
  }

  for (const m of items) {
    if (m.cbBefore > 0 && m.cbAfter < 0) throw new Error("Surplus ship ended negative");
    if (m.cbBefore < 0 && m.cbAfter < m.cbBefore) throw new Error("Deficit ship got worse");
  }

  const pool = await prisma.pool.create({
    data: {
      year,
      members: { create: items.map(it => ({ shipId: it.shipId, cbBefore: it.cbBefore, cbAfter: it.cbAfter })) }
    },
    include: { members: true }
  });

  return { poolId: pool.id, members: items };
}
