import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

export const hideWindow = async () => {
  await invoke("hide_window");
};

export const hideOnBlur = async () => {
  appWindow.listen("tauri://blur", hideWindow);
  appWindow.listen("tauri://focus", () => invoke("on_shortcut"));
  appWindow.listen("tauri://move", () => invoke("on_shortcut"));
  appWindow.listen("tauri://menu", () => invoke("on_shortcut"));
};

// Passes the shortcut to the rust backend, the rust backed will remove previous shortcuts and register the new one
export const conjureShortcut = async (shortcut: string) => {
  await invoke("register_shortcut", { shortcut });
};