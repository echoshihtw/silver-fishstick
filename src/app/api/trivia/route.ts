import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';


const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
});

const makeQuestion = async () => {
  const prompt = PromptTemplate.fromTemplate(`Ask me a trivia about psychedelic drugs.`);
  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  return await chain.invoke();
};

export async function GET() {
  const question = await makeQuestion();
  return Response.json({ question });
}