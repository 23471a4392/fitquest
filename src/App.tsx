import { useState, useEffect, useCallback } from 'react';
import type {
  ActivePowerUp,
  GameSettings,
  GameSummary,
  LevelConfig,
  PlayerProfile,
} from './types/game';
import { GAME_LEVELS } from './data/gameConstants';
import {
  getSavedPlayer,
  savePlayer,
  getGameSettings,
  saveGameSettings,
  getLeaderboard,
  getAchievements,
  getDailyChallenges,
  getLifetimeStats,
  recordRunStats,
  getUnlockedLevels,
  unlockLevel,
  advanceDailyChallengeProgress,
  checkAndUnlockAchievements,
  updateDailyChallenges,
  resetAllGameData,
} from './utils/storage';
import { soundEngine } from './utils/audioSystem';
import { generateGameSummary } from './utils/gameLogic';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PlayerSetupScreen } from './components/PlayerSetupScreen';
import { GameCanvas } from './components/GameCanvas';
import { TopHUD } from './components/TopHUD';
import { PauseModal } from './components/PauseModal';
import { ResultScreen } from './components/ResultScreen';
import { LevelSelectScreen } from './components/LevelSelectScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { DailyChallengesScreen } from './components/DailyChallengesScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { HowToPlayScreen } from './components/HowToPlayScreen';
import { AboutScreen } from './components/AboutScreen';
import { SettingsScreen } from './components/SettingsScreen';

