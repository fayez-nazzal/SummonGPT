import { useNavigate } from "@solidjs/router";
import scn from "scn";
import { createSignal, lazy } from "solid-js";
import Bobble from "../components/Bobble";
import { getChatGPTReply } from "../openai";
import { EStorageKey, getStoredValue } from "../storage";
import {
  hideWindowOnBlur,
  hideWindow,
  onSetupShortcut,
  onWindowHide,
  println,
} from "../tauri";
import { EBobbleType, IBobble } from "../types";
const UserInput = lazy(() => import("../components/UserInput"));

interface IHomeRouteProps {
  containerRef: HTMLDivElement | undefined;
}

const HomeRoute = (props: IHomeRouteProps) => {
  const navigate = useNavigate();
  const [shortcut] = createSignal(getStoredValue(EStorageKey.Shortcut, ""));
  const [bobbles, setBobbles] = createSignal<IBobble[]>([]);

  if (!shortcut()) {
    navigate("/shortcut");
  }

  window.addEventListener("click", (ev) => {
    if (
      (ev.target as HTMLElement)?.nodeName === "DIV" &&
      props.containerRef &&
      !props.containerRef.contains(ev.target as Node)
    ) {
      hideWindow();
    }
  });

  hideWindowOnBlur();

  onWindowHide(() => {
    setBobbles(() => []);
  });

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

    await getChatGPTReply(
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
      getStoredValue(EStorageKey.OpenAIKey)
    );
  };

  return (
    <div class={scn("flex flex-col", ["pt-3 gap-3", bobbles().length])}>
      <div
        class={scn(
          ["p-3", bobbles().length],
          "flex flex-col max-h-[500px] gap-5 overflow-auto"
        )}
      >
        {bobbles().map((bobble) => (
          <Bobble bobble={bobble} />
        ))}
      </div>
      <UserInput onSubmit={onUserInputSubmit} onDismiss={hideWindow} />
    </div>
  );
};

export default HomeRoute;
