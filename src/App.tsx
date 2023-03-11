import { Route, Routes } from "@solidjs/router";
import ShortcutRoute from "./routes/shortcut";
import { hideWindow } from "./tauri";

function App() {
  let containerRef: HTMLDivElement | undefined;

  window.addEventListener("click", (ev) => {
    if (containerRef && !containerRef.contains(ev.target as Node)) {
      hideWindow();
    }
  });

  return (
    <div ref={containerRef} class="container bg-background rounded-xl">
      <Routes>
        <Route path="/" component={ShortcutRoute} />
      </Routes>
    </div>
  );
}

export default App;
