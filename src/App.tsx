import { Route, Routes } from "@solidjs/router";
import ShortcutRoute from "./routes/shortcut";
import TestShortcutRoute from "./routes/test-shortcut";
import OpenAIEnvRoute from "./routes/openai";
import HomeRoute from "./routes/home";

function App() {
  let containerRef: HTMLDivElement | undefined;

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
