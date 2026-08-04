import { Router } from 'express';
import { extractTerms } from '../services/claudeService.js';

const router = Router(); // 라우터 인스턴스 생성

// POST /api/extract 요청 처리
router.post('/', async (req, res) => {
  const { text } = req.body; // 요청 body에서 text 추출

  // text가 없거나 문자열이 아니면 400 에러 반환
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text 필드가 필요합니다.' });
  }

  const terms = await extractTerms(text); // Claude API로 금융 용어 추출
  res.json({ terms });                    // 결과 반환
});

export default router;
