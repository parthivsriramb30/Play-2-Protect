// Unified API service for Play2Protect

const API_BASE = '/api';

export async function searchMedicine(name) {
  try {
    const res = await fetch(`${API_BASE}/medicine/search?name=${encodeURIComponent(name || '')}`);
    return await res.json();
  } catch (err) {
    console.error('searchMedicine error:', err);
    return { success: false, message: 'Network error connecting to medicine database.', results: [] };
  }
}

export async function sendChatMessage(message, history = []) {
  try {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    return await res.json();
  } catch (err) {
    console.error('sendChatMessage error:', err);
    return {
      success: false,
      reply: 'Unable to reach the Play2Protect educational AI service. Please check your connection and try again.'
    };
  }
}

export async function getModules() {
  try {
    const res = await fetch(`${API_BASE}/modules`);
    return await res.json();
  } catch (err) {
    console.error('getModules error:', err);
    return { success: false, modules: [] };
  }
}

export async function getModuleById(id) {
  try {
    const res = await fetch(`${API_BASE}/modules/${id}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to load module.' };
  }
}

export async function getQuizzes(topic, limit) {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/quizzes`);
    if (topic) url.searchParams.set('topic', topic);
    if (limit) url.searchParams.set('limit', limit);
    const res = await fetch(url.toString());
    return await res.json();
  } catch (err) {
    return { success: false, quizzes: [] };
  }
}

export async function submitQuiz(answers) {
  try {
    const res = await fetch(`${API_BASE}/quizzes/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    return await res.json();
  } catch (err) {
    return { success: false, earnedXP: 0, message: 'Failed to submit quiz.' };
  }
}

export async function getMissions() {
  try {
    const res = await fetch(`${API_BASE}/missions`);
    return await res.json();
  } catch (err) {
    return { success: false, missions: [] };
  }
}

export async function getPuzzles() {
  try {
    const res = await fetch(`${API_BASE}/puzzles`);
    return await res.json();
  } catch (err) {
    return { success: false, puzzles: [] };
  }
}

export async function verifyPuzzle(puzzleId, submission) {
  try {
    const res = await fetch(`${API_BASE}/puzzles/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzleId, submission })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to verify puzzle.' };
  }
}

export async function getLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return await res.json();
  } catch (err) {
    return { success: false, leaderboard: [] };
  }
}

export async function getOffers() {
  try {
    const res = await fetch(`${API_BASE}/offers`);
    return await res.json();
  } catch (err) {
    return { success: false, offers: [] };
  }
}

export async function claimReward(offerId, userPoints) {
  try {
    const res = await fetch(`${API_BASE}/rewards/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, userPoints })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to claim reward.' };
  }
}

export async function recordDailyActivity(activityType, userId) {
  try {
    const res = await fetch(`${API_BASE}/daily-activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityType, userId })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function getAdminStats() {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`);
    return await res.json();
  } catch (err) {
    return { success: false, stats: null };
  }
}

export async function toggleOffer(offerId) {
  try {
    const res = await fetch(`${API_BASE}/admin/offers/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

// ==========================================
// NEW FEATURES API METHODS
// ==========================================

// Feature 1: Expert Videos
export async function getVideos(category, recommended, search) {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/videos`);
    if (category) url.searchParams.set('category', category);
    if (recommended) url.searchParams.set('recommended', 'true');
    if (search) url.searchParams.set('search', search);
    const res = await fetch(url.toString());
    return await res.json();
  } catch (err) {
    console.error('getVideos error:', err);
    return { success: false, videos: [] };
  }
}

export async function getVideoById(id) {
  try {
    const res = await fetch(`${API_BASE}/videos/${id}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to load video.' };
  }
}

export async function addVideo(videoData) {
  try {
    const res = await fetch(`${API_BASE}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to add video.' };
  }
}

export async function toggleVideo(videoId, field = 'active') {
  try {
    const res = await fetch(`${API_BASE}/admin/videos/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, field })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

// Feature 4: Professionals & Counselling Sessions
export async function getProfessionals(filters = {}) {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/professionals`);
    if (filters.category) url.searchParams.set('category', filters.category);
    if (filters.mode) url.searchParams.set('mode', filters.mode);
    if (filters.location) url.searchParams.set('location', filters.location);
    if (filters.search) url.searchParams.set('search', filters.search);
    const res = await fetch(url.toString());
    return await res.json();
  } catch (err) {
    console.error('getProfessionals error:', err);
    return { success: false, professionals: [] };
  }
}

export async function getProfessionalById(id) {
  try {
    const res = await fetch(`${API_BASE}/professionals/${id}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to load professional.' };
  }
}

export async function addProfessional(data) {
  try {
    const res = await fetch(`${API_BASE}/professionals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to add professional.' };
  }
}

export async function toggleProfessional(professionalId) {
  try {
    const res = await fetch(`${API_BASE}/admin/professionals/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professionalId })
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function getCounsellingSessions() {
  try {
    const res = await fetch(`${API_BASE}/counselling-sessions`);
    return await res.json();
  } catch (err) {
    return { success: false, sessions: [] };
  }
}

export async function addCounsellingSession(data) {
  try {
    const res = await fetch(`${API_BASE}/professionals/sessions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to create counselling session.' };
  }
}

// Features 2 & 3: Support Guidance & Craving Activities
export async function getSupportGuidance(substance) {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/support/guidance`);
    if (substance) url.searchParams.set('substance', substance);
    const res = await fetch(url.toString());
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to load support guidance.' };
  }
}

export async function getSupportActivities() {
  try {
    const res = await fetch(`${API_BASE}/support/activities`);
    return await res.json();
  } catch (err) {
    return { success: false, activities: null };
  }
}

// ==========================================
// FEATURE A: Healthy Meal & Wellness Planner
// ==========================================

export async function generateMealPlan(preferences) {
  try {
    const res = await fetch(`${API_BASE}/meal-plans/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
    return await res.json();
  } catch (err) {
    console.error('generateMealPlan error:', err);
    return { success: false, message: 'Failed to generate meal plan.' };
  }
}

export async function saveMealPlan(plan) {
  try {
    const res = await fetch(`${API_BASE}/meal-plans/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to save meal plan.' };
  }
}

export async function getMyMealPlans() {
  try {
    const res = await fetch(`${API_BASE}/meal-plans/my-plans`);
    return await res.json();
  } catch (err) {
    return { success: false, plans: [] };
  }
}

// ==========================================
// FEATURE B: Step-by-Step Professional Support Plan
// ==========================================

export async function getMySupportPlan() {
  try {
    const res = await fetch(`${API_BASE}/support-plans/my-plan`);
    return await res.json();
  } catch (err) {
    return { success: false, plan: null };
  }
}

export async function saveSupportPlan(planData) {
  try {
    const res = await fetch(`${API_BASE}/support-plans/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to save support plan.' };
  }
}

export async function getSupportGoals() {
  try {
    const res = await fetch(`${API_BASE}/support-goals`);
    return await res.json();
  } catch (err) {
    return { success: false, goals: [] };
  }
}

export async function addSupportGoal(title) {
  try {
    const res = await fetch(`${API_BASE}/support-goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to add support goal.' };
  }
}

export async function toggleSupportGoal(goalId) {
  try {
    const res = await fetch(`${API_BASE}/support-goals/${goalId}/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to toggle support goal.' };
  }
}
