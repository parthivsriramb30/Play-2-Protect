import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const planDataPath = path.join(__dirname, '../data/supportPlans.json');
const goalDataPath = path.join(__dirname, '../data/supportGoals.json');

const getPlans = () => {
  try {
    return JSON.parse(fs.readFileSync(planDataPath, 'utf8'));
  } catch (err) {
    return [];
  }
};

const savePlans = (plans) => {
  fs.writeFileSync(planDataPath, JSON.stringify(plans, null, 2), 'utf8');
};

const getGoals = () => {
  try {
    return JSON.parse(fs.readFileSync(goalDataPath, 'utf8'));
  } catch (err) {
    return [];
  }
};

const saveGoals = (goals) => {
  fs.writeFileSync(goalDataPath, JSON.stringify(goals, null, 2), 'utf8');
};

// Strict dosage/tapering intercept checker
const isDosageOrTaperAttempt = (text) => {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  const dosagePatterns = [
    /\b\d+\s*(mg|mcg|ml|g|milligram|grams|pills|tablets|drops)\b/i,
    /\breduce\s+(from\s+)?\d+.*to\s+\d+/i,
    /\b(taper|tapering|detox schedule|wean off|dose reduction)\b/i,
    /\b\d+\s*%/i,
    /\bday\s*\d+.*reduce/i
  ];
  return dosagePatterns.some(pattern => pattern.test(lower));
};

const DOSAGE_REJECTION_MESSAGE = "I can't create a medication or substance tapering schedule. The safest plan depends on the substance and your individual health. Please discuss this with a qualified healthcare professional.";

// GET /api/support-plans/my-plan
router.get('/my-plan', (req, res) => {
  const plans = getPlans();
  const userPlan = plans.find(p => p.userId === 'current-user') || plans[0] || null;
  res.json({ success: true, plan: userPlan });
});

// POST /api/support-plans/save
router.post('/save', (req, res) => {
  const {
    changeGoal,
    professionalId,
    professionalName,
    appointmentDate,
    questions = [],
    personalGoals = [],
    wellnessActivities = []
  } = req.body;

  // Verify no dosage tapering attempts in free-text fields
  const allText = [
    changeGoal,
    professionalName,
    ...(Array.isArray(questions) ? questions : [questions]),
    ...(Array.isArray(personalGoals) ? personalGoals : [personalGoals])
  ].filter(Boolean).join(' ');

  if (isDosageOrTaperAttempt(allText)) {
    return res.status(400).json({
      success: false,
      isTaperAttempt: true,
      message: DOSAGE_REJECTION_MESSAGE
    });
  }

  const plans = getPlans();
  const newPlan = {
    supportPlanId: `sp-${Date.now()}`,
    userId: 'current-user',
    changeGoal: changeGoal || 'Learn more and make healthier changes',
    professionalId: professionalId || 'prof-01',
    professionalName: professionalName || 'Dr. Rajesh K. Sharma (MD Psychiatry)',
    appointmentDate: appointmentDate || new Date().toISOString().split('T')[0],
    questions: Array.isArray(questions) ? questions : [questions],
    personalGoals: Array.isArray(personalGoals) ? personalGoals : [personalGoals],
    wellnessActivities: Array.isArray(wellnessActivities) ? wellnessActivities : [wellnessActivities],
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  plans.unshift(newPlan);
  savePlans(plans);

  res.status(201).json({ success: true, plan: newPlan });
});

// GET /api/support-goals
router.get('/goals', (req, res) => {
  const goals = getGoals();
  res.json({ success: true, goals });
});

// POST /api/support-goals
router.post('/goals', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Goal title is required' });
  }

  if (isDosageOrTaperAttempt(title)) {
    return res.status(400).json({
      success: false,
      isTaperAttempt: true,
      message: DOSAGE_REJECTION_MESSAGE
    });
  }

  const goals = getGoals();
  const newGoal = {
    goalId: `goal-${Date.now()}`,
    userId: 'current-user',
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  goals.push(newGoal);
  saveGoals(goals);

  res.status(201).json({ success: true, goal: newGoal });
});

// PUT /api/support-goals/:id/toggle
router.put('/goals/:id/toggle', (req, res) => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.goalId === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Goal not found' });
  }

  goals[index].completed = !goals[index].completed;
  goals[index].completedAt = goals[index].completed ? new Date().toISOString() : null;
  saveGoals(goals);

  res.json({ success: true, goal: goals[index] });
});

export default router;
