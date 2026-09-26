import React, { createContext, useContext, useState, useEffect } from 'react';
import { recordDailyActivity } from '../services/api';

const GamificationContext = createContext(null);
const STORAGE_KEY = 'p2p_gamification';

export function GamificationProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      xp: 120,
      streak: 3,
      streakHistory: [true, true, true, false, false, false, false],
      lastActivityDate: new Date().toISOString().split('T')[0],
      rewardPoints: 45,
      completedLessons: ['mod-01'],
      completedQuizzes: ['q-01'],
      completedStories: ['story-01'],
      completedPuzzles: ['puz-01'],
      watchedVideos: ['vid-01'],
      completedSupportActivities: ['act-grounding'],
      unlockedBadges: ['badge-01', 'badge-09'],
      dailyChallengeCompleted: false
    };
  });

  // Recent toast notification state
  const [toast, setToast] = useState(null);
  // Recently unlocked badge modal
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Level calculation
  const getLevelInfo = (currentXP = state.xp) => {
    if (currentXP >= 800) {
      return { level: 5, title: 'Clean Sport Champion', minXP: 800, nextXP: null, progress: 100 };
    }
    if (currentXP >= 500) {
      const progress = Math.round(((currentXP - 500) / (800 - 500)) * 100);
      return { level: 4, title: 'Integrity Leader', minXP: 500, nextXP: 800, progress };
    }
    if (currentXP >= 250) {
      const progress = Math.round(((currentXP - 250) / (500 - 250)) * 100);
      return { level: 3, title: 'Sport Advocate', minXP: 250, nextXP: 500, progress };
    }
    if (currentXP >= 100) {
      const progress = Math.round(((currentXP - 100) / (250 - 100)) * 100);
      return { level: 2, title: 'Knowledge Explorer', minXP: 100, nextXP: 250, progress };
    }
    const progress = Math.round((currentXP / 100) * 100);
    return { level: 1, title: 'Clean Rookie', minXP: 0, nextXP: 100, progress };
  };

  const levelInfo = getLevelInfo(state.xp);

  // Add XP with level up detection and toast
  const addXP = (amount, reason = 'Activity completed') => {
    setState(prev => {
      const oldLevel = getLevelInfo(prev.xp).level;
      const newXP = prev.xp + amount;
      const newLevel = getLevelInfo(newXP).level;

      if (newLevel > oldLevel) {
        setToast({
          type: 'level-up',
          title: `Level Up! Level ${newLevel}`,
          message: `Congratulations! You've ascended to ${getLevelInfo(newXP).title}!`,
          xp: amount
        });
      } else {
        setToast({
          type: 'xp',
          title: `+${amount} XP Earned`,
          message: reason,
          xp: amount
        });
      }

      return {
        ...prev,
        xp: newXP
      };
    });
  };

  // Add reward points
  const addPoints = (points) => {
    setState(prev => ({
      ...prev,
      rewardPoints: Math.max(0, prev.rewardPoints + points)
    }));
  };

  // Deduct reward points for claiming an offer
  const deductPoints = (points) => {
    if (state.rewardPoints < points) return false;
    setState(prev => ({
      ...prev,
      rewardPoints: prev.rewardPoints - points
    }));
    return true;
  };

  // Check and unlock badge
  const unlockBadge = (badgeId, badgeDetails = {}) => {
    setState(prev => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      setNewBadge({
        id: badgeId,
        name: badgeDetails.name || 'Achievement Unlocked',
        description: badgeDetails.description || 'You reached an anti-doping education milestone.',
        icon: badgeDetails.icon || 'Award'
      });
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId]
      };
    });
  };

  // Record a meaningful activity
  const logActivity = (activityType, itemId = null) => {
    recordDailyActivity(activityType, 'current-user');
    const today = new Date().toISOString().split('T')[0];

    setState(prev => {
      const isNewDay = prev.lastActivityDate !== today;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;
      const newHistory = [...prev.streakHistory];
      if (isNewDay) {
        newHistory.shift();
        newHistory.push(true);
      }

      // Check badge triggers
      if (newStreak >= 7 && !prev.unlockedBadges.includes('badge-06')) {
        unlockBadge('badge-06', {
          name: 'Consistent Learner',
          description: 'Maintained a 7-day meaningful learning streak.'
        });
      }

      return {
        ...prev,
        streak: newStreak,
        streakHistory: newHistory,
        lastActivityDate: today
      };
    });
  };

  // Mark lesson completed
  const completeLesson = (moduleId) => {
    if (!state.completedLessons.includes(moduleId)) {
      setState(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, moduleId]
      }));
      addXP(10, 'Completed lesson module');
      addPoints(10);
      logActivity('Lesson', moduleId);

      // Trigger badges
      if (!state.unlockedBadges.includes('badge-01')) {
        unlockBadge('badge-01', { name: 'First Step', description: 'Completed your first educational lesson.' });
      }
      if (state.completedLessons.length + 1 >= 3 && !state.unlockedBadges.includes('badge-02')) {
        unlockBadge('badge-02', { name: 'Knowledge Starter', description: 'Completed 3 full learning modules.' });
      }
    }
  };

  // Mark quiz completed
  const completeQuiz = (quizId, isPerfect = false) => {
    if (!state.completedQuizzes.includes(quizId)) {
      setState(prev => ({
        ...prev,
        completedQuizzes: [...prev.completedQuizzes, quizId]
      }));
    }
    const xp = isPerfect ? 50 : 20;
    addXP(xp, isPerfect ? 'Perfect Quiz Score! (+30 bonus)' : 'Quiz completed');
    addPoints(10);
    logActivity('Quiz', quizId);

    if (isPerfect && !state.unlockedBadges.includes('badge-03')) {
      unlockBadge('badge-03', { name: 'Quiz Master', description: 'Achieved a perfect score on an anti-doping quiz.' });
    }
  };

  // Mark story completed
  const completeStory = (storyId) => {
    if (!state.completedStories.includes(storyId)) {
      setState(prev => ({
        ...prev,
        completedStories: [...prev.completedStories, storyId]
      }));
    }
    addXP(50, 'Completed decision story mission');
    addPoints(15);
    logActivity('Story', storyId);

    if (state.completedStories.length + 1 >= 3 && !state.unlockedBadges.includes('badge-04')) {
      unlockBadge('badge-04', { name: 'Story Explorer', description: 'Completed 3 interactive decision story missions.' });
    }
  };

  // Mark puzzle solved
  const completePuzzle = (puzzleId) => {
    if (!state.completedPuzzles.includes(puzzleId)) {
      setState(prev => ({
        ...prev,
        completedPuzzles: [...prev.completedPuzzles, puzzleId]
      }));
    }
    addXP(20, 'Solved anti-doping puzzle');
    addPoints(10);
    logActivity('Puzzle', puzzleId);

    if (state.completedPuzzles.length + 1 >= 5 && !state.unlockedBadges.includes('badge-05')) {
      unlockBadge('badge-05', { name: 'Puzzle Solver', description: 'Successfully solved 5 anti-doping puzzles.' });
    }
  };

  // Complete daily challenge
  const completeDailyChallenge = () => {
    if (!state.dailyChallengeCompleted) {
      setState(prev => ({
        ...prev,
        dailyChallengeCompleted: true
      }));
      addXP(10, "Completed Today's Challenge");
      addPoints(5);
      logActivity('Daily Challenge');
    }
  };

  // NEW: Watch verified educational video (+5 XP, Section 39)
  const watchVideo = (videoId) => {
    const list = state.watchedVideos || [];
    if (!list.includes(videoId)) {
      const updated = [...list, videoId];
      setState(prev => ({
        ...prev,
        watchedVideos: updated
      }));
      addXP(5, 'Watched verified educational video');
      addPoints(5);
      logActivity('Video', videoId);

      // Badge check: 5 videos -> Awareness Explorer
      if (updated.length >= 5 && !state.unlockedBadges.includes('badge-11')) {
        unlockBadge('badge-11', {
          name: 'Awareness Explorer',
          description: 'Watched 5 verified educational and medical awareness videos.'
        });
      }
    }
  };

  // NEW: Complete healthy awareness / coping activity (+5 XP, Section 39)
  const completeSupportActivity = (activityId) => {
    const list = state.completedSupportActivities || [];
    if (!list.includes(activityId)) {
      const updated = [...list, activityId];
      setState(prev => ({
        ...prev,
        completedSupportActivities: updated
      }));
      addXP(5, 'Completed healthy awareness activity');
      addPoints(5);
      logActivity('Support Activity', activityId);

      // Badge check: 5 activities -> Healthy Choices
      if (updated.length >= 5 && !state.unlockedBadges.includes('badge-13')) {
        unlockBadge('badge-13', {
          name: 'Healthy Choices',
          description: 'Completed 5 healthy-choice and grounding activities.'
        });
      }
    }
  };

  // NEW: Explore professional support resources (Badge: Support Seeker)
  const exploreProfessionalSupport = () => {
    if (!state.unlockedBadges.includes('badge-12')) {
      unlockBadge('badge-12', {
        name: 'Support Seeker',
        description: 'Explored qualified professional and clinical support resources.'
      });
      addXP(5, 'Explored professional support directory');
    }
  };

  const clearToast = () => setToast(null);
  const clearBadgeModal = () => setNewBadge(null);

  return (
    <GamificationContext.Provider value={{
      state,
      levelInfo,
      addXP,
      addPoints,
      deductPoints,
      unlockBadge,
      logActivity,
      completeLesson,
      completeQuiz,
      completeStory,
      completePuzzle,
      completeDailyChallenge,
      watchVideo,
      completeSupportActivity,
      exploreProfessionalSupport,
      toast,
      clearToast,
      newBadge,
      clearBadgeModal
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
}
