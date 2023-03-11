import scn from "scn";
import { createEffect, createSignal } from "solid-js";
import { TbCheck } from "solid-icons/tb";
import { onShortcut } from "../tauri";

function TestShortcutRoute() {
  const [isConfirmed, setIsConfirmed] = createSignal(false);
  const [shortcut, setShortcut] = createSignal(
    localStorage.getItem("shortcut") || ""
  );

  onShortcut(() => {
    setIsConfirmed(true);
  });

  createEffect(async () => {
    let shortcutValue = shortcut();
  });

  return (
    <div class="p-5 text-center h-64">
      <div class="text-textPrimary font-medium text-xl leading-8">
        Now let's test your shortcut!
      </div>
      <div class="text-textPrimary text-sm leading-6">
        Press the shortcut keys you set in the previous step.
      </div>
      <br />
      <div
        class={scn("text-primary text-lg leading-6", ["hidden", isConfirmed()])}
      >
        Listening to your keyboard...
      </div>
      <div
        class={scn(
          "w-max mx-auto flex flex-col items-center gap-2",
          ["hidden", !isConfirmed()],
          "bg-success/80 backdrop-blur text-textPrimary-dark dark:text-textPrimary-light rounded-lg p-2 text-lg leading-6",
          "rounded-full p-4"
        )}
      >
        <span class="bg-current rounded-full p-1">
          <TbCheck stroke-width={3} class="w-6 h-6 stroke-success" />
        </span>
        Good job! Your shortcut is working.
      </div>
    </div>
  );
}

export default TestShortcutRoute;
