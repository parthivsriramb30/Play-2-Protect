import express from 'express';
import { generateChatResponse } from '../services/geminiService.js';

const router = express.Router();

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'A valid text prompt message is required.'
      });
    }

    const reply = await generateChatResponse(message.trim(), history);
    return res.json({
      success: true,
      reply,
      disclaimer: 'Educational information only. Always verify current anti-doping information through official resources and qualified professionals.'
    });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI response. Please try again in a moment.'
    });
  }
});

export default router;
