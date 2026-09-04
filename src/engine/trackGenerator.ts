export interface TrackSegment {
  segmentIndex: number;
  curvature: number;
  elevation: number;
  hasObstacle: boolean;
  obstacleLane: -1 | 0 | 1;
  foodType?: 'healthy' | 'junk';
  foodLane?: -1 | 0 | 1;
}

export function generateTrackSegments(totalDistanceMeters: number): TrackSegment[] {
  const segments: TrackSegment[] = [];
  const segmentCount = Math.floor(totalDistanceMeters / 25);

  for (let i = 0; i < segmentCount; i++) {
    const curve = Math.sin(i * 0.15) * 0.3;
    const elev = Math.sin(i * 0.08) * 5;
    const hasObs = i > 4 && Math.random() < 0.35;
    const obsLane = (Math.floor(Math.random() * 3) - 1) as -1 | 0 | 1;

    segments.push({
      segmentIndex: i,
      curvature: curve,
      elevation: elev,
      hasObstacle: hasObs,
      obstacleLane: obsLane,
      foodType: Math.random() < 0.65 ? 'healthy' : 'junk',
      foodLane: (Math.floor(Math.random() * 3) - 1) as -1 | 0 | 1,
    });
  }

  return segments;
}
