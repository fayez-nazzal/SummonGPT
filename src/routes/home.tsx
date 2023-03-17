import { useNavigate } from "@solidjs/router";
import scn from "scn";
import { createSignal, lazy } from "solid-js";
import Bobble from "../components/Bobble";
import { getChatGPTReply, onStreamEvent } from "../openai";
import { EStorageKey, getStoredValue } from "../storage";
import {
  hideWindow,
  onSetupShortcut,
  onWindowBlur,
  onWindowHide,
  exportChat,
  registerShortcut,
} from "../tauri";
import { EBobbleType, IBobble } from "../types";
import { appendToArr, changeAtIndex, newAssistantBobble } from "../utils";
const UserInput = lazy(() => import("../components/UserInput"));

interface IHomeRouteProps {
  containerRef: HTMLDivElement | undefined;
}

const HomeRoute = (props: IHomeRouteProps) => {
  const navigate = useNavigate();
  const [bobbles, setBobbles] = createSignal<IBobble[]>([]);
  let [isExporting, setIsExporting] = createSignal(false);
  const shortcutTested = getStoredValue(EStorageKey.IsShortcutTested);
  const apiKey = getStoredValue(EStorageKey.OpenAIKey);
  const [shortcut] = createSignal(getStoredValue(EStorageKey.Shortcut, ""));

  if (!apiKey) {
    navigate("/openai");
  } else if (!shortcutTested || !shortcut()) {
    navigate("/shortcut");
  } else {
    registerShortcut(shortcut());
  }

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
    setBobbles((bobbles) =>
      appendToArr(
        bobbles,
        {
          role: EBobbleType.User,
          content: value,
        },
        newAssistantBobble()
      )
    );

    await getChatGPTReply(bobbles(), getStoredValue(EStorageKey.OpenAIKey));
  };

  onStreamEvent(({ payload }) => {
    const { bobble_index, content } = payload;

    setBobbles(
      (bobbles) =>
        bobbles[bobble_index] &&
        changeAtIndex(bobbles, bobble_index, (bobble) => ({
          ...bobble,
          content: bobble.content + content,
        }))
    );
  });

  const onSave = async () => {
    setIsExporting(true);
    await exportChat(bobbles());
    setIsExporting(false);
  };

  return (
    <div class={scn("relative flex flex-col overflow-hidden")}>
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
