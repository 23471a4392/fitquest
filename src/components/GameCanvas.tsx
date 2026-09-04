import React, { useEffect, useRef, useState, useCallback } from 'react';
import type {
  ActivePowerUp,
  FloatingText,
  FoodItemDefinition,
  GameSettings,
  Lane,
  LevelConfig,
  ObstacleDefinition,
  PlayerProfile,
  PowerUpDefinition,
  SpawnedEntity,
} from '../types/game';
import { HEALTHY_FOODS, JUNK_FOODS, OBSTACLES, POWER_UPS } from '../data/gameConstants';
import { soundEngine } from '../utils/audioSystem';
import { simulateWeightChange } from '../utils/gameLogic';
import confetti from 'canvas-confetti';

interface GameCanvasProps {
  player: PlayerProfile;
  level: LevelConfig;
  settings: GameSettings;
  isPaused: boolean;
  onStatsUpdate: (stats: {
    currentWeight: number;
    health: number;
    energy: number;
    score: number;
    distance: number;
    activePowerUps: ActivePowerUp[];
    healthyCount: number;
    junkCount: number;
    obstaclesCount: number;
    powerUpsCount: number;
  }) => void;
  onGoalReached: (finalStats: {
    finalWeight: number;
    finalHealth: number;
    distanceCovered: number;
    healthyFoods: number;
    junkFoods: number;
    obstaclesHit: number;
    powerUps: number;
    timeElapsedSeconds: number;
  }) => void;
  onGameOver: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  player,
  level,
  settings,
  isPaused,
  onStatsUpdate,
  onGoalReached,
  onGameOver,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game running state
  const stateRef = useRef({
    playerLane: 0 as Lane,
    visualLane: 0,
    isJumping: false,
    jumpStartTime: 0,
    jumpDuration: 650,
    currentWeight: player.currentWeightKg,
    health: 100,
    energy: 100,
    score: 0,
    distance: 0,
    speedMultiplier: 1.0,
    slowUntil: 0,
    activePowerUps: [] as ActivePowerUp[],
    hasShield: false,
    healthyCount: 0,
    junkCount: 0,
    obstaclesCount: 0,
    powerUpsCount: 0,
    entities: [] as SpawnedEntity[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    nextEntityId: 1,
    nextSpawnDistance: 35,
    startTime: Date.now(),
    lastFrameTime: performance.now(),
    isFinished: false,
    screenShakeUntil: 0,
  });

  const [touchActiveLane, setTouchActiveLane] = useState<Lane>(0);

  // Handle Lane switches
  const switchLane = useCallback((direction: 'left' | 'right') => {
    const s = stateRef.current;
    if (s.isFinished) return;
    if (direction === 'left' && s.playerLane > -1) {
      s.playerLane = (s.playerLane - 1) as Lane;
      soundEngine.playLaneSwitch();
      setTouchActiveLane(s.playerLane);
    } else if (direction === 'right' && s.playerLane < 1) {
      s.playerLane = (s.playerLane + 1) as Lane;
      soundEngine.playLaneSwitch();
      setTouchActiveLane(s.playerLane);
    }
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.isFinished || s.isJumping) return;
    s.isJumping = true;
    s.jumpStartTime = performance.now();
    soundEngine.playJump();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || stateRef.current.isFinished) return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        switchLane('left');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        switchLane('right');
      } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, switchLane, jump]);

  // Touch Swipe controls
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0 || isPaused) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 35) switchLane('right');
        else if (dx < -35) switchLane('left');
      } else {
        // Vertical swipe
        if (dy < -35) jump();
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [isPaused, switchLane, jump]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const spawnEntity = (currentDist: number) => {
      const s = stateRef.current;
      const lane = (Math.floor(Math.random() * 3) - 1) as Lane;
      const rand = Math.random();

      // Determine entity type based on level probabilities
      if (rand < level.obstacleFrequency) {
        // Spawn obstacle
        const obstacle = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
        s.entities.push({
          id: s.nextEntityId++,
          lane,
          z: 100,
          kind: 'obstacle',
          data: obstacle,
        });
      } else if (rand < level.obstacleFrequency + 0.12) {
        // Spawn power-up
        const powerUp = POWER_UPS[Math.floor(Math.random() * POWER_UPS.length)];
        s.entities.push({
          id: s.nextEntityId++,
          lane,
          z: 100,
          kind: 'power_up',
          data: powerUp,
        });
      } else {
        // Spawn Food (Healthy vs Junk)
        const isHealthy = Math.random() < 0.58;
        const foodList = isHealthy ? HEALTHY_FOODS : JUNK_FOODS;
        const food = foodList[Math.floor(Math.random() * foodList.length)];
        s.entities.push({
          id: s.nextEntityId++,
          lane,
          z: 100,
          kind: isHealthy ? 'healthy_food' : 'junk_food',
          data: food,
        });
      }

      // Next spawn spaced out
      const spawnGap = Math.max(16, 28 - level.id * 2);
      s.nextSpawnDistance = currentDist + spawnGap + Math.random() * 8;
    };

    const triggerConfetti = () => {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#84cc16', '#a3e635', '#10b981', '#f59e0b', '#ffffff'],
        });
      } catch {
        // ignore
      }
    };

    const addParticles = (x: number, y: number, color: string, count = 12) => {
      const s = stateRef.current;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        s.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          color,
          size: 3 + Math.random() * 4,
          alpha: 1,
          life: 0,
          maxLife: 25 + Math.random() * 15,
        });
      }
    };

    const addFloatingText = (text: string, color: string, x: number, y: number) => {
      stateRef.current.floatingTexts.push({
        id: Math.random(),
        text,
        color,
        x,
        y,
        opacity: 1,
        scale: 1.2,
        createdAt: performance.now(),
      });
    };

    const render = (time: number) => {
      const s = stateRef.current;
      const dt = Math.min(50, time - s.lastFrameTime) / 1000;
      s.lastFrameTime = time;

      if (!isPaused && !s.isFinished) {
        // Base running velocity
        let speed = level.baseSpeed * s.speedMultiplier;
        if (time < s.slowUntil) {
          speed *= 0.6;
        }
        if (settings.difficulty === 'pro') speed *= 1.2;
        if (settings.difficulty === 'casual') speed *= 0.85;

        // Advance distance (meters)
        s.distance += speed * dt;

        // Energy passive burn (recharged by foods/water)
        s.energy = Math.max(10, s.energy - dt * 1.5);

        // Smooth visual lane interpolation
        s.visualLane += (s.playerLane - s.visualLane) * Math.min(1, dt * 15);

        // Jump physics
        let jumpHeight = 0;
        if (s.isJumping) {
          const elapsed = time - s.jumpStartTime;
          if (elapsed >= s.jumpDuration) {
            s.isJumping = false;
          } else {
            const progress = elapsed / s.jumpDuration;
            jumpHeight = Math.sin(progress * Math.PI) * 75; // parabolic arc
          }
        }

        // Clean expired active powerups
        const now = Date.now();
        s.activePowerUps = s.activePowerUps.filter((p) => p.expiresAt > now);
        s.hasShield = s.activePowerUps.some((p) => p.type === 'shield');
        s.speedMultiplier = s.activePowerUps.some((p) => p.type === 'apple' || p.type === 'boost') ? 1.3 : 1.0;

        // Spawning items
        if (s.distance < level.targetDistanceMeters - 60 && s.distance >= s.nextSpawnDistance) {
          spawnEntity(s.distance);
        }

        // Check Goal Completion
        if (s.distance >= level.targetDistanceMeters && !s.isFinished) {
          s.isFinished = true;
          soundEngine.playGoalReached();
          triggerConfetti();
          const elapsedSec = Math.round((Date.now() - s.startTime) / 1000);
          onGoalReached({
            finalWeight: s.currentWeight,
            finalHealth: s.health,
            distanceCovered: Math.min(level.targetDistanceMeters, s.distance),
            healthyFoods: s.healthyCount,
            junkFoods: s.junkCount,
            obstaclesHit: s.obstaclesCount,
            powerUps: s.powerUpsCount,
            timeElapsedSeconds: elapsedSec,
          });
          return;
        }

        // Update entities z-position
        const entitySpeed = (speed / 12) * 50; // visual speed factor
        for (let i = s.entities.length - 1; i >= 0; i--) {
          const entity = s.entities[i];
          entity.z -= entitySpeed * dt;

          // Collision detection near player (z between 2 and 14)
          if (!entity.collected && entity.z <= 13 && entity.z >= 1) {
            const laneDiff = Math.abs(s.visualLane - entity.lane);
            if (laneDiff < 0.42) {
              entity.collected = true;

              if (entity.kind === 'healthy_food') {
                const food = entity.data as FoodItemDefinition;
                s.healthyCount++;
                s.score += food.scoreDelta;
                s.health = Math.min(100, s.health + food.healthDelta);
                s.energy = Math.min(100, s.energy + food.energyDelta);
                s.currentWeight = simulateWeightChange(
                  s.currentWeight,
                  player.targetWeightKg,
                  player.fitnessGoal,
                  true,
                  food.weightDelta
                );

                soundEngine.playHealthyCollect();
                addParticles(canvas.width / 2 + entity.lane * 130, canvas.height * 0.72, '#84cc16', 15);
                addFloatingText(
                  `+${food.scoreDelta} 🥗 Healthy Boost! (${food.weightDelta}kg)`,
                  '#a3e635',
                  canvas.width / 2 + entity.lane * 110,
                  canvas.height * 0.68
                );
              } else if (entity.kind === 'junk_food') {
                const food = entity.data as FoodItemDefinition;
                s.junkCount++;
                s.score = Math.max(0, s.score + food.scoreDelta);
                s.health = Math.max(0, s.health + food.healthDelta);
                s.energy = Math.max(0, s.energy + food.energyDelta);
                s.currentWeight = simulateWeightChange(
                  s.currentWeight,
                  player.targetWeightKg,
                  player.fitnessGoal,
                  false,
                  food.weightDelta
                );
                s.slowUntil = time + 800; // brief sluggishness

                soundEngine.playJunkCollect();
                addParticles(canvas.width / 2 + entity.lane * 130, canvas.height * 0.72, '#ef4444', 12);
                addFloatingText(
                  `Junk Crash! ${food.weightDelta > 0 ? '+' : ''}${food.weightDelta}kg`,
                  '#f87171',
                  canvas.width / 2 + entity.lane * 110,
                  canvas.height * 0.68
                );

                if (s.health <= 0) {
                  s.isFinished = true;
                  onGameOver();
                  return;
                }
              } else if (entity.kind === 'obstacle') {
                const obstacle = entity.data as ObstacleDefinition;

                // Check if jumping over or shield active
                if (s.hasShield) {
                  // Shield absorbs hit!
                  s.activePowerUps = s.activePowerUps.filter((p) => p.type !== 'shield');
                  s.hasShield = false;
                  soundEngine.playShieldBlock();
                  addParticles(canvas.width / 2 + entity.lane * 130, canvas.height * 0.72, '#38bdf8', 18);
                  addFloatingText('🛡️ SHIELD BLOCKED IMPACT!', '#6ee7b7', canvas.width / 2, canvas.height * 0.6);
                } else if (s.isJumping && jumpHeight > 35) {
                  // Safely vaulted over!
                  s.score += 50;
                  addFloatingText('⚡ Obstacle Cleared! +50', '#a3e635', canvas.width / 2, canvas.height * 0.55);
                } else {
                  // Direct Collision hit
                  s.obstaclesCount++;
                  s.health = Math.max(0, s.health - obstacle.healthPenalty);
                  s.energy = Math.max(0, s.energy - obstacle.energyPenalty);
                  s.score = Math.max(0, s.score - obstacle.scorePenalty);
                  s.slowUntil = time + obstacle.slowDurationMs;
                  s.screenShakeUntil = time + 300;

                  soundEngine.playObstacleHit();
                  addParticles(canvas.width / 2 + entity.lane * 130, canvas.height * 0.72, '#f97316', 20);
                  addFloatingText(
                    `💥 Hit ${obstacle.name}! -${obstacle.healthPenalty} HP`,
                    '#fb7185',
                    canvas.width / 2 + entity.lane * 110,
                    canvas.height * 0.65
                  );

                  if (s.health <= 0) {
                    s.isFinished = true;
                    onGameOver();
                    return;
                  }
                }
              } else if (entity.kind === 'power_up') {
                const powerUp = entity.data as PowerUpDefinition;
                s.powerUpsCount++;
                s.score += powerUp.scoreBonus;
                s.health = Math.min(100, s.health + powerUp.healthBonus);
                s.energy = Math.min(100, s.energy + powerUp.energyBonus);

                s.activePowerUps.push({
                  type: powerUp.type,
                  name: powerUp.name,
                  emoji: powerUp.emoji,
                  expiresAt: Date.now() + powerUp.durationMs,
                });

                soundEngine.playPowerUp();
                addParticles(canvas.width / 2 + entity.lane * 130, canvas.height * 0.72, '#38bdf8', 18);
                addFloatingText(
                  `⭐ ${powerUp.name}! +${powerUp.scoreBonus}`,
                  '#34d399',
                  canvas.width / 2 + entity.lane * 110,
                  canvas.height * 0.65
                );
              }
            }
          }

          // Remove entities that have passed the camera
          if (entity.z < -8) {
            s.entities.splice(i, 1);
          }
        }

        // Notify parent HUD of stats
        onStatsUpdate({
          currentWeight: s.currentWeight,
          health: s.health,
          energy: s.energy,
          score: s.score,
          distance: s.distance,
          activePowerUps: s.activePowerUps,
          healthyCount: s.healthyCount,
          junkCount: s.junkCount,
          obstaclesCount: s.obstaclesCount,
          powerUpsCount: s.powerUpsCount,
        });
      }

      // --- CANVAS RENDERING (2.5D Perspective Athletic Track) ---
      const W = canvas.width;
      const H = canvas.height;

      ctx.save();

      // Screen Shake effect on impact
      if (time < s.screenShakeUntil) {
        const shakeMag = 6;
        ctx.translate((Math.random() - 0.5) * shakeMag * 2, (Math.random() - 0.5) * shakeMag * 2);
      }

      // 1. Sky & Horizon Gradient (Athletic deep emerald / obsidian)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.45);
      skyGrad.addColorStop(0, '#061a12');
      skyGrad.addColorStop(0.5, '#0b261b');
      skyGrad.addColorStop(1, '#113324');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H * 0.45);

      // Distant athletic stadium lights / mountain silhouettes
      ctx.fillStyle = '#081e15';
      ctx.beginPath();
      ctx.moveTo(0, H * 0.45);
      for (let x = 0; x <= W; x += 60) {
        const mh = Math.sin(x * 0.015) * 25 + 20;
        ctx.lineTo(x, H * 0.45 - mh);
      }
      ctx.lineTo(W, H * 0.45);
      ctx.closePath();
      ctx.fill();

      // Glowing horizon line (Electric lime pulse)
      ctx.strokeStyle = 'rgba(132, 204, 22, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.45);
      ctx.lineTo(W, H * 0.45);
      ctx.stroke();

      // 2. Athletic Running Track in Perspective
      const horizonY = H * 0.45;
      const bottomY = H;
      const roadHorizonWidth = W * 0.28;
      const roadBottomWidth = W * 0.94;

      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, bottomY);
      roadGrad.addColorStop(0, '#10221a');
      roadGrad.addColorStop(1, '#173024');

      // Draw Main Road Surface
      ctx.fillStyle = roadGrad;
      ctx.beginPath();
      ctx.moveTo(W / 2 - roadHorizonWidth / 2, horizonY);
      ctx.lineTo(W / 2 + roadHorizonWidth / 2, horizonY);
      ctx.lineTo(W / 2 + roadBottomWidth / 2, bottomY);
      ctx.lineTo(W / 2 - roadBottomWidth / 2, bottomY);
      ctx.closePath();
      ctx.fill();

      // Track borders (Electric Lime athletic turf strip)
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(W / 2 - roadHorizonWidth / 2, horizonY);
      ctx.lineTo(W / 2 - roadBottomWidth / 2, bottomY);
      ctx.moveTo(W / 2 + roadHorizonWidth / 2, horizonY);
      ctx.lineTo(W / 2 + roadBottomWidth / 2, bottomY);
      ctx.stroke();

      // Dynamic scrolling ground stripes (Speed feel)
      const stripeOffset = (s.distance * 12) % 60;
      ctx.lineWidth = 2;
      for (let zOffset = stripeOffset; zOffset < 400; zOffset += 50) {
        const normZ = zOffset / 400; // 0 (near) to 1 (far)
        const curY = bottomY - normZ * (bottomY - horizonY);
        const curWidth = roadBottomWidth - normZ * (roadBottomWidth - roadHorizonWidth);
        ctx.strokeStyle = `rgba(163, 230, 53, ${0.12 * (1 - normZ)})`;
        ctx.beginPath();
        ctx.moveTo(W / 2 - curWidth / 2, curY);
        ctx.lineTo(W / 2 + curWidth / 2, curY);
        ctx.stroke();
      }

      // Lane Divider Dashed Lines (-0.33 and +0.33)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.setLineDash([15, 25]);
      ctx.lineDashOffset = -(s.distance * 8) % 40;

      // Left divider
      ctx.beginPath();
      ctx.moveTo(W / 2 - roadHorizonWidth * 0.17, horizonY);
      ctx.lineTo(W / 2 - roadBottomWidth * 0.17, bottomY);
      ctx.stroke();

      // Right divider
      ctx.beginPath();
      ctx.moveTo(W / 2 + roadHorizonWidth * 0.17, horizonY);
      ctx.lineTo(W / 2 + roadBottomWidth * 0.17, bottomY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 3. Goal Finish Banner if near target distance
      const distToGoal = level.targetDistanceMeters - s.distance;
      if (distToGoal <= 120 && distToGoal >= -20) {
        const goalZ = (distToGoal / 120) * 100;
        const normZ = Math.max(0, Math.min(100, goalZ)) / 100;
        const archY = horizonY + (1 - normZ) * (bottomY - horizonY) - 50 * (1 - normZ);
        const archW = (roadHorizonWidth + (1 - normZ) * (roadBottomWidth - roadHorizonWidth)) * 1.1;

        // Finish Arch Pillars
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(W / 2 - archW / 2 - 10, archY - 60, 16, 90);
        ctx.fillRect(W / 2 + archW / 2 - 6, archY - 60, 16, 90);

        // Checkered Arch Banner
        ctx.fillStyle = '#84cc16';
        ctx.fillRect(W / 2 - archW / 2, archY - 70, archW, 28);

        ctx.fillStyle = '#0f1715';
        ctx.font = `bold ${Math.max(12, Math.round(18 * (1 - normZ)))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('🏁 FINISH GOAL 🏁', W / 2, archY - 50);
      }

      // 4. Render Spawned Entities (Sorted by Z descending for depth)
      const sortedEntities = [...s.entities].sort((a, b) => b.z - a.z);

      for (const entity of sortedEntities) {
        if (entity.collected) continue;
        const normZ = entity.z / 100; // 1 (far) to 0 (near)
        if (normZ > 1 || normZ < -0.1) continue;

        // Scale & Perspective Projection
        const progress = 1 - normZ; // 0 at horizon, 1 at bottom
        const curY = horizonY + Math.pow(progress, 1.4) * (bottomY - horizonY);
        const curRoadW = roadHorizonWidth + progress * (roadBottomWidth - roadHorizonWidth);
        const laneX = W / 2 + (entity.lane * curRoadW) / 3;
        const itemScale = 0.4 + progress * 0.9;

        ctx.save();
        ctx.translate(laneX, curY - 20 * progress);
        ctx.scale(itemScale, itemScale);

        // Ground shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 15, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Entity visual icon & aura
        if (entity.kind === 'healthy_food') {
          const food = entity.data as FoodItemDefinition;
          // Green glowing aura
          ctx.shadowColor = '#84cc16';
          ctx.shadowBlur = 15;
          ctx.font = '32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(food.emoji, 0, -10);

          // Mini badge
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(132, 204, 22, 0.85)';
          ctx.beginPath();
          ctx.arc(14, -24, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#061a12';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('+', 14, -24);
        } else if (entity.kind === 'junk_food') {
          const food = entity.data as FoodItemDefinition;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
          ctx.font = '32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(food.emoji, 0, -10);

          // Weight icon indicator
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
          ctx.beginPath();
          ctx.arc(14, -24, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px sans-serif';
          ctx.fillText('▲', 14, -24);
        } else if (entity.kind === 'obstacle') {
          const obstacle = entity.data as ObstacleDefinition;
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 14;
          ctx.font = '34px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(obstacle.emoji, 0, -12);

          // Danger caution ring
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, -12, 22, 0, Math.PI * 2);
          ctx.stroke();
        } else if (entity.kind === 'power_up') {
          const powerUp = entity.data as PowerUpDefinition;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 20;
          ctx.font = '36px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(powerUp.emoji, 0, -14);

          // Golden star burst ring
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, -14, 24, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 5. Render Animated Vector Runner Character
      const playerY = bottomY - 65;
      const playerCurW = roadBottomWidth;
      const playerX = W / 2 + (s.visualLane * playerCurW) / 3;

      let currentJumpY = 0;
      if (s.isJumping) {
        const elapsed = time - s.jumpStartTime;
        const progress = Math.min(1, elapsed / s.jumpDuration);
        currentJumpY = Math.sin(progress * Math.PI) * 75;
      }

      ctx.save();
      ctx.translate(playerX, playerY - currentJumpY);

      // Player Ground Shadow (Stays on the ground when jumping)
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.15, 0.45 - currentJumpY / 150)})`;
      ctx.beginPath();
      const shadowW = Math.max(16, 38 - currentJumpY / 3);
      ctx.ellipse(0, currentJumpY + 38, shadowW, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Active Shield Bubble (if equipped)
      if (s.hasShield) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Speed boost trails
      if (s.speedMultiplier > 1.1) {
        ctx.fillStyle = 'rgba(163, 230, 53, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 25, 45, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Runner Cycle Angles (Sinusoidal swing)
      const runCycle = Math.sin(time * 0.018 * s.speedMultiplier);
      const legLeftAngle = runCycle * 0.65;
      const legRightAngle = -runCycle * 0.65;
      const armLeftAngle = -runCycle * 0.7;
      const armRightAngle = runCycle * 0.7;

      // Legs (Athletic Charcoal & Neon Lime shoes)
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1e2925';

      // Left Leg
      ctx.beginPath();
      ctx.moveTo(-7, 12);
      ctx.lineTo(-7 + Math.sin(legLeftAngle) * 22, 34);
      ctx.stroke();
      // Left Shoe (Neon Lime)
      ctx.fillStyle = '#a3e635';
      ctx.beginPath();
      ctx.arc(-7 + Math.sin(legLeftAngle) * 22 + 2, 35, 5, 0, Math.PI * 2);
      ctx.fill();

      // Right Leg
      ctx.beginPath();
      ctx.moveTo(7, 12);
      ctx.lineTo(7 + Math.sin(legRightAngle) * 22, 34);
      ctx.stroke();
      // Right Shoe (Neon Lime)
      ctx.fillStyle = '#a3e635';
      ctx.beginPath();
      ctx.arc(7 + Math.sin(legRightAngle) * 22 + 2, 35, 5, 0, Math.PI * 2);
      ctx.fill();

      // Torso / Athletic Fit Top (Electric Lime & Slate)
      ctx.fillStyle = '#84cc16';
      ctx.beginPath();
      ctx.roundRect(-15, -16, 30, 30, 8);
      ctx.fill();

      // Athletic Chest Stripe (Emerald)
      ctx.fillStyle = '#065f46';
      ctx.fillRect(-15, -6, 30, 6);

      // Arms
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#a3e635';

      // Left Arm
      ctx.beginPath();
      ctx.moveTo(-15, -10);
      ctx.lineTo(-15 + Math.sin(armLeftAngle) * 18, 5);
      ctx.stroke();

      // Right Arm
      ctx.beginPath();
      ctx.moveTo(15, -10);
      ctx.lineTo(15 + Math.sin(armRightAngle) * 18, 5);
      ctx.stroke();

      // Head & Athletic Sweatband
      ctx.fillStyle = '#fed7aa'; // Skin tone
      ctx.beginPath();
      ctx.arc(0, -28, 12, 0, Math.PI * 2);
      ctx.fill();

      // Sweatband (Bright Forest Green)
      ctx.fillStyle = '#059669';
      ctx.fillRect(-11, -34, 22, 5);

      // Hair (Dark warm brown)
      ctx.fillStyle = '#3f2212';
      ctx.beginPath();
      ctx.arc(0, -32, 11, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 6. Render Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife) {
          s.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 7. Render Floating HUD Texts
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        const age = (time - ft.createdAt) / 1000;
        if (age > 1.4) {
          s.floatingTexts.splice(i, 1);
          continue;
        }

        ft.y -= 35 * dt;
        ft.opacity = Math.max(0, 1 - age / 1.4);

        ctx.save();
        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.opacity;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 6;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [level, player, settings, isPaused, onStatsUpdate, onGoalReached, onGameOver]);

  // Adjust canvas resolution dynamically to match container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = Math.min(650, Math.max(480, window.innerHeight * 0.65));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-lime-500/30 bg-slate-950 shadow-2xl touch-none select-none"
    >
      <canvas ref={canvasRef} className="block w-full h-[480px] sm:h-[540px] md:h-[600px] cursor-pointer" />

      {/* On-screen touch controls for Mobile and Tablet */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6 pointer-events-auto sm:hidden">
        <button
          onClick={() => switchLane('left')}
          disabled={touchActiveLane <= -1}
          className="w-14 h-14 rounded-full bg-slate-900/80 border-2 border-lime-500/50 text-lime-400 text-2xl font-bold flex items-center justify-center active:scale-90 active:bg-lime-500/30 transition shadow-lg backdrop-blur-sm disabled:opacity-40"
          aria-label="Move Left"
        >
          ←
        </button>

        <button
          onClick={jump}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center active:scale-95 shadow-lg shadow-lime-500/30"
          aria-label="Jump"
        >
          JUMP ⤒
        </button>

        <button
          onClick={() => switchLane('right')}
          disabled={touchActiveLane >= 1}
          className="w-14 h-14 rounded-full bg-slate-900/80 border-2 border-lime-500/50 text-lime-400 text-2xl font-bold flex items-center justify-center active:scale-90 active:bg-lime-500/30 transition shadow-lg backdrop-blur-sm disabled:opacity-40"
          aria-label="Move Right"
        >
          →
        </button>
      </div>

      {/* Desktop Keyboard Control Hints Overlay */}
      <div className="hidden sm:flex absolute bottom-3 left-4 items-center gap-2 text-xs text-lime-400/70 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-lime-500/20 backdrop-blur-sm">
        <span>Controls:</span>
        <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-lime-300 font-mono">A / ←</kbd>
        <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-lime-300 font-mono">D / →</kbd>
        <span>Change Lane</span>
        <span className="mx-1">•</span>
        <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-lime-300 font-mono">SPACE / W</kbd>
        <span>Jump</span>
      </div>
    </div>
  );
};
