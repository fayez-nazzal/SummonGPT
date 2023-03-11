import { createEffect, createSignal, lazy } from "solid-js";
const ShortcutInput = lazy(() => import("../components/ShortcutInput"));
import { conjureShortcut, hideWindow } from "../tauri";

function ShortcutRoute() {
  const [shortcut, setShortcut] = createSignal("Control+Shift+I");
  const [isConfirmed, setIsConfirmed] = createSignal(false);
  const [isError, setIsError] = createSignal(false);

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
    <ShortcutInput
      setShortcut={setShortcut}
      isConfirmed={isConfirmed()}
      setIsConfirmed={setIsConfirmed}
      shortcut={shortcut()}
      isError={isError()}
    />
  );
}

export default ShortcutRoute;
