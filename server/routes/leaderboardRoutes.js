import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/leaderboard.json');

const getLeaderboard = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('Error reading leaderboard:', err);
    return [];
  }
};

// GET /api/leaderboard
// Note: strictly public safe fields only. Never exposes health, medical, or private user data.
router.get('/', (req, res) => {
  const list = getLeaderboard();
  const safeList = list.map(item => ({
    rank: item.rank,
    displayName: item.displayName,
    xp: item.xp,
    level: item.level,
    badge: item.badge,
    streak: item.streak
  }));

  res.json({
    success: true,
    title: 'Play2Protect Weekly Clean Sport Leaderboard',
    lastUpdated: new Date().toISOString().split('T')[0],
    leaderboard: safeList
  });
});

export default router;
