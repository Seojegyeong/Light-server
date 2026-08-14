import Anthropic from "@anthropic-ai/sdk";
import { findTerm } from "./termService.js";

// 뉴스 기사 텍스트와 사용자 API 키를 받아 금융 용어 + 설명 배열을 반환하는 함수
// 고정 클라이언트 제거 — 매 요청마다 사용자 키로 클라이언트 초기화
export async function extractTerms(text, apiKey) {
  // 전달받은 사용자 API 키로 Claude 클라이언트 초기화
  const client = new Anthropic({ apiKey });

  // 1단계: Claude가 기사에서 금융 용어 이름만 추출
  // 설명은 이 단계에서 생성하지 않음 — terms.json 우선 사용하기 때문
  const extractMessage = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `다음 뉴스 기사에서 금융 및 경제 용어만 추출해주세요.
결과는 JSON 배열 형식으로만 응답하세요. 다른 설명은 하지 마세요.

예시: ["PER", "금리", "채권", "코스피"]

기사:
${text}`,
      },
    ],
  });

  // Claude가 ```json ... ``` 코드블록으로 감싸서 응답하는 경우가 있어서 제거 후 파싱
  const extractedNames = JSON.parse(
    extractMessage.content[0].text.trim().replace(/^```json\s*|\s*```$/g, ""),
  );

  // 2단계: 추출된 용어마다 설명 결정
  // Promise.all — 여러 비동기 작업을 병렬로 실행해서 응답 속도 향상
  const terms = await Promise.all(
    extractedNames.map(async (name) => {
      // terms.json에서 먼저 조회
      const existing = findTerm(name);

      if (existing) {
        // terms.json에 등록된 용어 → API 호출 없이 기존 설명 그대로 사용
        return {
          id: existing.id,
          name: existing.name,
          description: existing.description,
          example: existing.example ?? null,
          category: existing.category,
          aliases: existing.aliases ?? [],
        };
      }

      // terms.json에 없는 용어 → Claude API로 설명 생성
      // 이 경우에만 추가 API 호출 발생 (사용자 비용 최소화)
      // terms.json에 없는 용어 → Claude API로 설명 + 예시 문장 생성
      const descMessage = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: `"${name}"에 대해 아래 JSON 형식으로만 응답해주세요. 다른 말은 하지 마세요.

{
  "description": "2~3문장의 금융/경제 용어 설명",
  "example": "실제 뉴스 기사에서 볼 수 있는 예시 문장 1개"
}`,
          },
        ],
      });

      const parsed = JSON.parse(
        descMessage.content[0].text.trim().replace(/^```json\s*|\s*```$/g, ""),
      );

      return { id: null, name, description: parsed.description, example: parsed.example ?? null, category: null, aliases: [] };
    }),
  );

  return terms;
}
