import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const badgesPath = path.join(__dirname, '../data/badges.json');

const getBadges = () => {
  try {
    return JSON.parse(fs.readFileSync(badgesPath, 'utf8'));
  } catch (err) {
    console.error('Error reading badges:', err);
    return [];
  }
};

// Calculate level based on XP
export const calculateLevel = (xp) => {
  if (xp >= 800) return { level: 5, title: 'Clean Sport Champion', minXP: 800, nextLevelXP: null };
  if (xp >= 500) return { level: 4, title: 'Integrity Leader', minXP: 500, nextLevelXP: 800 };
  if (xp >= 250) return { level: 3, title: 'Sport Advocate', minXP: 250, nextLevelXP: 500 };
  if (xp >= 100) return { level: 2, title: 'Knowledge Explorer', minXP: 100, nextLevelXP: 250 };
  return { level: 1, title: 'Clean Rookie', minXP: 0, nextLevelXP: 100 };
};

// GET /api/badges
router.get('/badges', (req, res) => {
  const badges = getBadges();
  res.json({ success: true, count: badges.length, badges });
});

// GET /api/progress/:userId
router.get('/progress/:userId', (req, res) => {
  const { userId } = req.params;
  // Default fresh or simulated progress
  const defaultProgress = {
    userId,
    xp: 120,
    streak: 3,
    streakHistory: [true, true, true, false, false, false, false],
    completedModules: ['mod-01'],
    completedQuizzes: ['q-01'],
    completedStories: ['story-01'],
    completedPuzzles: ['puz-01'],
    unlockedBadges: ['badge-01', 'badge-09'],
    rewardPoints: 45,
    todayChallengeCompleted: false,
    certificateGenerated: false
  };

  const levelInfo = calculateLevel(defaultProgress.xp);

  res.json({
    success: true,
    progress: {
      ...defaultProgress,
      ...levelInfo
    }
  });
});

// POST /api/xp/add
router.post('/xp/add', (req, res) => {
  const { amount = 0, reason = 'Activity completion', currentXP = 0 } = req.body;
  const newXP = Math.max(0, currentXP + amount);
  const oldLevel = calculateLevel(currentXP);
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel.level > oldLevel.level;

  res.json({
    success: true,
    addedXP: amount,
    newXP,
    oldLevel: oldLevel.level,
    newLevel: newLevel.level,
    leveledUp,
    levelInfo: newLevel,
    message: leveledUp ? `Congratulations! You reached Level ${newLevel.level} (${newLevel.title})!` : `+${amount} XP for ${reason}`
  });
});

// POST /api/daily-activity
router.post('/daily-activity', (req, res) => {
  const { activityType, userId } = req.body;
  const validActivities = ['Lesson', 'Quiz', 'Puzzle', 'Story', 'Daily Challenge', 'Recall test'];

  if (!validActivities.includes(activityType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid activity type. Opening the site does not count towards daily streak.'
    });
  }

  res.json({
    success: true,
    meaningful: true,
    activityType,
    rewardPointsEarned: 5,
    message: `Activity recorded: ${activityType}. Daily streak maintained!`
  });
});

// POST /api/certificates/verify
router.post('/certificates/verify', (req, res) => {
  const { certificateId } = req.body;
  if (!certificateId) {
    return res.status(400).json({ success: false, message: 'Certificate ID is required' });
  }

  res.json({
    success: true,
    verified: true,
    certificate: {
      id: certificateId,
      program: 'Play2Protect Anti-Doping Awareness Program',
      status: 'VERIFIED OFFICIAL'
    }
  });
});

export default router;
