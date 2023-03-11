import { Route, Routes, useNavigate } from "@solidjs/router";
import ShortcutRoute from "./routes/shortcut";
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
    <div ref={containerRef} class="container bg-background rounded-xl">
      <Routes>
        <Route path="/" component={ShortcutRoute} />
        <Route path="/openai" component={OpenAIEnvRoute} />
      </Routes>
    </div>
  );
}

export default App;
