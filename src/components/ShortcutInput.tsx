import scn from "scn";
import { createSignal, JSX } from "solid-js";
import { TextInput } from "./TextInput";

export interface IShortcutInputProp {
  isConfirmed: boolean;
  setIsConfirmed: (value: boolean) => void;
  shortcut: string;
  setShortcut: (value: string) => void;
  isError: boolean;
  class?: string;
}

export const ShortcutInput = (props: IShortcutInputProp) => {
  const [pressedKeys, setPressedKeys] = createSignal<Set<string>>(new Set());
  const [unsavedShortcut, setUnsavedShortcut] = createSignal(props.shortcut);
  const [focused, setFocused] = createSignal<boolean>(false);
  let inputRef: HTMLInputElement | undefined;

  const getKey = (key: string) => {
    return key === " "
      ? "SPACE"
      : key.match(/META/i)
      ? "SUPER"
      : key.toUpperCase();
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

  const onInputFocus = () => {
    setFocused(true);
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
        Gently press your desired shortcut keys together, and one after the
        other, lovely!
      </div>
      <br />
      <TextInput
        onKeyDown={onKeydown}
        onKeyUp={onKeyup}
        value={unsavedShortcut()}
        class={scn(
          "w-full text-center",
          "focus:text-primary font-bold text-lg"
        )}
        autoFocus
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        ref={inputRef}
        readOnly
      />
      <br />
      <br />
      <button
        class={scn(
          "bg-primary rounded-lg",
          "hover:brightness-110",
          "px-2 py-1.5",
          "font-medium text-textPrimary-dark"
        )}
        disabled={!unsavedShortcut}
        onclick={onApply}
      >
        I've set my talisman
      </button>
    </div>
  );
};
