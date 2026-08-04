import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES Module에서는 __dirname이 없어서 import.meta.url로 현재 파일 경로를 구함
const __dirname = dirname(fileURLToPath(import.meta.url));

// terms.json을 서버 시작 시 한 번만 읽어서 메모리에 올려둠 (매 요청마다 파일 읽지 않음)
const terms = JSON.parse(
  readFileSync(join(__dirname, '../data/terms.json'), 'utf-8')
);

// 용어 이름(소문자)으로 O(1) 조회하기 위해 Map으로 변환
// 예: "per" → { name: "PER", description: "..." }
const termMap = new Map();
for (const term of terms) {
  termMap.set(term.name.toLowerCase(), term);
  // aliases(별칭)도 같은 용어로 조회되도록 등록
  // 예: "주가수익비율" → PER 객체
  for (const alias of term.aliases) {
    termMap.set(alias.toLowerCase(), term);
  }
}

// 용어 이름으로 terms.json에서 조회
// 대소문자 구분 없이 검색하기 위해 소문자로 변환 후 조회
// 등록된 용어면 객체 반환, 없으면 null 반환
export function findTerm(name) {
  return termMap.get(name.toLowerCase()) ?? null;
}
