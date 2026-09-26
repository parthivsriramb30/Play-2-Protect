import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const guidancePath = path.join(__dirname, '../data/substanceGuidance.json');

const getGuidanceData = () => {
  try {
    return JSON.parse(fs.readFileSync(guidancePath, 'utf8'));
  } catch (err) {
    console.error('Error reading substanceGuidance data:', err);
    return { categories: [], wellnessChecklist: [], healthyEatingGuide: {}, dailySupportPlan: [] };
  }
};

// GET /api/support/guidance?substance=...
router.get('/guidance', (req, res) => {
  const { substance } = req.query;
  const data = getGuidanceData();

  if (!substance || substance.toLowerCase() === 'all' || substance.toLowerCase().includes('prefer not')) {
    // Return general awareness profile if omitted or "prefer not to say"
    const general = data.categories.find(c => c.id === 'general-awareness') || data.categories[0];
    return res.json({
      success: true,
      substance: 'General Awareness',
      profile: general,
      allCategories: data.categories.map(c => ({ id: c.id, name: c.name, subtitle: c.subtitle })),
      wellnessChecklist: data.wellnessChecklist,
      healthyEatingGuide: data.healthyEatingGuide,
      dailySupportPlan: data.dailySupportPlan,
      safetyDisclaimer: data.safetyDisclaimer,
      nutritionDisclaimer: data.nutritionDisclaimer
    });
  }

  const query = substance.toLowerCase();
  const profile = data.categories.find(c =>
    c.id.toLowerCase() === query ||
    c.name.toLowerCase().includes(query)
  ) || data.categories[0];

  res.json({
    success: true,
    substance: profile.name,
    profile,
    allCategories: data.categories.map(c => ({ id: c.id, name: c.name, subtitle: c.subtitle })),
    wellnessChecklist: data.wellnessChecklist,
    healthyEatingGuide: data.healthyEatingGuide,
    dailySupportPlan: data.dailySupportPlan,
    safetyDisclaimer: data.safetyDisclaimer,
    nutritionDisclaimer: data.nutritionDisclaimer
  });
});

// GET /api/support/activities (for Craving / Temptation Support)
router.get('/activities', (req, res) => {
  res.json({
    success: true,
    activities: {
      distraction: [
        {
          id: "act-grounding",
          title: "5-4-3-2-1 Sensory Grounding",
          instructions: [
            "Name 5 things you can SEE around you right now",
            "Name 4 things you can physically TOUCH or FEEL (your shirt, the floor, your chair)",
            "Name 3 things you can HEAR in this moment",
            "Name 2 things you can SMELL (or favorite scents you recall)",
            "Name 1 positive truth you can state about protecting your future"
          ]
        },
        {
          id: "act-water",
          title: "Hydration Reset",
          instructions: [
            "Pour a tall glass of cold water",
            "Drink it slowly over 60 seconds",
            "Notice the temperature and feeling of refreshment in your throat",
            "Take 3 deep slow breaths before standing up"
          ]
        },
        {
          id: "act-puzzle",
          title: "Quick Anti-Doping Mind Challenge",
          instructions: [
            "Redirect your focus to an intellectual sport integrity puzzle",
            "Test your pattern recognition for 2 minutes"
          ],
          link: "/puzzles"
        }
      ],
      calm: {
        title: "One-Minute Box Breathing Drill",
        cycleSeconds: 16,
        phases: [
          { name: "Inhale Slowly", seconds: 4 },
          { name: "Hold Breath", seconds: 4 },
          { name: "Exhale Gently", seconds: 4 },
          { name: "Rest Empty", seconds: 4 }
        ]
      },
      movement: [
        "Take a brisk 5-minute walk around your home, yard, or building",
        "Perform 10 slow shoulder rolls and gentle neck stretches",
        "Step outside for 2 minutes and take in natural daylight",
        "Wash your face with cool running water"
      ],
      connection: [
        "Call or text a family member who supports your goals",
        "Message a trusted teammate or clean athletic training partner",
        "Speak with your school or club sports coach",
        "Access confidential support lines via our Professional Directory"
      ]
    }
  });
});

export default router;
