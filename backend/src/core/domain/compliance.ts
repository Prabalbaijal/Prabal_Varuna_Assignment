export const TARGET_INTENSITY = 89.3368; // gCO2e/MJ

export function energyInScopeMJ(fuelConsumptionT: number): number {
  return fuelConsumptionT * 41000;
}

export function computeCB(targetIntensity: number, actualIntensity: number, fuelConsumptionT: number): number {
  const energy = energyInScopeMJ(fuelConsumptionT);
  const diff = (targetIntensity - actualIntensity);
  return diff * energy;
}

export function percentDiff(baseline: number, comparison: number): number {
  if (baseline === 0) return comparison === 0 ? 0 : Infinity;
  return ((comparison / baseline) - 1) * 100;
}
