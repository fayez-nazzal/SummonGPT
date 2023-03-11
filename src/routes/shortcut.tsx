import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal, lazy } from "solid-js";
const ShortcutInput = lazy(() => import("../components/ShortcutSetter"));
import { conjureShortcut } from "../tauri";

function ShortcutRoute() {
  const [shortcut, setShortcut] = createSignal(
    localStorage.getItem("shortcut") || ""
  );
  const [isError, setIsError] = createSignal(false);
  const navigate = useNavigate();

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
