export interface CameraState {
  x: number;
  y: number;
  fovMultiplier: number;
  shakeMagnitude: number;
}

export function updateCameraSpring(
  currentCam: CameraState,
  targetPlayerX: number,
  isBoosting: boolean,
  dt: number
): CameraState {
  const springSpeed = 12.0;
  const newX = currentCam.x + (targetPlayerX - currentCam.x) * Math.min(1.0, dt * springSpeed);
  const targetFOV = isBoosting ? 1.25 : 1.0;
  const newFOV = currentCam.fovMultiplier + (targetFOV - currentCam.fovMultiplier) * Math.min(1.0, dt * 6);

  return {
    x: newX,
    y: currentCam.y,
    fovMultiplier: newFOV,
    shakeMagnitude: Math.max(0, currentCam.shakeMagnitude - dt * 20),
  };
}
