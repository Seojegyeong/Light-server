import { Router } from 'express';
import { extractTerms } from '../services/claudeService.js';

const router = Router(); // 라우터 인스턴스 생성

// POST /api/extract 요청 처리
router.post('/', async (req, res) => {
  // 요청 헤더에서 사용자 API 키 추출
  const apiKey = req.headers['x-api-key'];

  // API 키 없으면 401 에러 반환
  if (!apiKey) {
    return res.status(401).json({ error: 'API 키가 필요합니다. x-api-key 헤더를 확인해주세요.' });
  }

  const { text } = req.body; // 요청 body에서 text 추출

  // text가 없거나 문자열이 아니면 400 에러 반환
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text 필드가 필요합니다.' });
  }

  try {
    const terms = await extractTerms(text, apiKey);
    res.json({ terms });
  } catch (err) {
    const status = err.status ?? 500;
    const message = err.message ?? '서버 오류가 발생했습니다.';
    res.status(status).json({ error: message });
  }
});

export default router;
