import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const profDataPath = path.join(__dirname, '../data/professionals.json');
const sessDataPath = path.join(__dirname, '../data/counsellingSessions.json');

const getProfessionals = () => {
  try {
    return JSON.parse(fs.readFileSync(profDataPath, 'utf8'));
  } catch (err) {
    console.error('Error reading professionals data:', err);
    return [];
  }
};

const getSessions = () => {
  try {
    return JSON.parse(fs.readFileSync(sessDataPath, 'utf8'));
  } catch (err) {
    console.error('Error reading counselling sessions data:', err);
    return [];
  }
};

const saveProfessionals = (list) => {
  fs.writeFileSync(profDataPath, JSON.stringify(list, null, 2), 'utf8');
};

const saveSessions = (list) => {
  fs.writeFileSync(sessDataPath, JSON.stringify(list, null, 2), 'utf8');
};

// GET /api/professionals
router.get('/', (req, res) => {
  const { category, mode, location, search } = req.query;
  let list = getProfessionals().filter(p => p.active !== false);

  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (mode && mode !== 'All') {
    list = list.filter(p => p.consultationMode.toLowerCase().includes(mode.toLowerCase()));
  }

  if (location && location !== 'All') {
    list = list.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.specialization.toLowerCase().includes(q) ||
      p.qualification.toLowerCase().includes(q) ||
      p.organization.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: list.length,
    professionals: list
  });
});

// GET /api/professionals/:id
router.get('/:id', (req, res) => {
  const list = getProfessionals();
  const professional = list.find(p => p.id === req.params.id);
  if (!professional) {
    return res.status(404).json({ success: false, message: 'Professional not found' });
  }

  // Related upcoming sessions by this professional
  const sessions = getSessions().filter(s => s.professionalId === professional.id && s.active !== false);

  res.json({ success: true, professional, sessions });
});

// POST /api/professionals (Admin add)
router.post('/', (req, res) => {
  const {
    name, qualification, specialization, organization,
    location, languages = ["English"], consultationMode = "Online & In-person",
    availability, contactInfo, bookingUrl, category = "Doctor",
    verificationSource = "Medical Council Verified", bio
  } = req.body;

  if (!name || !qualification || !specialization) {
    return res.status(400).json({ success: false, message: 'Name, qualification, and specialization are required' });
  }

  const list = getProfessionals();
  const newProf = {
    id: `prof-${Date.now()}`,
    name: name.trim(),
    qualification: qualification.trim(),
    specialization: specialization.trim(),
    organization: organization?.trim() || 'Accredited Healthcare Organization',
    location: location?.trim() || 'National Coverage',
    languages: Array.isArray(languages) ? languages : [languages],
    consultationMode,
    availability: availability?.trim() || 'By appointment',
    contactInfo: contactInfo?.trim() || 'Verified clinical scheduling portal',
    bookingUrl: bookingUrl?.trim() || '#request-session',
    verified: true,
    verificationSource,
    category,
    bio: bio?.trim() || 'Verified professional dedicated to student and athlete health guidance.',
    active: true,
    createdAt: new Date().toISOString()
  };

  list.unshift(newProf);
  saveProfessionals(list);

  res.status(201).json({ success: true, professional: newProf });
});

// GET /api/counselling-sessions
router.get('/sessions/all', (req, res) => {
  const sessions = getSessions().filter(s => s.active !== false);
  res.json({ success: true, count: sessions.length, sessions });
});

// POST /api/counselling-sessions (Admin add)
router.post('/sessions/create', (req, res) => {
  const {
    title, description, speaker, date, startTime, endTime,
    location, mode = "Online Webinar", capacity = 30, professionalId
  } = req.body;

  if (!title || !date || !speaker) {
    return res.status(400).json({ success: false, message: 'Title, date, and speaker are required' });
  }

  const sessions = getSessions();
  const newSess = {
    id: `sess-${Date.now()}`,
    professionalId: professionalId || 'prof-01',
    title: title.trim(),
    description: description?.trim() || '',
    speaker: speaker.trim(),
    date,
    startTime: startTime || '17:00 IST',
    endTime: endTime || '18:15 IST',
    location: location || 'Virtual Meeting Room',
    mode,
    capacity: parseInt(capacity, 10) || 30,
    registeredCount: 0,
    active: true,
    createdAt: new Date().toISOString()
  };

  sessions.unshift(newSess);
  saveSessions(sessions);

  res.status(201).json({ success: true, session: newSess });
});

export default router;
