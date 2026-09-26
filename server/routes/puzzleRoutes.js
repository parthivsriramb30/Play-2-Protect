import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/puzzles.json');

const getPuzzles = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('Error reading puzzles data:', err);
    return [];
  }
};

// GET /api/puzzles
router.get('/', (req, res) => {
  const puzzles = getPuzzles();
  res.json({ success: true, count: puzzles.length, puzzles });
});

// POST /api/puzzles/verify
router.post('/verify', (req, res) => {
  const { puzzleId, submission } = req.body;
  const puzzles = getPuzzles();
  const puzzle = puzzles.find(p => p.id === puzzleId);

  if (!puzzle) {
    return res.status(404).json({ success: false, message: 'Puzzle not found' });
  }

  let isCorrect = false;
  let message = '';

  if (puzzle.type === 'scramble') {
    isCorrect = (submission || '').trim().toUpperCase() === puzzle.answer.toUpperCase();
    message = isCorrect ? 'Great job! Word unscrambled correctly.' : `Incorrect. The correct answer was ${puzzle.answer}.`;
  } else if (puzzle.type === 'true-false') {
    isCorrect = Boolean(submission) === Boolean(puzzle.isTrue);
    message = isCorrect ? 'Correct! ' + puzzle.explanation : 'Incorrect. ' + puzzle.explanation;
  } else if (puzzle.type === 'identify-risky') {
    const chosen = puzzle.options.find(o => o.id === submission);
    isCorrect = chosen ? chosen.isRisky === true : false;
    message = isCorrect ? 'Correct identification! ' + puzzle.explanation : 'Incorrect. Notice the red flag: ' + puzzle.explanation;
  } else if (puzzle.type === 'match') {
    // submission should match pair IDs to definition IDs
    isCorrect = Boolean(submission && submission.matchesCorrect);
    message = isCorrect ? 'All terms correctly matched!' : 'Some matches were incorrect. Review the definitions.';
  }

  res.json({
    success: true,
    isCorrect,
    earnedXP: isCorrect ? puzzle.xpReward : 0,
    message
  });
});

export default router;
