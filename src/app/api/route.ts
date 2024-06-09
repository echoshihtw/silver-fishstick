import { ChatOpenAI } from '@langchain/openai';
// use the PromptTemplate to avoid repetition
import { PromptTemplate } from '@langchain/core/prompts';
// using the LLMChain; maybe the most straightforward chain
import { LLMChain } from 'langchain/chains';
import { NextResponse } from 'next/server';


const makeStoryTitle = async (subject: string) => {
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
  });
  // establishing the general format of the template
  const prompt = new PromptTemplate({
    // The default format of writing prompt templates is the F-String format,
    // popular in Python.
    inputVariables: ['subject'],
    template: 'Tell me a funny adult drug story title about {subject},',
  });
// a chain that links the model, the prompt and the verbose options
  const chain = new LLMChain({
    llm: model,
    prompt,
    // use verbose to debug the chain
    verbose: true,
  });
  return await chain.invoke({ subject });
};

const streamStory = async (storyTitle: string) => {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
    streaming: true,
    callbacks: [{
      handleLLMNewToken: async (token) => {
        await writer.ready;
        await writer.write(encoder.encode(`${token}`));
      },
      handleLLMEnd: async () => {
        await writer.ready;
        await writer.close();
      },
    }],
  });
  const prompt = new PromptTemplate({
    inputVariables: ['storyTitle'],
    template: 'Tell me story titled {storyTitle}',
  });
  const chain = new LLMChain({
    llm: model, prompt, verbose: true,
  });
  return new NextResponse(stream.readable, { headers: { 'content-type': 'text/event-stream' } });
};

export async function POST(req: Request) {
  const { theme, storyTitle } = await req.json();
  // if the request has a storyTitle then return the
  // streamStory()
  if (storyTitle) {
    return streamStory(storyTitle);
  }
  //! if we don't have a storyTitle the return one
  const gptResponse = await makeStoryTitle(theme);
  return Response.json({ data: gptResponse });
}
