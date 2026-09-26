import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/medicineDatabase.json');

const getMedicines = () => {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading medicine database:', err);
    return [];
  }
};

// GET /api/medicine/search?name=...
router.get('/search', (req, res) => {
  const query = (req.query.name || '').trim().toLowerCase();
  const medicines = getMedicines();

  if (!query) {
    return res.json({
      success: true,
      count: medicines.length,
      results: medicines
    });
  }

  // Multi-field search across product name, category, ingredients, and status
  const matched = medicines.filter(med => {
    const nameMatch = med.name.toLowerCase().includes(query);
    const categoryMatch = med.category.toLowerCase().includes(query);
    const ingredientMatch = med.ingredients.some(ing => ing.toLowerCase().includes(query));
    const descMatch = med.antiDopingRelevance.toLowerCase().includes(query);
    return nameMatch || categoryMatch || ingredientMatch || descMatch;
  });

  return res.json({
    success: true,
    query,
    count: matched.length,
    results: matched
  });
});

// GET /api/medicine/:id
router.get('/:id', (req, res) => {
  const medicines = getMedicines();
  const item = medicines.find(m => m.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Substance/Medicine not found' });
  }
  return res.json({ success: true, item });
});

export default router;
