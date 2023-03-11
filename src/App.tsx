import { Route, Routes, useNavigate } from "@solidjs/router";
import ShortcutRoute from "./routes/shortcut";
import TestShortcutRoute from "./routes/test-shortcut";
import OpenAIEnvRoute from "./routes/openai";
import { getOpenAIAPIKey, conjureShortcut, hideWindow } from "./tauri";
import HomeRoute from "./routes/home";
import { createSignal } from "solid-js";

function App() {
  let containerRef: HTMLDivElement | undefined;
  const navigate = useNavigate();
  const shortcutTested = localStorage.getItem("shortcut-tested");
  const [shortcut] = createSignal(localStorage.getItem("shortcut") || "");

  if (!shortcutTested || !shortcut()) {
    navigate("/shortcut");
  } else {
    conjureShortcut(shortcut());
  }

  getOpenAIAPIKey().then((hasAPIKey) => {
    if (!hasAPIKey) {
      navigate("/openai");
    }
  });

  return (
    <div class="p-2 h-max">
      <div ref={containerRef} class="container shadow bg-background rounded-xl">
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
