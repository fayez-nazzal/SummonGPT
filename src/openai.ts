import { Configuration, OpenAIApi } from "openai";
import { getOpenAIAPIKey } from "./tauri";
import { IBobble } from "./types";

let openai: OpenAIApi | undefined = undefined;

export const initOpenAI = async () => {
  const configuration = new Configuration({
    apiKey: await getOpenAIAPIKey(),
  });

  openai = new OpenAIApi(configuration);
};

export const getChatGPTReply = async (
  bobbles: IBobble[],
  onStream: (text: string) => void
) => {
  if (openai === undefined) {
    await initOpenAI();
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
