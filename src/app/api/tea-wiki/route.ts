import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

const chatHistory = [new HumanMessage('My favorite drink is tea.')];

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
  modelName: 'gpt-3.5-turbo',
});
const prompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
]);
const outputParser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(outputParser);

export async function POST() {
  const question = `Tell me a fact about my favorite tea. Do not repeat any of the previous
facts.`;

  //add in the chat history the conversations sent by the user
  chatHistory.push(new HumanMessage(question));

  const fact = await chain.invoke(
    {
      input: question,
      chat_history: chatHistory,
    },
    { configurable: { sessionId: 'unused' } }
  );

  // store each fact so that the LLM knows what not to repeat
  chatHistory.push(new AIMessage(fact));
  return Response.json({ data: fact });
}
