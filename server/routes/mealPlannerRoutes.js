import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/mealPlans.json');

const getMealPlans = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    return [];
  }
};

const saveMealPlans = (plans) => {
  fs.writeFileSync(dataPath, JSON.stringify(plans, null, 2), 'utf8');
};

// Meal component database for intelligent, allergy-safe generation
const MEAL_DATABASE = {
  breakfast: [
    {
      name: "Oatmeal Power Bowl",
      pref: ["Vegetarian", "Vegan", "No preference"],
      desc: "Warm rolled oats topped with sliced bananas, chia seeds, and fortified plant milk or low-fat dairy.",
      allergens: ["gluten", "oats", "milk"]
    },
    {
      name: "Scrambled Eggs & Whole-Grain Toast",
      pref: ["Vegetarian", "Non-vegetarian", "No preference"],
      desc: "2 fresh eggs scrambled with spinach and tomatoes, served alongside whole-wheat toast and sliced avocado.",
      allergens: ["egg", "gluten"]
    },
    {
      name: "Tofu Scramble & Roasted Sweet Potato",
      pref: ["Vegetarian", "Vegan", "No preference"],
      desc: "Crumbled turmeric tofu with sautéed peppers, baby spinach, and roasted diced sweet potatoes.",
      allergens: ["soy"]
    },
    {
      name: "Greek Yogurt & Fresh Berry Parfait",
      pref: ["Vegetarian", "Non-vegetarian", "No preference"],
      desc: "Plain high-protein Greek yogurt with a cup of mixed fresh berries and pumpkin seeds.",
      allergens: ["milk", "dairy"]
    },
    {
      name: "Smoothie Bowl with Seeds",
      pref: ["Vegetarian", "Vegan", "Non-vegetarian", "No preference"],
      desc: "Blended frozen mango and spinach with plant protein, topped with hemp seeds and shredded unsweetened coconut.",
      allergens: []
    }
  ],
  snack: [
    {
      name: "Apple & Sunflower Butter",
      pref: ["Vegetarian", "Vegan", "Non-vegetarian", "No preference"],
      desc: "Fresh sliced crisp apple paired with peanut-free seed butter.",
      allergens: ["sunflower"]
    },
    {
      name: "Carrot & Cucumber with Hummus",
      pref: ["Vegetarian", "Vegan", "Non-vegetarian", "No preference"],
      desc: "Crisp raw carrot and cucumber batons served with 3 tablespoons of classic chickpea hummus.",
      allergens: ["sesame"]
    },
    {
      name: "Boiled Egg & Cherry Tomatoes",
      pref: ["Vegetarian", "Non-vegetarian", "No preference"],
      desc: "One hard-boiled egg sprinkled with black pepper, paired with fresh cherry tomatoes.",
      allergens: ["egg"]
    },
    {
      name: "Fresh Orange & Roasted Pumpkin Seeds",
      pref: ["Vegetarian", "Vegan", "Non-vegetarian", "No preference"],
      desc: "One whole seasonal orange and a palm-sized portion of lightly salted roasted pumpkin seeds.",
      allergens: []
    }
  ],
  lunch: [
    {
      name: "Grilled Herb Chicken & Quinoa",
      pref: ["Non-vegetarian", "No preference"],
      desc: "Lean grilled chicken breast seasoned with oregano, served over fluffy quinoa and steamed green beans.",
      allergens: []
    },
    {
      name: "Mediterranean Lentil & Vegetable Bowl",
      pref: ["Vegetarian", "Vegan", "Non-vegetarian", "No preference"],
      desc: "Spiced brown lentils, diced cucumber, tomatoes, kalamata olives, and olive oil vinaigrette over warm brown rice.",
      allergens: []
    },
    {
      name: "Paneer or Tofu Tikka Wrap",
      pref: ["Vegetarian", "Vegan", "No preference"],
      desc: "Grilled spiced paneer or firm tofu wrapped in a whole-wheat flatbread with crisp shredded cabbage and mint dressing.",
      allergens: ["milk", "dairy", "soy", "gluten"]
    },
    {
      name: "Grilled Salmon & Steamed Asparagus",
      pref: ["Non-vegetarian", "No preference"],
      desc: "Pan-seared wild salmon fillet with lemon wedge, steamed asparagus, and roasted baby red potatoes.",
      allergens: ["fish"]
    },
    {
      name: "Chickpea & Sweet Potato Salad",
      pref: ["Vegetarian", "Vegan", "Non-vegetarian", "No preference"],
      desc: "Roasted sweet potatoes, hearty chickpeas, baby greens, and a squeeze of fresh lemon and olive oil.",
      allergens: []
    }
  ],
  dinner: [
    {
      name: "Baked White Fish & Brown Rice",
      pref: ["Non-vegetarian", "No preference"],
      desc: "Tender baked white fish with garlic herbs, steamed brown rice, and a generous portion of sautéed zucchini.",
      allergens: ["fish"]
    },
    {
      name: "Hearty Lentil Dal & Steamed Basmati",
      pref: ["Vegetarian", "Vegan", "Non-vegetarian", "No preference"],
      desc: "Yellow dal tempered with cumin, turmeric, and ginger, served with steamed basmati rice and a side of cucumber salad.",
      allergens: []
    },
    {
      name: "Tempeh or Chicken Stir-Fry",
      pref: ["Vegetarian", "Vegan", "Non-vegetarian", "No preference"],
      desc: "Stir-fried vegetables (broccoli, carrots, bok choy) with your choice of protein over buckwheat noodles or rice.",
      allergens: ["soy"]
    },
    {
      name: "Vegetable Bean Stew with Whole Grain Roll",
      pref: ["Vegetarian", "Vegan", "Non-vegetarian", "No preference"],
      desc: "Slow-simmered kidney bean and root vegetable stew with fresh thyme, served with a whole-grain dinner roll.",
      allergens: ["gluten"]
    }
  ],
  wellness: [
    "Take a 15-minute gentle walk outdoors in natural daylight after your midday meal.",
    "Practice 5 minutes of mindful posture alignment and gentle neck/shoulder mobility stretches.",
    "Drink a glass of water before each meal and keep an eye on pale straw hydration color.",
    "Spend 10 minutes unwinding without screens before bedtime to support restorative sleep.",
    "Reflect on one positive healthy choice you made today for your long-term athletic vitality."
  ]
};

