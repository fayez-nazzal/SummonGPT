import {
  BaseDirectory,
  createDir,
  readDir,
  writeTextFile,
  readTextFile,
  exists,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { IBobble } from "./types";

export enum EStorageKey {
  IsShortcutTested = "shortcut-tested",
  Shortcut = "shortcut",
  OpenAIKey = "OPENAI_API_KEY",
}

export const HISTORY_DIR = "history";

export const getStoredValue = <T>(key: EStorageKey, defaultValue?: T) => {
  return (localStorage.getItem(key) || defaultValue) as T;
};

export const setStoredValue = (key: EStorageKey, value: string) => {
  localStorage.setItem(key, value);
};

export const removeStoredValue = (key: EStorageKey) => {
  localStorage.removeItem(key);
};

export const createHistoryDirectory = async () => {
  try {
    await createDir(HISTORY_DIR, {
      dir: BaseDirectory.AppData,
      recursive: true,
    });
  } catch (e) {
    console.error(e);
  }
};

export const getHistoryDirectory = async () => {
  try {
    const files = await readDir(HISTORY_DIR, {
      dir: BaseDirectory.AppData,
    });

    return files;
  } catch (e) {
    console.error(e);
  }
};

export const getHistoryItems = async () => {
  try {
    const files = await getHistoryDirectory();
    const historyItems = files
      ?.filter((file) => file.name?.endsWith(".json"))
      .map(async (file) => {
        const json = await readTextFile(`history/${file.name}`, {
          dir: BaseDirectory.AppData,
        });

        return {
          id: file.name?.replace(".json", ""),
          bobbles: JSON.parse(json).bobbles,
        };
      });

    return historyItems;
  } catch (e) {
    console.error(e);
  }
};

export const saveHistoryItem = async (bobbles: IBobble[], id: string) => {
  try {
    const historyItem = {
      bobbles,
    };

    await writeTextFile(`history/${id}.json`, JSON.stringify(historyItem), {
      dir: BaseDirectory.AppData,
    });
  } catch (e) {
    console.error(e);
  }
};
