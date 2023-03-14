import { useNavigate } from "@solidjs/router";
import scn from "scn";
import { createSignal, lazy } from "solid-js";
import Bobble from "../components/Bobble";
import { getChatGPTReply } from "../openai";
import { EStorageKey, getStoredValue } from "../storage";
import {
  hideWindow,
  onSetupShortcut,
  onWindowBlur,
  onWindowHide,
  println,
  exportChat,
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
  let [isExporting, setIsExporting] = createSignal(false);

  window.addEventListener("click", (ev) => {
    if (
      !isExporting() &&
      !["TEXTAREA", "INPUT", "BUTTON"].includes(
        (ev.target as HTMLElement)?.nodeName
      ) &&
      props.containerRef &&
      !props.containerRef.contains(ev.target as Node)
    ) {
      hideWindow();
    }
  });

  onWindowBlur(() => {
    if (!isExporting()) hideWindow();
  });

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

  const onSave = async () => {
    setIsExporting(true);
    await exportChat(bobbles());
    setIsExporting(false);
  };

  return (
    <div class={scn("relative flex flex-col")}>
      <div
        class={scn(
          ["p-3", bobbles().length],
          "flex flex-col max-h-[500px] gap-5 overflow-auto"
        )}
      >
        {bobbles().map((bobble) => (
          <Bobble bobble={bobble} />
        ))}
        <button
          onClick={onSave}
          class={scn(
            ["hidden", !bobbles().length],
            "absolute top-1 left-1",
            "p-1 rounded-lg",
            "text-primary text-xs font-medium hover:bg-melt"
          )}
        >
          Export Chat
        </button>
      </div>
      <UserInput onSubmit={onUserInputSubmit} onDismiss={hideWindow} />
    </div>
  );
};

export default HomeRoute;
