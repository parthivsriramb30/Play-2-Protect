import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/modules.json');

const getModules = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('Error reading modules data:', err);
    return [];
  }
};

// GET /api/modules
router.get('/', (req, res) => {
  const modules = getModules();
  res.json({ success: true, count: modules.length, modules });
});

// GET /api/modules/:id
router.get('/:id', (req, res) => {
  const modules = getModules();
  const moduleItem = modules.find(m => m.id === req.params.id);
  if (!moduleItem) {
    return res.status(404).json({ success: false, message: 'Module not found' });
  }
  res.json({ success: true, module: moduleItem });
});

export default router;
