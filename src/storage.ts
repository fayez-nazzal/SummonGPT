import {
  BaseDirectory,
  createDir,
  readDir,
  writeTextFile,
  readTextFile,
  removeFile,
} from "@tauri-apps/api/fs";
import { IBobble, IHistoryItem } from "./types";

export enum EStorageKey {
  IsShortcutTested = "shortcut-tested",
  Shortcut = "shortcut",
  OpenAIKey = "OPENAI_API_KEY",
  AvatarPath = "avatar-path",
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
    let files = await getHistoryDirectory();
    files = files?.filter((file) => file.name?.endsWith(".json"));

    const historyItems: IHistoryItem[] = [];

    if (!files) return historyItems;

    for (const file of files) {
      const name = file.name?.replace(".json", "") as string;
      const content = (await readTextFile(`history/${name}.json`, {
        dir: BaseDirectory.AppData,
      })) as string;

      historyItems.push({
        id: name,
        bobbles: JSON.parse(content).bobbles as IBobble[],
      });
    }

    return historyItems;
  } catch (e) {
    console.error(e);
  }
};

export const clearHistory = async () => {
  try {
    const files = await getHistoryDirectory();

    if (!files) return;

    for (const file of files) {
      await removeFile(`history/${file.name as string}`, {
        dir: BaseDirectory.AppData,
      });
    }

    return;
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
