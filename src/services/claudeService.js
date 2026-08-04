import Anthropic from '@anthropic-ai/sdk';
import { findTerm } from './termService.js';

// .env의 API 키로 Claude 클라이언트 초기화
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 뉴스 기사 텍스트를 받아 금융 용어 + 설명 배열을 반환하는 함수
export async function extractTerms(text) {
  // 1단계: Claude가 기사에서 금융 용어 이름만 추출
  // 설명은 이 단계에서 생성하지 않음 — terms.json 우선 사용하기 때문
  const extractMessage = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
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
    extractMessage.content[0].text.trim().replace(/^```json\s*|\s*```$/g, '')
  );

  // 2단계: 추출된 용어마다 설명 결정
  // Promise.all — 여러 비동기 작업을 병렬로 실행해서 응답 속도 향상
  const terms = await Promise.all(
    extractedNames.map(async (name) => {
      // terms.json에서 먼저 조회
      const existing = findTerm(name);

      if (existing) {
        // terms.json에 등록된 용어 → API 호출 없이 기존 설명 그대로 사용
        return { name: existing.name, description: existing.description };
      }

      // terms.json에 없는 용어 → Claude API로 설명 생성
      // 이 경우에만 추가 API 호출 발생 (비용 최소화)
      const descMessage = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: `"${name}"의 금융/경제 용어 설명을 2~3문장으로 작성해주세요. 설명만 작성하고 다른 말은 하지 마세요.`,
          },
        ],
      });

      return { name, description: descMessage.content[0].text.trim() };
    })
  );

  return terms;
}
