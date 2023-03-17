import { clipboard, invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { save } from "@tauri-apps/api/dialog";
import { writeTextFile } from "@tauri-apps/api/fs";
import { IBobble } from "./types";

export const hideWindow = async () => {
  await invoke("hide_window");
};

export const onWindowBlur = async (callback: () => void) => {
  appWindow.listen("tauri://blur", callback);
};

// Passes the shortcut to the rust backend, the rust backed will remove previous shortcuts and register the new one
export const registerShortcut = async (shortcut: string) => {
  shortcut = shortcut.toUpperCase();

  return await invoke("register_shortcut", { shortcut });
};

export const onWindowShow = async (callback: () => void) => {
  appWindow.onFocusChanged((focused) => {
    if (focused) {
      setTimeout(() => {
        callback();
      });
    }
  });
};

export const onWindowHide = async (callback: () => void) => {
  listen("window_hide", callback);
};

export const onShortcut = async (callback: () => void) => {
  setTimeout(() => {
    listen("shortcut", callback);
  });
};

export const onSetupShortcut = async (callback: () => void) => {
  listen("setup_shortcut", callback);
};

export const invokeShortcut = async () => {
  await invoke("invoke_shortcut");
};

enum EAppTheme {
  Light = "light",
  Dark = "dark",
}

export const setAppTheme = () => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  } else {
    document.body.classList.add("light");
    document.body.classList.remove("dark");
  }
};

export const println = (message: string) => {
  invoke("println", { message });
};

export const exportChat = async (bobbles: IBobble[]) => {
  const filePath = await save({
    title: "Export chat",
    filters: [
      {
        name: "chat",
        extensions: ["json"],
      },
    ],
  });

  filePath && (await writeTextFile(filePath, JSON.stringify(bobbles)));
};

export const copyToClipboard = async (text: string) => {
  await clipboard.writeText(text);
};
