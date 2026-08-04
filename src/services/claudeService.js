import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function extractTerms(text) {
  // TODO: Claude API로 금융 용어 추출
}
