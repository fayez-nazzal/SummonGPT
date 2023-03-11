import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

export const hideWindow = async () => {
  await invoke("hide_window");
};

export const hideOnBlur = async () => {
  appWindow.listen("tauri://blur", hideWindow);
};
