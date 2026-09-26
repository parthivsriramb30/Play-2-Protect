# PLAY2PROTECT — Learn. Play. Protect.

> **Clean Sports Education, Anti-Doping Awareness, Drug-Risk Education & Supplement Checker**

Play2Protect is a responsive web application designed for student athletes, coaches, gym enthusiasts, and collegiate sports programs. The platform simplifies dense anti-doping regulations (WADA/NADA), dietary supplement risks, and medicine interactions through conversational AI, an optical character recognition (OCR) label scanner, interactive ethical dilemma scenarios, and gamified retention puzzles.

Designed with an intentional, human-centered sports-education visual identity—avoiding generic AI template clichés such as purple/neon gradients, floating 3D spheres, or overcomplicated commercial dashboards.

---

## 1. Project Overview

Competitive athletes are subject to the **Strict Liability** principle: *an athlete is solely and completely responsible for any substance found in their biological specimen, regardless of intent or accidental contamination.*

Play2Protect equips athletes with:
- **Immediate Answers:** Educational AI Chatbot trained on WADA 2024 classifications and Therapeutic Use Exemptions (TUEs).
- **Guided Learning:** A 3-day awareness journey exploring physiological risks, locker-room pressures, and lifelong habit pillars.
- **Product Verification:** A real-time database search and Tesseract.js OCR label scanner that detects high-risk stimulants, anabolic compounds, and threshold medications.
- **Interactive Practice:** 5 decision stories, 10 terminology & substance puzzles, and rapid myth-busting drills.
- **Official Recognition:** Automated client-side PDF certificate generation via `jsPDF`.

---

## 2. Core Features

### 🏠 Simplified Home Page
- Compact, human-designed hero with sports running track vector motif.
- **Three primary action cards**:
  1. 🤖 **AI Chatbot** (`/chatbot`)
  2. 🛡️ **Awareness Journey** (`/journey`)
  3. 🔍 **Supplement Checker** (`/supplement-checker`)
- Brief "Why Play2Protect?" rationale and minimal footer.

### 🤖 AI Chatbot (`/chatbot`)
- Backed by Google Gemini API with rigorous anti-doping safety instructions.
- Includes pre-built suggested question chips (*"What is doping?"*, *"What is TUE?"*, *"Why can supplements be risky?"*).
- Built-in local knowledge engine fallback ensuring full functionality even before an external API key is configured.
- Prominent educational disclaimers.

### 🛡️ Drug Awareness & Recovery Journey (`/journey`)
- Guided 3-day educational support path covering biological mechanisms, social dilemmas, and sustainable recovery.
- Start screen with topic selection (Stimulants, Steroids, Prescription Misuse, etc.) and motivation tracking.
- Interactive check questions, mini puzzles, and reflection with real-time XP accumulation.

### 🔍 Medicine & Supplement Checker (`/supplement-checker`)
- **Product Search:** Real-time query against 15 categorized substances (Whey Protein, Creatine, Sudafed, Asthalin, NitroX DMAA, Oxandrolone, etc.).
- **Status Badges:** 🟢 Information Available, 🟡 Requires Verification, 🔴 Potential Prohibited-Substance Match.
- **OCR Label Scanner:** Direct browser-based optical character recognition via **Tesseract.js** to extract ingredients from uploaded photos or pre-loaded sample labels.
- Never guarantees "100% Safe"—always emphasizes third-party testing and official registries.

### 🎮 Gamification & Progression
- **XP System:** +10 XP (Lesson), +20 XP (Quiz), +20 XP (Puzzle), +50 XP (Story), +30 XP (Perfect Quiz).
- **Levels:** Level 1 (0–99 XP) to Level 5 (800+ XP, Clean Sport Champion).
- **10 Achievement Badges:** First Step, Knowledge Starter, Quiz Master, Story Explorer, Puzzle Solver, Consistent Learner, etc.
- **Meaningful Streaks:** Daily streaks only advance through active educational completions (opening the site does not count).
- **Partner Demo Rewards:** Redeemable demo sponsor codes (e.g., `P2P7DAY15`) with clipboard copy.

