import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
});

const prompt = PromptTemplate.fromTemplate(`Ask me a trivia about psychedelic drugs.`);
const chain = new LLMChain({
  llm: model,
  prompt,
});

export async function GET() {
  const gptResponse = await chain.invoke();
  return Response.json({ question: gptResponse.text });
}