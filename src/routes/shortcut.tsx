import { createEffect, createSignal, lazy } from "solid-js";
const ShortcutInput = lazy(() => import("../components/ShortcutInput"));
import { conjureShortcut, hideWindow } from "../tauri";

function ShortcutRoute() {
  const [shortcut, setShortcut] = createSignal("Control+Shift+I");
  const [isConfirmed, setIsConfirmed] = createSignal(false);
  const [isError, setIsError] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  window.addEventListener("click", (ev) => {
    if (containerRef && !containerRef.contains(ev.target as Node)) {
      hideWindow();
    }
  });

  createEffect(async () => {
    if (!isConfirmed()) setIsError(true);
    if (shortcut()) {
      try {
        await conjureShortcut(shortcut());
      } catch {
        console.log("Error");
        setIsError(true);
      }
    }
  });

  return (
    <div ref={containerRef} class="container rounded-xl">
      <ShortcutInput
        setShortcut={setShortcut}
        isConfirmed={isConfirmed()}
        setIsConfirmed={setIsConfirmed}
        shortcut={shortcut()}
        isError={isError()}
      />
    </div>
  );
}

export default ShortcutRoute;
