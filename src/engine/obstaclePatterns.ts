export interface ObstaclePattern {
  name: string;
  lanes: (-1 | 0 | 1)[];
  spacingZ: number;
  requiresJump: boolean;
}

export const OBSTACLE_PATTERNS: ObstaclePattern[] = [
  { name: 'Double Lane Pinch', lanes: [-1, 1], spacingZ: 0, requiresJump: false },
  { name: 'Slalom Zig-Zag', lanes: [-1, 0, 1], spacingZ: 25, requiresJump: false },
  { name: 'Center Roadblock Hurdle', lanes: [0], spacingZ: 0, requiresJump: true },
  { name: 'Triple Hazard Wave', lanes: [-1, 0, 1], spacingZ: 20, requiresJump: true },
];

export function getRandomPattern(): ObstaclePattern {
  return OBSTACLE_PATTERNS[Math.floor(Math.random() * OBSTACLE_PATTERNS.length)];
}
