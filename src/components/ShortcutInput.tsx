import scn from "scn";
import { createSignal, JSX } from "solid-js";
import { onWindowShow } from "../tauri";
import { TextInput } from "./TextInput";

export interface IShortcutInputProp {
  isConfirmed: boolean;
  setIsConfirmed: (value: boolean) => void;
  shortcut: string;
  setShortcut: (value: string) => void;
  isError: boolean;
  class?: string;
}

const ShortcutInput = (props: IShortcutInputProp) => {
  const [pressedKeys, setPressedKeys] = createSignal<Set<string>>(new Set());
  const [unsavedShortcut, setUnsavedShortcut] = createSignal(props.shortcut);
  let inputRef: HTMLInputElement | undefined;

  onWindowShow(() => {
    inputRef?.focus();
  });

  const getKey = (key: string) => {
    return key === " " ? "SPACE" : key.match(/META/i) ? "SUPER" : key;
  };

  const onKeydown = (e: any) => {
    const { key } = e;

    if (key === "Escape") {
      setPressedKeys(new Set<string>());
      props.setShortcut("");
      return;
    }

    const newPressedKeys = new Set(pressedKeys());
    newPressedKeys.add(getKey(key));
    setPressedKeys(newPressedKeys);
    setUnsavedShortcut(Array.from(pressedKeys()).join("+"));
    props.setIsConfirmed(newPressedKeys.size > 1);
    e.preventDefault();
  };

  const onKeyup = (e: any) => {
    setPressedKeys(new Set<string>());
    e.preventDefault();
  };

  const onInputBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    inputRef?.focus();
    e.preventDefault();
  };

  const onApply = () => {
    props.setShortcut(unsavedShortcut());
  };

  return (
    <div class="p-4 text-center select-none cursor-default">
      <div class="text-textPrimary font-medium text-lg leading-8">
        Set a keyboard shortcut to quickly summon the chat.
      </div>
      <div class="text-textPrimary text-sm leading-6">
        Gently press your desired shortcut keys together, lovely!
      </div>
      <br />
      <TextInput
        onKeyDown={onKeydown}
        onKeyUp={onKeyup}
        onBlur={onInputBlur}
        ref={inputRef}
        value={unsavedShortcut()}
        class={scn(
          "w-full text-center",
          "focus:text-primary font-bold !text-2xl"
        )}
        autoFocus
        readOnly
      />
      <br />
      <br />
      <button
        class={scn(
          "bg-primary rounded-lg",
          "hover:brightness-110",
          "px-3 py-2",
          "font-medium text-lg text-textPrimary-dark"
        )}
        disabled={!unsavedShortcut}
        onclick={onApply}
      >
        Set Shortcut
      </button>
    </div>
  );
};

export default ShortcutInput;
