import { createEffect, createSignal } from "solid-js";
import { ShortcutInput } from "./components/ShortcutInput";
import { conjureShortcut, hideOnBlur } from "./tauri";

function App() {
  const [shortcut, setShortcut] = createSignal("Control+Shift+I");
  const [isConfirmed, setIsConfirmed] = createSignal(false);
  const [isError, setIsError] = createSignal(false);

  hideOnBlur();

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
    <div class="container rounded-xl">
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

export default App;
