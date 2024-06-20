import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { CommaSeparatedListOutputParser, StringOutputParser } from '@langchain/core/output_parsers';


const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
});

const makeQuestion = async () => {
  const prompt = PromptTemplate.fromTemplate(
    `Ask me a trivia question about psychedelic drugs.`,
  );
  const chain = prompt
    .pipe(model)
    .pipe(new StringOutputParser());
  return await chain.invoke();
};
const makePossibleAnswers = async (question: string) => {
  const parser = new CommaSeparatedListOutputParser()
  console.log(parser.getFormatInstructions())
  const prompt = PromptTemplate.fromTemplate(
    `Give 4 possible answers for {question} as a array, each answer separated by
commas,
3 false and 1 correct, in a random order, without repetition.`,
  );
//! apply the CommaSeparatedListOutputParser to the chain
  const chain = prompt
    .pipe(model)
    .pipe(new CommaSeparatedListOutputParser());
  return await chain.invoke({ question: question });
};

export async function GET() {
  const question = await makeQuestion();
  const answers = await
    makePossibleAnswers(question);

  return Response.json({ question, answers });
}