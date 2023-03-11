import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";

export const hideWindow = async () => {
  await invoke("hide_window");
};

export const hideWindowOnBlur = async () => {
  appWindow.listen("tauri://blur", hideWindow);
};

// Passes the shortcut to the rust backend, the rust backed will remove previous shortcuts and register the new one
export const conjureShortcut = async (shortcut: string) => {
  shortcut = shortcut.toUpperCase();

  return await invoke("register_shortcut", { shortcut });
};

export const onWindowShow = async (callback: () => void) => {
  appWindow.onFocusChanged((focused) => {
    if (focused) {
      callback();
    }
  });
};

export const onShortcut = async (callback: () => void) => {
  listen("shortcut", callback);
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

export const checkForAPIKey = async () => {
  const hasAPIKey = !!(await invoke("get_environment_variable", {
    name: "OPENAI_API_KEY",
  }));

  return hasAPIKey;
};