import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';

// Layout & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import XPToast from './components/XPToast';
import BadgeModal from './components/BadgeModal';
import ProtectedRoute from './components/ProtectedRoute';

// Existing Pages
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Journey from './pages/Journey';
import SupplementChecker from './pages/SupplementChecker';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Stories from './pages/Stories';
import Puzzles from './pages/Puzzles';
import MythVsFact from './pages/MythVsFact';
import Leaderboard from './pages/Leaderboard';
import Progress from './pages/Progress';
import Rewards from './pages/Rewards';
import Certificate from './pages/Certificate';
import QuickRecall from './pages/QuickRecall';
import Admin from './pages/Admin';
import About from './pages/About';
import Features from './pages/Features';

// Support & Video Pages
import Videos from './pages/Videos';
import PersonalizedSupport from './pages/PersonalizedSupport';
import SupportNow from './pages/SupportNow';
import Professionals from './pages/Professionals';
import MealPlanner from './pages/MealPlanner';
import SupportPlan from './pages/SupportPlan';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GamificationProvider>
          <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* 1. Public Home (with exact 3 focus options) */}
                <Route path="/" element={<Home />} />
                
                {/* 2. Core 3 Options */}
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/journey" element={<Journey />} />
                <Route path="/supplement-checker" element={<SupplementChecker />} />
                
                {/* 3. Expert Awareness Videos */}
                <Route path="/videos" element={<Videos />} />

                {/* 4. Personalized Awareness & Support */}
                <Route path="/support" element={<PersonalizedSupport />} />

                {/* 5. Craving / Temptation Coping Support */}
                <Route path="/support-now" element={<SupportNow />} />

                {/* 6. Counselling & Doctor Support Directory */}
                <Route path="/professionals" element={<Professionals />} />

                {/* 7. Personalized Healthy Meal & Wellness Planner */}
                <Route path="/meal-planner" element={<MealPlanner />} />

                {/* 8. Step-by-Step Professional Support Plan */}
                <Route path="/support-plan" element={<SupportPlan />} />

                {/* 9. Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* 10. Authenticated User Experience */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/stories" element={<ProtectedRoute><Stories /></ProtectedRoute>} />
                <Route path="/puzzles" element={<ProtectedRoute><Puzzles /></ProtectedRoute>} />
                <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
                <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
                <Route path="/admin" element={<Admin />} />

                {/* 11. Additional Educational Activities */}
                <Route path="/myth-fact" element={<MythVsFact />} />
                <Route path="/recall" element={<QuickRecall />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            {/* Global Gamification Overlays */}
            <XPToast />
            <BadgeModal />
          </div>
        </GamificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
