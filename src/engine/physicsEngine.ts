export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface PhysicsBody {
  position: Vector3;
  velocity: Vector3;
  acceleration: Vector3;
  mass: number;
  friction: number;
  isGrounded: boolean;
}

export function createPhysicsBody(initialPos: Vector3): PhysicsBody {
  return {
    position: { ...initialPos },
    velocity: { x: 0, y: 0, z: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
    mass: 1.0,
    friction: 0.92,
    isGrounded: true,
  };
}

export function updatePhysics(body: PhysicsBody, dtSeconds: number, gravity = -9.81): void {
  // Apply gravity if airborne
  if (!body.isGrounded) {
    body.velocity.y += gravity * dtSeconds * 12;
  }

  // Update positions
  body.position.x += body.velocity.x * dtSeconds;
  body.position.y += body.velocity.y * dtSeconds;
  body.position.z += body.velocity.z * dtSeconds;

  // Ground collision check
  if (body.position.y <= 0) {
    body.position.y = 0;
    body.velocity.y = 0;
    body.isGrounded = true;
  } else {
    body.isGrounded = false;
  }

  // Apply lateral friction
  body.velocity.x *= Math.pow(body.friction, dtSeconds * 60);
}
