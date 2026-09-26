import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/offers.json');

const getOffers = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('Error reading offers data:', err);
    return [];
  }
};

// GET /api/offers
router.get('/', (req, res) => {
  const offers = getOffers();
  res.json({ success: true, count: offers.length, offers });
});

// POST /api/rewards/claim
router.post('/claim', (req, res) => {
  const { offerId, userPoints = 100 } = req.body;
  const offers = getOffers();
  const offer = offers.find(o => o.id === offerId);

  if (!offer) {
    return res.status(404).json({ success: false, message: 'Offer not found' });
  }

  if (userPoints < offer.pointsCost) {
    return res.status(400).json({
      success: false,
      message: `Insufficient reward points. You need ${offer.pointsCost} points, but have ${userPoints}.`
    });
  }

  // Generate unique voucher code based on demo offer pattern
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const claimedCode = `${offer.code}-${randomSuffix}`;

  res.json({
    success: true,
    claimed: true,
    code: claimedCode,
    pointsDeducted: offer.pointsCost,
    offerTitle: offer.title,
    expiry: offer.expiry,
    disclaimer: offer.disclaimer,
    message: `Offer claimed! Use code ${claimedCode} with our sports nutrition partner.`
  });
});

export default router;
