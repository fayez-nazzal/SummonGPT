import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

export const hideWindow = async () => {
  await invoke("hide_window");
};

export const hideOnBlur = async () => {
  appWindow.listen("tauri://blur", hideWindow);
};

// Passes the shortcut to the rust backend, the rust backed will remove previous shortcuts and register the new one
export const conjureShortcut = async (shortcut: string) => {
  shortcut = shortcut.toUpperCase();
  await invoke("register_shortcut", { shortcut });
};

export const onWindowShow = async (callback: () => void) => {
  appWindow.onFocusChanged((focused) => {
    if (focused) {
      callback();
    }
  });
};

export const invokeShortcut = async () => {
  await invoke("invoke_shortcut");
};