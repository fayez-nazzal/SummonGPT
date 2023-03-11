import scn from "scn";
import { createSignal, JSX } from "solid-js";
import { onWindowShow } from "../tauri";
import { TextInput } from "./UserInput";

export interface IShortcutInputProp {
  shortcut: string;
  setShortcut: (value: string) => void;
  isError: boolean;
  class?: string;
}

const ShortcutSetter = (props: IShortcutInputProp) => {
  const [pressedKeys, setPressedKeys] = createSignal<Set<string>>(new Set());
  const [unsavedShortcut, setUnsavedShortcut] = createSignal(props.shortcut);
  let inputRef: HTMLInputElement | undefined;

  onWindowShow(() => {
    inputRef?.focus();
  });

  const onWrapperClick = () => {
    inputRef?.focus();
  };

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
    <div
      onclick={onWrapperClick}
      class="p-4 text-center select-none cursor-default"
    >
      <div class="text-textPrimary font-medium text-lg leading-8">
        Set a keyboard shortcut to quickly summon the chat.
      </div>
      <div class="text-textPrimary text-sm leading-6">
        Gently press your desired shortcut keys together, lovely!
      </div>
      <div
        class={scn(
          "text-md font-medium text-error",
          ["invisible opacity-0", !props.isError],
          "leading-[2rem]"
        )}
      >
        Invalid shortcut! Please try again.
      </div>
      <input
        onKeyDown={onKeydown}
        onKeyUp={onKeyup}
        onBlur={onInputBlur}
        ref={inputRef}
        value={unsavedShortcut()}
        placeholder="..."
        class={scn(
          "bg-transparent",
          "w-full text-center",
          "focus:text-primary font-bold !text-2xl"
        )}
        autofocus
        readOnly
      />
      <br />
      <br />
      <button
        class={scn(
          "bg-primary rounded-lg",
          "disabled:grayscale enabled:hover:brightness-110",
          "px-3 py-2",
          "font-medium text-lg text-textPrimary-dark"
        )}
        disabled={!unsavedShortcut()}
        onclick={onApply}
      >
        Set Shortcut
      </button>
    </div>
  );
};

export default ShortcutSetter;