### 📜 Certificate Generation (`/certificate`)
- Generates official vector-bordered landscape PDF certificates with personalized recipient names, verification IDs, and dates using `jsPDF`.

### 🛡️ Faculty & Admin Dashboard (`/admin`)
- Aggregated metrics (Total Students, Active Users, Average Quiz Score, Modules Completed).
- Interactive toggle controls to activate/deactivate demo offer vouchers.

---

## 3. Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, Lucide React Icons
- **OCR Engine:** Tesseract.js (client-side worker)
- **PDF Generation:** jsPDF
- **Backend:** Node.js, Express.js, CORS, Dotenv
- **AI Integration:** Google Gemini API (`@google/generative-ai`)
- **Security & Rules:** Firebase Firestore Security Rules (`firestore.rules`)

---

## 4. Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Quick Start (Single Command)

From the project root:

```bash
# 1. Install all dependencies across root, server, and client
npm run install:all

# 2. Run both Backend and Frontend concurrently
npm run dev
```

The application will be accessible at:
- **Frontend:** `http://localhost:5173` (or `http://localhost:5174` if 5173 is occupied)
- **Backend API:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

---

## 5. Environment Variables

Create a `.env` file in the root or `server` directory based on `.env.example`:

```env
# Server Port
PORT=5000

# Client Origin for CORS
CLIENT_URL=http://localhost:5173

# Google Gemini API Key (Optional)
# Obtain a free key from https://aistudio.google.com/
# If omitted, Play2Protect automatically runs an intelligent local anti-doping knowledge engine!
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (Optional - Demo mode is enabled by default)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=play2protect.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=play2protect
VITE_FIREBASE_STORAGE_BUCKET=play2protect.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 6. Firebase & Firestore Configuration

Play2Protect is built with dual-mode architecture:
1. **Out-of-the-Box Demo Mode:** Works instantly without external credentials, storing user profiles, gamification progress, and badges in local state and localStorage.
2. **Production Firebase Mode:** Add your Firebase credentials to `.env` to connect live Firebase Authentication and Cloud Firestore.

### Firestore Security Rules (`firestore.rules`)
- Public read access for educational collections: `modules`, `quizzes`, `missions`, `puzzles`, `badges`, `medicineDatabase`, `offers`.
- User-isolated access for private documents: `users/{uid}`, `progress/{uid}`, `chatSessions/{id}`, `rewardClaims/{id}`.
- Sanitized public fields for `leaderboard` (only `rank`, `displayName`, `xp`, `level`, `badge`).

---

## 7. Gemini AI Setup

1. Generate an API Key at [Google AI Studio](https://aistudio.google.com/).
2. Place the key in `server/.env` as `GEMINI_API_KEY=...`.
3. The server system prompt strictly prevents diagnosis, medical prescription, or supplement safety guarantees, ensuring 100% adherence to educational anti-doping integrity.

---

## 8. Seeding & Demo Data

The platform comes pre-seeded with realistic data in `server/data/`:
- **5 Modules:** Fundamentals, Supplement Traps, Prohibited List & TUEs, Prescription Risks, Clean Habits.
- **5 Story Missions:** One Day Before Competition, Unknown Pre-Workout, Social Media Hype, Pressure to Perform, Doping Control Station.
- **20 Quiz Questions:** Strict liability, pseudoephedrine thresholds, S1 anabolic steroids, whereabouts rules.
- **10 Interactive Puzzles:** Matching, letter scrambles, risky product detectors.
- **15 Medicine & Supplement Profiles:** Whey Protein, Creatine, Asthalin, Sudafed, DMAA, Oxandrolone, EPO, etc.
- **10 Badges & 5 Demo Offers.**

---

## 9. Important Safety Limitations

> **Educational Information Only:**  
> Play2Protect does not provide medical diagnosis, treatment, or clinical care. It is not an addiction treatment or medical rehabilitation program. The platform does not replace physicians, pharmacists, qualified sports dietitians, or official anti-doping organizations (WADA/NADA). Always verify prescription medicines and supplements on **Global DRO (globaldro.com)** before competition.
