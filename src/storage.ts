export enum EStorageKey {
  IsShortcutTested = "shortcut-tested",
  Shortcut = "shortcut",
  OpenAIKey = "OPENAI_API_KEY",
}

export const getStoredValue = <T>(key: EStorageKey, defaultValue?: T) => {
  return (localStorage.getItem(key) || defaultValue) as T;
};

export const setStoredValue = (key: EStorageKey, value: string) => {
  localStorage.setItem(key, value);
};

export const removeStoredValue = (key: EStorageKey) => {
  localStorage.removeItem(key);
};