export function App() {
  // Screens: 'welcome' | 'player_setup' | 'game' | 'result' | 'level_select' | 'daily_challenges' | 'achievements' | 'leaderboard' | 'statistics' | 'how_to_play' | 'about' | 'settings'
  const [activeScreen, setActiveScreen] = useState<string>('welcome');

  // Persistence data
  const [player, setPlayer] = useState<PlayerProfile | null>(getSavedPlayer());
  const [settings, setSettings] = useState<GameSettings>(getGameSettings());
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>(getUnlockedLevels());
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig>(GAME_LEVELS[0]);
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [achievements, setAchievements] = useState(getAchievements());
  const [dailyChallenges, setDailyChallenges] = useState(getDailyChallenges());
  const [lifetimeStats, setLifetimeStats] = useState(getLifetimeStats());

  // In-Game state
  const [isPaused, setIsPaused] = useState(false);
  const [gameKey, setGameKey] = useState(0); // to force remount on restart
  const [liveStats, setLiveStats] = useState({
    currentWeight: player ? player.currentWeightKg : 78,
    health: 100,
    energy: 100,
    score: 0,
    distance: 0,
    activePowerUps: [] as ActivePowerUp[],
    healthyCount: 0,
    junkCount: 0,
    obstaclesCount: 0,
    powerUpsCount: 0,
  });

  const [gameSummary, setGameSummary] = useState<GameSummary | null>(null);
  const [achievementToast, setAchievementToast] = useState<string | null>(null);

  // Sync settings with Web Audio engine
  useEffect(() => {
    soundEngine.setSoundEnabled(settings.soundEnabled);
    soundEngine.setMusicEnabled(settings.musicEnabled);
    soundEngine.setMasterVolume(settings.soundVolume);
  }, [settings]);

  // Audio toggles
  const handleToggleSound = () => {
    const updated = !settings.soundEnabled;
    soundEngine.setSoundEnabled(updated);
    const newSettings = { ...settings, soundEnabled: updated };
    setSettings(newSettings);
    saveGameSettings(newSettings);
  };

  const handleToggleMusic = () => {
    const updated = !settings.musicEnabled;
    soundEngine.setMusicEnabled(updated);
    const newSettings = { ...settings, musicEnabled: updated };
    setSettings(newSettings);
    saveGameSettings(newSettings);
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveGameSettings(newSettings);
  };

  // Profile save
  const handleSaveProfile = (profile: PlayerProfile) => {
    setPlayer(profile);
    savePlayer(profile);
    setLiveStats((prev) => ({
      ...prev,
      currentWeight: profile.currentWeightKg,
    }));
    setActiveScreen('welcome');
  };

  // Start game
  const handleStartGame = (levelToPlay?: LevelConfig) => {
    if (!player) {
      setActiveScreen('player_setup');
      return;
    }
    const lvl = levelToPlay || selectedLevel;
    setSelectedLevel(lvl);
    setLiveStats({
      currentWeight: player.currentWeightKg,
      health: 100,
      energy: 100,
      score: 0,
      distance: 0,
      activePowerUps: [],
      healthyCount: 0,
      junkCount: 0,
      obstaclesCount: 0,
      powerUpsCount: 0,
    });
    setIsPaused(false);
    setGameKey((k) => k + 1);
    setActiveScreen('game');
  };

  // Restart game
  const handleRestart = () => {
    if (!player) return;
    setLiveStats({
      currentWeight: player.currentWeightKg,
      health: 100,
      energy: 100,
      score: 0,
      distance: 0,
      activePowerUps: [],
      healthyCount: 0,
      junkCount: 0,
      obstaclesCount: 0,
      powerUpsCount: 0,
    });
    setIsPaused(false);
    setGameKey((k) => k + 1);
  };

  // Stats updates from running canvas
  const handleStatsUpdate = useCallback(
    (stats: {
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
    }) => {
      setLiveStats(stats);
    },
    []
  );

  // Goal Reached
  const handleGoalReached = (finalStats: {
    finalWeight: number;
    finalHealth: number;
    distanceCovered: number;
    healthyFoods: number;
    junkFoods: number;
    obstaclesHit: number;
    powerUps: number;
    timeElapsedSeconds: number;
  }) => {
    if (!player) return;

    const summary = generateGameSummary(
      player,
      selectedLevel,
      finalStats.finalWeight,
      finalStats.finalHealth,
      finalStats.distanceCovered,
      finalStats.healthyFoods,
      finalStats.junkFoods,
      finalStats.obstaclesHit,
      finalStats.powerUps,
      finalStats.timeElapsedSeconds,
      true
    );

    setGameSummary(summary);

    // Record lifetime stats
    const bmiDelta = Math.round((summary.initialBMI - summary.finalBMI) * 10) / 10;
    const newLifetime = recordRunStats({
      distanceMeters: summary.distanceCoveredMeters,
      score: summary.finalScore,
      healthyFoods: summary.healthyFoodsCollected,
      junkFoods: summary.junkFoodsCollected,
      obstaclesHit: summary.obstaclesHit,
      powerUps: summary.powerUpsCollected,
      goalCompleted: true,
      bmiDelta,
    });
    setLifetimeStats(newLifetime);

    // Advance daily challenges
    const updatedDaily = advanceDailyChallengeProgress({
      healthyFoods: summary.healthyFoodsCollected,
      distanceMeters: summary.distanceCoveredMeters,
      waterBoosts: summary.powerUpsCollected,
      avoidJunkDistance: summary.junkFoodsCollected === 0 ? summary.distanceCoveredMeters : 0,
    });
    setDailyChallenges(updatedDaily);

    // Unlock next level if available
    if (selectedLevel.id < GAME_LEVELS.length) {
      const newUnlocked = unlockLevel(selectedLevel.id + 1);
      setUnlockedLevels(newUnlocked);
    }

    // Check Achievements
    const { updated: newAchs, newlyUnlocked } = checkAndUnlockAchievements({
      runFinished: true,
      score: summary.finalScore,
      healthyCount: summary.healthyFoodsCollected,
      junkCount: summary.junkFoodsCollected,
      waterCount: summary.powerUpsCollected,
      rank: summary.rank,
      distance: summary.distanceCoveredMeters,
      goalCompleted: true,
    });
    setAchievements(newAchs);

    if (newlyUnlocked.length > 0) {
      setAchievementToast(`🎉 Achievement Unlocked: ${newlyUnlocked[0].title}!`);
      setTimeout(() => setAchievementToast(null), 4000);
    }

    setActiveScreen('result');
  };

  // Game Over (Health dropped to 0)
  const handleGameOver = () => {
    if (!player) return;

    const summary = generateGameSummary(
      player,
      selectedLevel,
      liveStats.currentWeight,
      0,
      liveStats.distance,
      liveStats.healthyCount,
      liveStats.junkCount,
      liveStats.obstaclesCount,
      liveStats.powerUpsCount,
      45,
      false
    );

    setGameSummary(summary);
    setActiveScreen('result');
  };

  // Claim Daily Challenge reward
  const handleClaimDailyReward = (challengeId: string) => {
    const updated = dailyChallenges.map((c) =>
      c.id === challengeId ? { ...c, claimed: true } : c
    );
    updateDailyChallenges(updated);
    setDailyChallenges(updated);
  };

  // Reset all game data
  const handleResetAllData = () => {
    resetAllGameData();
    setPlayer(null);
    setLeaderboard(getLeaderboard());
    setAchievements(getAchievements());
    setDailyChallenges(getDailyChallenges());
    setLifetimeStats(getLifetimeStats());
    setUnlockedLevels([1, 2]);
    setSelectedLevel(GAME_LEVELS[0]);
    setActiveScreen('welcome');
  };

  // Next level handler
  const handleNextLevel = () => {
    const nextIdx = GAME_LEVELS.findIndex((l) => l.id === selectedLevel.id) + 1;
    if (nextIdx < GAME_LEVELS.length) {
      const nextLvl = GAME_LEVELS[nextIdx];
      setSelectedLevel(nextLvl);
      handleStartGame(nextLvl);
    } else {
      setActiveScreen('welcome');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${
        settings.theme === 'light' ? 'theme-light bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        player={player}
        activeScreen={activeScreen}
        soundEnabled={settings.soundEnabled}
        musicEnabled={settings.musicEnabled}
        onNavigate={(screen) => {
          setIsPaused(false);
          setActiveScreen(screen);
        }}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
      />

      {/* Achievement Popup Toast */}
      {achievementToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <span>🏆</span>
          <span>{achievementToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-5xl mx-auto">
        {/* Screen 1: Welcome */}
        {activeScreen === 'welcome' && (
          <WelcomeScreen
            player={player}
            onStartGame={() => handleStartGame()}
            onOpenSetup={() => setActiveScreen('player_setup')}
            onOpenHowToPlay={() => setActiveScreen('how_to_play')}
            onOpenLeaderboard={() => {
              setLeaderboard(getLeaderboard());
              setActiveScreen('leaderboard');
            }}
            onOpenAbout={() => setActiveScreen('about')}
            onOpenLevelSelect={() => setActiveScreen('level_select')}
            onOpenDailyChallenges={() => setActiveScreen('daily_challenges')}
            onOpenAchievements={() => setActiveScreen('achievements')}
            onOpenStatistics={() => {
              setLifetimeStats(getLifetimeStats());
              setActiveScreen('statistics');
            }}
            onOpenSettings={() => setActiveScreen('settings')}
          />
        )}

        {/* Screen 2: Player Setup */}
        {activeScreen === 'player_setup' && (
          <PlayerSetupScreen
            initialProfile={player}
            onComplete={handleSaveProfile}
            onBack={() => setActiveScreen('welcome')}
          />
        )}

        {/* Screen 3: Main Game Screen */}
        {activeScreen === 'game' && player && (
          <div className="w-full flex flex-col items-center">
            <TopHUD
              player={player}
              currentWeight={liveStats.currentWeight}
              health={liveStats.health}
              energy={liveStats.energy}
              score={liveStats.score}
              distance={liveStats.distance}
              targetDistance={selectedLevel.targetDistanceMeters}
              activePowerUps={liveStats.activePowerUps}
              soundEnabled={settings.soundEnabled}
              musicEnabled={settings.musicEnabled}
              onToggleSound={handleToggleSound}
              onToggleMusic={handleToggleMusic}
              onPause={() => setIsPaused(true)}
            />

            <GameCanvas
              key={gameKey}
              player={player}
              level={selectedLevel}
              settings={settings}
              isPaused={isPaused}
              onStatsUpdate={handleStatsUpdate}
              onGoalReached={handleGoalReached}
              onGameOver={handleGameOver}
            />

            <PauseModal
              isOpen={isPaused}
              soundEnabled={settings.soundEnabled}
              musicEnabled={settings.musicEnabled}
              onResume={() => setIsPaused(false)}
              onRestart={handleRestart}
              onQuit={() => {
                setIsPaused(false);
                setActiveScreen('welcome');
              }}
              onToggleSound={handleToggleSound}
              onToggleMusic={handleToggleMusic}
            />
          </div>
        )}

        {/* Screen 4: Final Result & Evaluation */}
        {activeScreen === 'result' && gameSummary && (
          <ResultScreen
            summary={gameSummary}
            hasNextLevel={selectedLevel.id < GAME_LEVELS.length}
            onPlayAgain={handleRestart}
            onNextLevel={handleNextLevel}
            onGoToLeaderboard={() => {
              setLeaderboard(getLeaderboard());
              setActiveScreen('leaderboard');
            }}
            onGoHome={() => setActiveScreen('welcome')}
          />
        )}

        {/* Screen 5: Level Select */}
        {activeScreen === 'level_select' && (
          <LevelSelectScreen
            unlockedLevels={unlockedLevels}
            selectedLevel={selectedLevel}
            onSelectAndPlay={(lvl) => handleStartGame(lvl)}
            onBack={() => setActiveScreen('welcome')}
          />
        )}

        {/* Screen 6: Leaderboard */}
        {activeScreen === 'leaderboard' && (
          <LeaderboardScreen
            entries={leaderboard}
            onBack={() => setActiveScreen('welcome')}
            onPlayNow={() => handleStartGame()}
          />
        )}

        {/* Screen 7: Statistics */}
        {activeScreen === 'statistics' && (
          <StatisticsScreen
            stats={lifetimeStats}
            achievements={achievements}
            onBack={() => setActiveScreen('welcome')}
            onPlayNow={() => handleStartGame()}
          />
        )}

        {/* Screen 8: Daily Challenges */}
        {activeScreen === 'daily_challenges' && (
          <DailyChallengesScreen
            challenges={dailyChallenges}
            onClaimReward={handleClaimDailyReward}
            onBack={() => setActiveScreen('welcome')}
            onPlayNow={() => handleStartGame()}
          />
        )}

        {/* Screen 9: Achievements */}
        {activeScreen === 'achievements' && (
          <AchievementsScreen
            achievements={achievements}
            onBack={() => setActiveScreen('welcome')}
            onPlayNow={() => handleStartGame()}
          />
        )}

        {/* Screen 10: How to Play */}
        {activeScreen === 'how_to_play' && (
          <HowToPlayScreen
            onBack={() => setActiveScreen('welcome')}
            onPlayNow={() => handleStartGame()}
          />
        )}

        {/* Screen 11: About & Medical Disclaimer */}
        {activeScreen === 'about' && (
          <AboutScreen
            onBack={() => setActiveScreen('welcome')}
            onPlayNow={() => handleStartGame()}
          />
        )}

        {/* Screen 12: Settings */}
        {activeScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetAllData}
            onBack={() => setActiveScreen('welcome')}
          />
        )}
      </main>

      {/* Footer with Medical Screening Notice */}
      <Footer
        onOpenAbout={() => setActiveScreen('about')}
        onOpenHowToPlay={() => setActiveScreen('how_to_play')}
        onOpenSettings={() => setActiveScreen('settings')}
      />
    </div>
  );
}

export default App;
