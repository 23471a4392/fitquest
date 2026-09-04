import type { GameSummary } from '../types/game';

export function generateAthleteReportCard(summary: GameSummary): string {
  return [
    '======================================================',
    '        FITQUEST ATHLETE PERFORMANCE REPORT CARD      ',
    '======================================================',
    'Runner: ' + summary.player.name + ' (Age: ' + summary.player.age + ', Goal: ' + summary.player.fitnessGoal + ')',
    'Level: ' + summary.level.name + ' | Distance: ' + summary.distanceCoveredMeters + ' meters',
    '------------------------------------------------------',
    'PERFORMANCE GRADE: ' + summary.rank + ' (' + summary.rankTitle + ')',
    'FINAL SCORE: ' + summary.finalScore,
    '------------------------------------------------------',
    'BODY COMPOSITION & BMI PROGRESSION:',
    '  Initial Weight: ' + summary.initialWeight + ' kg -> Final: ' + summary.finalWeight + ' kg (Target: ' + summary.player.targetWeightKg + ' kg)',
    '  Initial BMI: ' + summary.initialBMI + ' -> Final BMI: ' + summary.finalBMI + ' (' + summary.bmiCategory + ')',
    '------------------------------------------------------',
    'NUTRITIONAL FUELING AUDIT:',
    '  Clean Healthy Choices: ' + summary.healthyFoodsCollected + ' items',
    '  Junk Food Collisions: ' + summary.junkFoodsCollected + ' items',
    '  Obstacles Hit: ' + summary.obstaclesHit + ' | Power-ups: ' + summary.powerUpsCollected,
    '======================================================'
  ].join('\n');
}
