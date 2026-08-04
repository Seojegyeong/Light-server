import { Router } from 'express';
import { extractTerms } from '../services/claudeService.js';

const router = Router();

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text 필드가 필요합니다.' });
  }

  const terms = await extractTerms(text);
  res.json({ terms });
});

export default router;
