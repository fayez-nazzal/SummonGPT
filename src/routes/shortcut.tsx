import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal, lazy } from "solid-js";
import { EStorageKey, getStoredValue } from "../storage";
const ShortcutInput = lazy(() => import("../components/ShortcutSetter"));
import { registerShortcut } from "../tauri";

function ShortcutRoute() {
  const navigate = useNavigate();
  const [shortcut, setShortcut] = createSignal(
    getStoredValue(EStorageKey.Shortcut, "")
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
      let result = await registerShortcut(shortcut());
      setIsError(!result);
      result && localStorage.setItem("shortcut", shortcutValue);
      navigate("/test-shortcut");
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
