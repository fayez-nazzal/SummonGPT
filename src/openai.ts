import { Configuration, OpenAIApi } from "openai";
import { IBobble } from "./types";

let openai: OpenAIApi | undefined = undefined;

export const initOpenAI = async (apiKey: string) => {
  const configuration = new Configuration({
    apiKey,
  });

  openai = new OpenAIApi(configuration);
};

export const getChatGPTReply = async (
  bobbles: IBobble[],
  onStream: (text: string) => void,
  apiKey: string
) => {
  if (openai === undefined) {
    await initOpenAI(apiKey);
  }

  const response = await openai!.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an Assistant.",
      },
      ...bobbles,
    ],
  });

  const text = response.data.choices[0].message?.content;

  text?.replace(/\\n/g, "\n");

  if (!text) return;

  for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
      onStream(text.slice(0, i));
    }, 48 * i);
  }
};

export const checkOpenAIAuth = async (apiKey: string) => {
  await initOpenAI(apiKey);

  try {
    await openai!.listModels();
    return true;
  } catch (err) {
    return false;
  }
};
