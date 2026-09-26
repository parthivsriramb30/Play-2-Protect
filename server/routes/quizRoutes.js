import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/quizzes.json');

const getQuizzes = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('Error reading quizzes data:', err);
    return [];
  }
};

// GET /api/quizzes (optional topic filter, limit)
router.get('/', (req, res) => {
  const { topic, limit } = req.query;
  let list = getQuizzes();

  if (topic && topic !== 'All') {
    list = list.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
  }

  if (limit) {
    const num = parseInt(limit, 10);
    if (!isNaN(num) && num > 0) {
      list = list.slice(0, num);
    }
  }

  res.json({ success: true, count: list.length, quizzes: list });
});

// POST /api/quizzes/submit
router.post('/submit', (req, res) => {
  const { answers = {} } = req.body;
  const allQuizzes = getQuizzes();

  let correctCount = 0;
  let totalEvaluated = 0;
  const feedback = [];

  for (const [quizId, userSelectedIndex] of Object.entries(answers)) {
    const quiz = allQuizzes.find(q => q.id === quizId);
    if (quiz) {
      totalEvaluated++;
      const isCorrect = userSelectedIndex === quiz.correctIndex;
      if (isCorrect) correctCount++;
      feedback.push({
        id: quiz.id,
        isCorrect,
        correctIndex: quiz.correctIndex,
        explanation: quiz.explanation
      });
    }
  }

  const isPerfect = totalEvaluated > 0 && correctCount === totalEvaluated;
  const baseXP = correctCount * 20;
  const bonusXP = isPerfect ? 30 : 0;
  const totalEarnedXP = baseXP + bonusXP;

  res.json({
    success: true,
    totalQuestions: totalEvaluated,
    correctCount,
    isPerfect,
    earnedXP: totalEarnedXP,
    feedback
  });
});

export default router;
