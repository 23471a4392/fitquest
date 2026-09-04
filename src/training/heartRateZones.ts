export interface HeartRateZone {
  zone: 1 | 2 | 3 | 4 | 5;
  name: string;
  minBpm: number;
  maxBpm: number;
  percentageRange: string;
  physiologicalBenefits: string;
  fuelSource: string;
}

export function calculateHeartRateZones(
  maxHeartRateBpm: number,
  restingHeartRateBpm = 60,
  method: 'karvonen' | 'percent_max' = 'karvonen'
): HeartRateZone[] {
  const zones: HeartRateZone[] = [];
  const ranges = [
    { zone: 1 as const, name: 'Active Recovery', minPct: 0.50, maxPct: 0.60, ben: 'Promotes blood circulation and metabolic waste clearance with zero fatigue.', fuel: '90% Fat / 10% Carbs' },
    { zone: 2 as const, name: 'Aerobic Base', minPct: 0.60, maxPct: 0.70, ben: 'Maximizes mitochondrial proliferation, capillary density, and stroke volume.', fuel: '75% Fat / 25% Carbs' },
    { zone: 3 as const, name: 'Tempo / Aerobic Power', minPct: 0.70, maxPct: 0.80, ben: 'Enhances glycogen storage capacity and steady-state pace sustainability.', fuel: '50% Fat / 50% Carbs' },
    { zone: 4 as const, name: 'Lactate Threshold', minPct: 0.80, maxPct: 0.90, ben: 'Improves muscular buffering capacity and shifts anaerobic threshold upward.', fuel: '20% Fat / 80% Carbs' },
    { zone: 5 as const, name: 'Anaerobic / VO2 Max', minPct: 0.90, maxPct: 1.00, ben: 'Maximizes peak oxygen uptake (VO2 max) and fast-twitch motor unit recruitment.', fuel: '95% Carbs / Phosphocreatine' },
  ];

  for (const r of ranges) {
    let minBpm = 0;
    let maxBpm = 0;

    if (method === 'karvonen') {
      const hrr = maxHeartRateBpm - restingHeartRateBpm;
      minBpm = Math.round(restingHeartRateBpm + (hrr * r.minPct));
      maxBpm = Math.round(restingHeartRateBpm + (hrr * r.maxPct));
    } else {
      minBpm = Math.round(maxHeartRateBpm * r.minPct);
      maxBpm = Math.round(maxHeartRateBpm * r.maxPct);
    }

    zones.push({
      zone: r.zone,
      name: r.name,
      minBpm,
      maxBpm,
      percentageRange: Math.round(r.minPct * 100) + '% - ' + Math.round(r.maxPct * 100) + '%',
      physiologicalBenefits: r.ben,
      fuelSource: r.fuel,
    });
  }

  return zones;
}
