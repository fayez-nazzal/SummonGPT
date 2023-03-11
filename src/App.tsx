import { Route, Routes, useNavigate } from "@solidjs/router";
import ShortcutRoute from "./routes/shortcut";
import TestShortcutRoute from "./routes/test-shortcut";
import OpenAIEnvRoute from "./routes/openai";
import { checkForAPIKey, hideWindow } from "./tauri";

function App() {
  let containerRef: HTMLDivElement | undefined;
  const navigate = useNavigate();

  checkForAPIKey().then((hasAPIKey) => {
    if (!hasAPIKey) {
      navigate("/openai");
    }
  });

  window.addEventListener("click", (ev) => {
    if (containerRef && !containerRef.contains(ev.target as Node)) {
      hideWindow();
    }
  });

  return (
    <div class="p-2 h-max">
      <div ref={containerRef} class="container shadow bg-background rounded-xl">
        <Routes>
          <Route path="/" component={ShortcutRoute} />
          <Route path="/openai" component={OpenAIEnvRoute} />
          <Route path="/test-shortcut" component={TestShortcutRoute} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
