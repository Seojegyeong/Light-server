import 'dotenv/config';       // .env 파일 로드 (가장 먼저 실행되어야 함)
import app from './src/app.js';

const PORT = process.env.PORT ?? 3000; // .env에 PORT 없으면 기본값 3000

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
