export interface BoundingBox3D {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export function check3DCollision(boxA: BoundingBox3D, boxB: BoundingBox3D): boolean {
  return (
    boxA.minX <= boxB.maxX &&
    boxA.maxX >= boxB.minX &&
    boxA.minY <= boxB.maxY &&
    boxA.maxY >= boxB.minY &&
    boxA.minZ <= boxB.maxZ &&
    boxA.maxZ >= boxB.minZ
  );
}