// POST /api/meal-plans/generate
router.post('/generate', (req, res) => {
  const {
    age = "20",
    dietaryPreference = "No preference",
    allergies = [],
    foodsToAvoid = [],
    activityLevel = "Moderate",
    goal = "General healthy eating",
    hasMedicalCondition = "No",
    substanceTopic = null
  } = req.body;

  // Normalized allergen and avoid lists
  const rawAllergies = Array.isArray(allergies) ? allergies : (typeof allergies === 'string' ? allergies.split(',').map(s => s.trim()) : []);
  const rawAvoids = Array.isArray(foodsToAvoid) ? foodsToAvoid : (typeof foodsToAvoid === 'string' ? foodsToAvoid.split(',').map(s => s.trim()) : []);
  const allFilters = [...rawAllergies, ...rawAvoids].map(s => s.toLowerCase()).filter(Boolean);

  const isSafe = (item) => {
    // Check dietary preference
    if (dietaryPreference !== "No preference" && item.pref && !item.pref.includes(dietaryPreference)) {
      return false;
    }
    // Check allergen safety
    if (item.allergens && item.allergens.some(a => allFilters.some(f => a.includes(f) || f.includes(a)))) {
      return false;
    }
    // Check name and description for forbidden terms
    const text = (item.name + ' ' + item.desc).toLowerCase();
    if (allFilters.some(f => text.includes(f))) {
      return false;
    }
    return true;
  };

  const getSafeItems = (category) => {
    const list = MEAL_DATABASE[category].filter(isSafe);
    return list.length > 0 ? list : MEAL_DATABASE[category];
  };

  const safeBreakfasts = getSafeItems('breakfast');
  const safeSnacks = getSafeItems('snack');
  const safeLunches = getSafeItems('lunch');
  const safeDinners = getSafeItems('dinner');

  const daysCount = 7;
  const daysNames = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

  const generatedDays = daysNames.map((name, i) => {
    const b = safeBreakfasts[i % safeBreakfasts.length];
    const s1 = safeSnacks[i % safeSnacks.length];
    const l = safeLunches[i % safeLunches.length];
    const s2 = safeSnacks[(i + 1) % safeSnacks.length];
    const d = safeDinners[i % safeDinners.length];
    const w = MEAL_DATABASE.wellness[i % MEAL_DATABASE.wellness.length];

    return {
      dayName: name,
      dayIndex: i + 1,
      breakfast: b.name + " — " + b.desc,
      midMorning: s1.name + " — " + s1.desc,
      lunch: l.name + " — " + l.desc,
      eveningSnack: s2.name + " — " + s2.desc,
      dinner: d.name + " — " + d.desc,
      hydration: activityLevel === 'High'
        ? "Aim for 8-10 glasses of water, with an extra 500ml around workouts. Keep urine pale straw-colored."
        : "Aim for 6-8 glasses of water distributed evenly throughout the day.",
      wellnessActivity: w
    };
  });

  // Substance warning
  let substanceWarning = null;
  if (substanceTopic && substanceTopic !== 'Prefer not to say' && substanceTopic !== 'None') {
    substanceWarning = {
      title: "Important Health & Nutrition Notice",
      message: "Substance use can affect health, appetite, sleep, hydration, and overall wellbeing in different ways. Nutrition alone cannot treat substance dependence or withdrawal. Speak to a qualified healthcare professional for individualized medical advice."
    };
  }

  // Medical condition warning
  let medicalConditionNotice = null;
  if (hasMedicalCondition === 'Yes') {
    medicalConditionNotice = "For a medical condition or specialized therapeutic diet, please consult a qualified doctor or registered dietitian rather than relying on an automated general meal plan.";
  }

  const allergyNotice = allFilters.length > 0
    ? `Filtered to exclude: ${allFilters.join(', ')}. Please check food labels carefully. Automated suggestions may contain errors. If you have a serious allergy, confirm ingredients with a qualified professional and the food manufacturer.`
    : "Please check food labels carefully. If you have food allergies, confirm ingredients before eating.";

  const disclaimer = "This meal planner provides general nutrition information only. It is not a medical diet, detox plan, withdrawal treatment, or substitute for advice from a doctor or registered dietitian.";

  res.json({
    success: true,
    plan: {
      dietaryPreference,
      allergies: rawAllergies,
      foodsToAvoid: rawAvoids,
      activityLevel,
      goal,
      substanceTopic,
      days: generatedDays,
      substanceWarning,
      medicalConditionNotice,
      allergyNotice,
      disclaimer,
      createdAt: new Date().toISOString()
    }
  });
});

// GET /api/meal-plans/my-plans
router.get('/my-plans', (req, res) => {
  const plans = getMealPlans();
  res.json({ success: true, plans });
});

// POST /api/meal-plans/save
router.post('/save', (req, res) => {
  const { plan } = req.body;
  if (!plan) {
    return res.status(400).json({ success: false, message: 'Plan data required' });
  }

  const plans = getMealPlans();
  const newPlan = {
    planId: `mp-${Date.now()}`,
    userId: 'current-user',
    ...plan,
    savedAt: new Date().toISOString()
  };

  plans.unshift(newPlan);
  saveMealPlans(plans);

  res.status(201).json({ success: true, plan: newPlan });
});

export default router;
