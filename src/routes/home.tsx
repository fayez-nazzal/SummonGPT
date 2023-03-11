import { useNavigate } from "@solidjs/router";
import scn from "scn";
import { createSignal, lazy } from "solid-js";
import Bobble from "../components/Bobble";
import { openAiCompletion } from "../openai";
import {
  hideWindowOnBlur,
  hideWindow,
  onSetupShortcut,
  println,
  getOpenAIAPIKey,
} from "../tauri";
import { EBobbleType, IBobble } from "../types";
const UserInput = lazy(() => import("../components/UserInput"));

interface IHomeRouteProps {
  containerRef: HTMLDivElement | undefined;
}

const HomeRoute = (props: IHomeRouteProps) => {
  const navigate = useNavigate();
  const [shortcut] = createSignal(localStorage.getItem("shortcut") || "");
  const [bobbles, setBobbles] = createSignal<IBobble[]>([]);

  if (!shortcut()) {
    navigate("/shortcut");
  }

  window.addEventListener("click", (ev) => {
    if (props.containerRef && !props.containerRef.contains(ev.target as Node)) {
      hideWindow();
    }
  });

  hideWindowOnBlur();

  onSetupShortcut(() => {
    localStorage.removeItem("shortcut");
    navigate("/shortcut");
  });

  const onUserInputSubmit = async (value: string) => {
    setBobbles((bobbles) => [
      ...bobbles,
      {
        role: EBobbleType.User,
        content: value,
      },
    ]);

    let bobblesWithAssistant: IBobble[] | undefined = undefined;

    await openAiCompletion(
      bobbles(),
      (text) => {
        const newBobble: IBobble = {
          role: EBobbleType.Assistant,
          content: text,
        };

        if (!bobblesWithAssistant) {
          bobblesWithAssistant = [...bobbles(), newBobble];
        } else {
          bobblesWithAssistant[bobblesWithAssistant.length - 1] = {
            ...newBobble,
          };
        }

        setBobbles(() => [...bobblesWithAssistant!]);
      },
      await getOpenAIAPIKey()
    );
  };

  return (
    <div class={scn("flex flex-col", ["pt-3 gap-3", bobbles().length])}>
      <div
        class={scn(
          ["p-3", bobbles().length],
          "flex flex-col max-h-[500px] gap-3 overflow-auto"
        )}
      >
        {bobbles().map((bobble) => (
          <Bobble bobble={bobble} />
        ))}
      </div>
      <UserInput onSubmit={onUserInputSubmit} />
    </div>
  );
};

export default HomeRoute;
