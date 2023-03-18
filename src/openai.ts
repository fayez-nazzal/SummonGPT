import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { IBobble } from "./types";
import { removeSpellBobbles } from "./utils";

export const getChatGPTReply = async (bobbles: IBobble[], apiKey: string) => {
  invoke("stream_chat", {
    bobbles: removeSpellBobbles(bobbles),
    bobbleIndex: bobbles.length - 1,
    apiKey: apiKey,
  });
};

export const onStreamEvent = async (callback: (payload: any) => void) => {
  setTimeout(() => {
    listen("stream", callback);
  });
};

export const checkOpenAIAuth = async (apiKey: string) => {
  const result = await invoke("check_openai_auth", { apiKey });

  return result;
};
