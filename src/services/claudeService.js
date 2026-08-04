import Anthropic from "@anthropic-ai/sdk"; // Anthropic 공식 SDK

// .env의 API 키로 Claude 클라이언트 초기화
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 뉴스 기사 텍스트를 받아 금융 용어 배열을 반환하는 함수
export async function extractTerms(text) {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001", // Haiku 모델 사용
    max_tokens: 1024, // 응답 최대 토큰 수
    messages: [
      {
        role: "user",
        // JSON 배열로만 응답하도록 프롬프트 구성
        content: `다음 뉴스 기사에서 금융 및 경제 용어만 추출해주세요.
결과는 JSON 배열 형식으로만 응답하세요. 다른 설명은 하지 마세요.

예시: ["PER", "금리", "채권", "코스피"]

기사:
${text}`,
      },
    ],
  });

  const content = message.content[0].text.trim(); // 응답 텍스트 추출
  return JSON.parse(content); // JSON 문자열 → 배열로 변환
}
