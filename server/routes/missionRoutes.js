import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/missions.json');

const getMissions = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('Error reading missions data:', err);
    return [];
  }
};

// GET /api/missions
router.get('/', (req, res) => {
  const missions = getMissions();
  res.json({ success: true, count: missions.length, missions });
});

// GET /api/missions/:id
router.get('/:id', (req, res) => {
  const missions = getMissions();
  const mission = missions.find(m => m.id === req.params.id);
  if (!mission) {
    return res.status(404).json({ success: false, message: 'Story mission not found' });
  }
  res.json({ success: true, mission });
});

export default router;
