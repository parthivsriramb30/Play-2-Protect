import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, `../data/${file}`), 'utf8'));
  } catch (err) {
    return [];
  }
};

const writeJson = (file, data) => {
  fs.writeFileSync(path.join(__dirname, `../data/${file}`), JSON.stringify(data, null, 2), 'utf8');
};

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const videos = readJson('expertVideos.json');
  const profs = readJson('professionals.json');
  const sessions = readJson('counsellingSessions.json');
  const offers = readJson('offers.json');

  const adminStats = {
    totalUsers: 142,
    activeUsers: 89,
    modulesCompleted: 312,
    averageQuizScore: 84.5,
    storiesCompleted: 195,
    certificatesGenerated: 48,
    rewardsClaimed: 62,
    totalVideos: videos.length,
    verifiedVideos: videos.filter(v => v.verified).length,
    totalProfessionals: profs.length,
    upcomingSessions: sessions.filter(s => s.active !== false).length,
    activeOffers: offers.filter(o => o.active !== false).length,
    lastUpdated: new Date().toISOString()
  };

  res.json({
    success: true,
    stats: adminStats
  });
});

// POST /api/admin/offers/toggle
router.post('/offers/toggle', (req, res) => {
  const { offerId } = req.body;
  const offers = readJson('offers.json');
  const offer = offers.find(o => o.id === offerId);
  if (!offer) {
    return res.status(404).json({ success: false, message: 'Offer not found' });
  }
  offer.active = !offer.active;
  writeJson('offers.json', offers);
  res.json({ success: true, offerId, active: offer.active });
});

// POST /api/admin/videos/toggle
router.post('/videos/toggle', (req, res) => {
  const { videoId, field = 'active' } = req.body;
  const videos = readJson('expertVideos.json');
  const video = videos.find(v => v.id === videoId);
  if (!video) {
    return res.status(404).json({ success: false, message: 'Video not found' });
  }
  video[field] = !video[field];
  writeJson('expertVideos.json', videos);
  res.json({ success: true, videoId, [field]: video[field] });
});

// POST /api/admin/professionals/toggle
router.post('/professionals/toggle', (req, res) => {
  const { professionalId } = req.body;
  const profs = readJson('professionals.json');
  const prof = profs.find(p => p.id === professionalId);
  if (!prof) {
    return res.status(404).json({ success: false, message: 'Professional not found' });
  }
  prof.active = !prof.active;
  writeJson('professionals.json', profs);
  res.json({ success: true, professionalId, active: prof.active });
});

export default router;
