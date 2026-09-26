import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/expertVideos.json');

const getVideos = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('Error reading expertVideos data:', err);
    return [];
  }
};

const saveVideos = (videos) => {
  fs.writeFileSync(dataPath, JSON.stringify(videos, null, 2), 'utf8');
};

// GET /api/videos
router.get('/', (req, res) => {
  const { category, recommended, search } = req.query;
  let videos = getVideos();

  // Active filter for public view
  videos = videos.filter(v => v.active !== false);

  if (category && category !== 'All') {
    videos = videos.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }

  if (recommended === 'true') {
    videos = videos.filter(v => v.recommended === true);
  }

  if (search) {
    const q = search.toLowerCase();
    videos = videos.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.speakerName.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.specialization.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: videos.length,
    videos
  });
});

// GET /api/videos/:id
router.get('/:id', (req, res) => {
  const videos = getVideos();
  const video = videos.find(v => v.id === req.params.id);
  if (!video) {
    return res.status(404).json({ success: false, message: 'Video not found' });
  }

  // Related videos in same category
  const related = videos
    .filter(v => v.id !== video.id && v.category === video.category && v.active !== false)
    .slice(0, 3);

  res.json({ success: true, video, related });
});

// POST /api/videos (Admin add video)
router.post('/', (req, res) => {
  const {
    title, description, videoUrl, thumbnailUrl, speakerName,
    qualification, specialization, category, duration,
    verified = true, verificationType = "Verified Professional",
    verifiedBy = "Play2Protect Committee", recommended = false
  } = req.body;

  if (!title || !speakerName || !category) {
    return res.status(400).json({ success: false, message: 'Title, speaker, and category are required' });
  }

  const videos = getVideos();
  const newVideo = {
    id: `vid-${Date.now()}`,
    title: title.trim(),
    description: description?.trim() || '',
    videoUrl: videoUrl?.trim() || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: thumbnailUrl?.trim() || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    speakerName: speakerName.trim(),
    qualification: qualification?.trim() || 'Medical Professional',
    specialization: specialization?.trim() || 'Sports Health & Integrity',
    category,
    duration: duration?.trim() || '10:00',
    verified: Boolean(verified),
    verificationType,
    verifiedBy,
    verificationDate: new Date().toISOString().split('T')[0],
    recommended: Boolean(recommended),
    active: true,
    createdAt: new Date().toISOString()
  };

  videos.unshift(newVideo);
  saveVideos(videos);

  res.status(201).json({ success: true, video: newVideo });
});

// PUT /api/videos/:id (Admin toggle/edit)
router.put('/:id', (req, res) => {
  const videos = getVideos();
  const index = videos.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Video not found' });
  }

  videos[index] = {
    ...videos[index],
    ...req.body,
    id: req.params.id // preserve ID
  };

  saveVideos(videos);
  res.json({ success: true, video: videos[index] });
});

export default router;
