import { createEffect, createSignal, lazy } from "solid-js";
const ShortcutInput = lazy(() => import("../components/ShortcutInput"));
import { conjureShortcut } from "../tauri";

function ShortcutRoute() {
  const [shortcut, setShortcut] = createSignal(
    localStorage.getItem("shortcut") || ""
  );
  const [isError, setIsError] = createSignal(false);

  createEffect(async () => {
    let shortcutValue = shortcut();

    if (
      shortcutValue &&
      ["control", "super", "shift", "alt"].includes(
        shortcutValue.toLowerCase().split("+")[0]
      )
    ) {
      let result = await conjureShortcut(shortcut());
      setIsError(!result);
      result && localStorage.setItem("shortcut", shortcutValue);
    } else if (shortcutValue) {
      setIsError(true);
    }
  });

  return (
    <ShortcutInput
      setShortcut={setShortcut}
      shortcut={shortcut()}
      isError={isError()}
    />
  );
}

export default ShortcutRoute;
