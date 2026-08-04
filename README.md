# light-server

light 크롬 확장 프로그램의 백엔드 API 서버입니다.
뉴스 기사 본문을 받아 AI로 금융 용어를 추출하여 반환합니다.

## Tech Stack

- Node.js
- Express
- Claude API (Anthropic)

## API

### POST /api/extract

뉴스 기사 본문에서 금융 용어를 추출합니다.

**Request**
```json
{ "text": "뉴스 기사 본문" }
```

**Response**
```json
{ "terms": ["PER", "금리", "채권"] }
```

## Getting Started

```bash
npm install
cp .env.example .env  # 환경변수 설정
npm start
```

## Environment Variables

| 변수명 | 설명 |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API 키 |
| `PORT` | 서버 포트 (기본값: 3000) |
