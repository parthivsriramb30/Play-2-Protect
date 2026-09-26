import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import medicineRoutes from './routes/medicineRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import puzzleRoutes from './routes/puzzleRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import mealPlannerRoutes from './routes/mealPlannerRoutes.js';
import supportPlanRoutes from './routes/supportPlanRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger for visibility
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Play2Protect Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Register API routes
app.use('/api/medicine', medicineRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/puzzles', puzzleRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/rewards', offerRoutes); // handles /api/rewards/claim
app.use('/api/admin', adminRoutes);

// Video, Professional Directory, and Support Guidance
app.use('/api/videos', videoRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/counselling-sessions', (req, res, next) => {
  req.url = '/sessions/all';
  professionalRoutes(req, res, next);
});
app.use('/api/support', supportRoutes);

// Personalized Meal Planner & Step-by-Step Support Plan
app.use('/api/meal-plans', mealPlannerRoutes);
app.use('/api/support-plans', supportPlanRoutes);
app.use('/api/support-goals', (req, res, next) => {
  req.url = '/goals' + (req.url === '/' ? '' : req.url);
  supportPlanRoutes(req, res, next);
});

// Gamification routes mount at top level for /api/xp, /api/badges, /api/progress, /api/daily-activity, /api/certificates
app.use('/api', gamificationRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on Play2Protect API server`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred. Please try again.'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🛡️ PLAY2PROTECT Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
