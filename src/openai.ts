import { IBobble } from "./types";

// taken from @lennartle, https://github.com/openai/openai-node/issues/18
export const openAiCompletion = async (
  messages: IBobble[],
  onText: (text: string) => void,
  token: string
) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model: "gpt-3.5-turbo",
        max_tokens: 2048,
        stream: true,
      }),
    });

    const decoder = new TextDecoder("utf8");
    const reader = response.body?.getReader();

    let fullText = "";
    let lastTimeout: NodeJS.Timeout | undefined = undefined;
    let lastIndex = 0;

    async function read() {
      if (!reader) return;

      const { value, done } = await reader!.read();

      if (done) return onText(fullText);

      const delta = decoder
        .decode(value)
        .match(/"delta":\s*({.*?"content":\s*".*?"})/)?.[1];

      if (delta) {
        const content = JSON.parse(delta).content;

        fullText += content;

        const getText = () => fullText;

        clearTimeout(lastTimeout);
        for (let i = lastIndex; i < messages.length; i++) {
          lastTimeout = setTimeout(() => {
            onText(getText());
          }, i * 8);
        }
      }

      await read();
    }

    await read();

    return fullText;
  } catch (error) {
    return error;
  }
};
