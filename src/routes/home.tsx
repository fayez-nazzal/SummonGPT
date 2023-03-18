import { useNavigate } from "@solidjs/router";
import scn from "scn";
import { createSignal, lazy } from "solid-js";
import Bobble from "../components/Bobble";
import { getChatGPTReply, onStreamEvent } from "../openai";
import {
  EStorageKey,
  getHistoryItems,
  getStoredValue,
  saveHistoryItem,
} from "../storage";
import {
  hideWindow,
  onSetupShortcut,
  onWindowBlur,
  onWindowHide,
  exportChat,
  registerShortcut,
} from "../tauri";
import { EBobbleType, ESpells, IBobble, IHistoryItem } from "../types";
import {
  appendToArr,
  changeAtIndex,
  getSpellType,
  isSpell,
  newAssistantBobble,
  removeSpellBobbles,
} from "../utils";
import History from "../components/History";

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
  let chatId = `${Date.now()}`;

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

  const onHistoryItemSelect = (item: IHistoryItem) => {
    chatId = `${item.id}`;
    setBobbles(() => item.bobbles);
  };

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

    if (isSpell(value)) {
      const { spell, payload } = getSpellType(value);

      switch (spell) {
        case ESpells.History:
          const historyItems = await getHistoryItems();

          if (historyItems)
            setBobbles((bobbles) =>
              appendToArr(bobbles, {
                role: EBobbleType.Spell,
                content: (
                  <History
                    items={historyItems}
                    onItemSelect={onHistoryItemSelect}
                  />
                ),
              })
            );
        case ESpells.Export:
          await onSave();
          break;
      }

      return;
    }

    await getChatGPTReply(bobbles(), getStoredValue(EStorageKey.OpenAIKey));
  };

  onStreamEvent(({ payload }) => {
    const { bobble_index, content } = payload;

    setBobbles((bobbles) =>
      changeAtIndex(bobbles, bobble_index, (bobble) => ({
        ...bobble,
        content: bobble.content + content,
      }))
    );

    saveHistoryItem(bobbles(), `${chatId}`);
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
      </div>
      <UserInput onSubmit={onUserInputSubmit} onDismiss={hideWindow} />
    </div>
  );
};

export default HomeRoute;
