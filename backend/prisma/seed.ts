import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ⚙️ Formula reminder (from your compliance.js):
// CB = (TARGET_INTENSITY - actualIntensity) * energyInScopeMJ(fuelConsumptionT)
// TargetIntensity = 89.3368

async function main() {
  const routes = [
    // Surplus ship (lower GHG intensity)
    {
      routeId: "R001",
      vesselType: "Container",
      fuelType: "LNG",
      year: 2024,
      ghgIntensity: 85.0, // < target
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 4500,
      isBaseline: true,
    },
    // Another surplus ship (low GHG)
    {
      routeId: "R002",
      vesselType: "BulkCarrier",
      fuelType: "LNG",
      year: 2024,
      ghgIntensity: 87.0, // < target
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
    },
    // Deficit ship (high GHG)
    {
      routeId: "R003",
      vesselType: "Tanker",
      fuelType: "HFO",
      year: 2024,
      ghgIntensity: 93.0, // > target
      fuelConsumption: 5100,
      distance: 12500,
      totalEmissions: 4700,
    },
    // Slightly deficit ship
    {
      routeId: "R004",
      vesselType: "RoRo",
      fuelType: "HFO",
      year: 2024,
      ghgIntensity: 91.5, // > target
      fuelConsumption: 4900,
      distance: 11800,
      totalEmissions: 4300,
    },
  ];

  for (const r of routes) {
    await prisma.route.upsert({
      where: { routeId: r.routeId },
      update: r,
      create: r,
    });
  }

  console.log("New balanced routes seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
