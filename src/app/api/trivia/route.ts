import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
//🟠 remove imports of StringOutputParser & CommaSeparatedListOutputParser
//🟠 we will need this one to build a new chain structure
import { RunnableSequence } from '@langchain/core/runnables';
//🟠 adding the StructuredOutputParser to replace the other parsers
import { StructuredOutputParser } from 'langchain/output_parsers';
//🟠 we will use the zod schema to define the types of the returned data
import { z } from 'zod';

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
});

//🟠 Zod is used to define if a field is a string, number, array etc
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    question: z
      .string()
      .describe(`tell me a random psychedelic trivia question`),
    answers: z.array(z.string()).describe(`
                give 4 possible answers, in a random order, 
                out of which only one is true.`),
    correctIndex: z
      .number()
      .describe(`the number of the correct answer, zero indexed`),
  })
);

//🟠 define a new chain with RunnableSequence
const chain = RunnableSequence.from([
  PromptTemplate.fromTemplate(
    `Answer the user's question as best as possible.\n
        {format_instructions}`
  ),
  model,
  parser,
]);

//🟠 using the StructuredOutputParser we can now wrap all the
//🟠 data into one single structure
const makeQuestionAndAnswers = async () => {
  //🟠 returning a JSON the defined structure
  return await chain.invoke({
    format_instructions: parser.getFormatInstructions(),
  });
};

export async function GET() {
  //🟠 makeQuestion() & makePossibleAnswers() are merged in one function
  const data = await makeQuestionAndAnswers();
  return Response.json({ data });
}
