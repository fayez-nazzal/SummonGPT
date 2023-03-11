import scn from "scn";
import { createEffect, JSX } from "solid-js";
import TextareaAutosize from "solid-textarea-autosize";

export interface ITextInputProps {
  class?: string;
  onSubmit?: (value: string) => void;
}

const UserInput = (props: ITextInputProps) => {
  let inputRef: HTMLTextAreaElement | undefined = undefined;

  createEffect(() => {
    inputRef?.focus();
  });

  const onblur: JSX.EventHandler<HTMLTextAreaElement, FocusEvent> = (e) => {
    e.preventDefault();
    inputRef?.focus();
  };

  const onkeydown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (
    e
  ) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      e.preventDefault();
      props.onSubmit?.(e.currentTarget.value);
      e.currentTarget.value = "";
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
        "rounded-lg cursor-text p-4 focus:outline-none ",
        props.class
      )}
      autofocus
      onblur={onblur}
      minRows={1}
      maxRows={10}
    />
  );
};

 export default UserInput;
