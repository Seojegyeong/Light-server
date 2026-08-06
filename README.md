<div align="center">

<img width="1280" height=auto alt="main_1" src="https://github.com/user-attachments/assets/b716c4e9-2c1e-4926-a1b7-612f279ce9bd" />

</div>

<br>
<br>

## ✨ About light-server

light-server는 light 크롬 확장 프로그램의 백엔드 API 서버입니다.

경제 뉴스 기사 본문을 받아 AI로 금융 용어를 추출하고, 정의와 예시 문장을 반환합니다.
내부 용어 사전을 우선 조회해 불필요한 API 호출을 최소화하고,
사전에 없는 용어는 Claude AI가 실시간으로 설명을 생성합니다.

<br>

## 🧩 How It Works

<div align="center">
<img width="200" height=auto src="https://github.com/user-attachments/assets/39385040-36cf-4e9e-b76a-3a843462bf9d" />
</div>

<br>

## 📡 API Reference

### POST /api/extract

**Request**

| 위치   | 키          | 설명                          |
| ------ | ----------- | ----------------------------- |
| Header | `x-api-key` | 사용자 Claude API 키 (필수)   |
| Body   | `text`      | 뉴스 기사 본문 (string, 필수) |

**Response**

```json
{
  "terms": [
    {
      "name": "PER",
      "description": "주가를 주당순이익으로 나눈 밸류에이션 지표.",
      "example": "삼성전자의 PER이 15배로 업종 평균보다 낮게 거래되고 있다."
    }
  ]
}
```

**Error**

| 코드  | 사유                              |
| ----- | --------------------------------- |
| `400` | `text` 필드 누락 또는 잘못된 타입 |
| `401` | `x-api-key` 헤더 누락             |

<br>

## 🚀 Getting Started

```bash
npm install
cp .env.example .env   # PORT 설정
npm start              # 프로덕션
npm run dev            # 개발 (파일 변경 감지)
```

**환경변수**

| 변수명 | 설명      |
| ------ | --------- |
| `PORT` | 서버 포트 |

**배포**

Railway로 운영 중입니다.

```
https://light-server-production-d1fd.up.railway.app
```

> Claude API 키는 서버에 저장하지 않습니다.
> 클라이언트가 `x-api-key` 헤더로 직접 전달합니다.

<br>

## 🛠 Tech Stack

- Node.js + Express 5
- Claude API (Anthropic) — Haiku 4.5
- ES Modules

<br>

## 📁 Project Structure

```
src/
├── app.js               # Express 앱 설정
├── routes/
│   └── extract.js       # POST /api/extract
├── services/
│   ├── claudeService.js # 2단계 AI 처리
│   └── termService.js   # terms.json 조회
└── data/
    └── terms.json       # 내부 용어 사전
```

<br>

<div align="center">

<img width="100" height=auto alt="logo" src="https://github.com/user-attachments/assets/77ca518b-231b-43e4-96cd-0e1fde0ab9ef" />

<sub>© 2026 light. All rights reserved.</sub>

</div>
