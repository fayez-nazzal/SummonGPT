import { Route, Routes, useNavigate } from "@solidjs/router";
import ShortcutRoute from "./routes/shortcut";
import TestShortcutRoute from "./routes/test-shortcut";
import OpenAIEnvRoute from "./routes/openai";
import { registerShortcut, hideWindow } from "./tauri";
import HomeRoute from "./routes/home";
import { createSignal } from "solid-js";
import { EStorageKey, getStoredValue } from "./storage";

function App() {
  let containerRef: HTMLDivElement | undefined;
  const navigate = useNavigate();
  const shortcutTested = getStoredValue(EStorageKey.IsShortcutTested);
  const apiKey = getStoredValue(EStorageKey.OpenAIKey);
  const [shortcut] = createSignal(getStoredValue(EStorageKey.Shortcut, ""));

  if (!apiKey) {
    navigate("/openai");
  } else if (!shortcutTested || !shortcut()) {
    navigate("/shortcut");
  } else {
    registerShortcut(shortcut());
  }

  return (
    <div class="p-2 h-max">
      <div ref={containerRef} class="shadow bg-background rounded-xl">
        <Routes>
          <Route path="/shortcut" component={ShortcutRoute} />
          <Route path="/openai" component={OpenAIEnvRoute} />
          <Route path="/test-shortcut" component={TestShortcutRoute} />
          <Route
            path="/"
            component={(props) => (
              <HomeRoute {...props} containerRef={containerRef} />
            )}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
