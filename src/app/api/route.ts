import { ChatOpenAI } from '@langchain/openai';
// use the PromptTemplate to avoid repetition
import { PromptTemplate } from '@langchain/core/prompts';
// using the LLMChain; maybe the most straightforward chain
import { LLMChain } from 'langchain/chains';

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
// JavaScript Mustache template format
// const prompt = PromptTemplate.fromTemplate(
//   inputVariables: [ "subject"],
//   template: "Tell me a story title about {{subject}}",
//   {
//     templateFormat: "mustache"
//   }
// )


// a chain that links the model, the prompt and the verbose options
const chain = new LLMChain({
  llm: model,
  prompt,
  // use verbose to debug the chain
  verbose: true,
});

export async function POST(req: Request) {
  const { subject } = await req.json();
  // passing down the { subject } parameter
  const formattedPrompt: string = await prompt.format({
    subject,
  });
  // const gptResponse = await model.invoke(formattedPrompt);
  // evoke the chain
  const gptResponse = await chain.invoke({ subject });

  return Response.json({ data: gptResponse });
}
