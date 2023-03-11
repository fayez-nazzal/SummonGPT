import scn from "scn";
import { createEffect, JSX } from "solid-js";
import TextareaAutosize from "solid-textarea-autosize";
import { onShortcut, onWindowShow } from "../tauri";

export interface ITextInputProps {
  onSubmit: (value: string) => void;
  onDismiss: () => void;
}

const UserInput = (props: ITextInputProps) => {
  let inputRef: HTMLTextAreaElement | undefined = undefined;

  createEffect(() => {
    inputRef?.focus();
  });

  onWindowShow(() => {
    inputRef?.focus();
  });

  onShortcut(() => {
    inputRef?.focus();
  });

  const onblur: JSX.EventHandler<HTMLTextAreaElement, FocusEvent> = (e) => {
    e.preventDefault();
    inputRef?.focus();
  };

  const onkeydown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (
    e
  ) => {
    // if shift is pressed, do not submit
    if (e.shiftKey) return;

    if (e.key === "Enter" && e.currentTarget.value) {
      e.preventDefault();
      props.onSubmit?.(e.currentTarget.value);
      e.currentTarget.value = "";
    }

    if (e.key === "Escape") {
      e.preventDefault();
      props.onDismiss?.();
    }
  };

  return (
    <TextareaAutosize
      ref={inputRef}
      placeholder="Write your message here, press Enter to send."
      class={scn(
        "bg-plane text-textPrimary placeholder:textPrimary/80",
        "text-md",
        "resize-none",
        "border border-melt/20",
        "rounded-lg cursor-text p-4 focus:outline-none "
      )}
      autofocus
      onblur={onblur}
      onkeydown={onkeydown}
      minRows={1}
      maxRows={5}
    />
  );
};

 export default UserInput;
