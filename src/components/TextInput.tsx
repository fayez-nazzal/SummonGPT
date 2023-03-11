import scn from "scn";
import { JSX } from "solid-js";
import TextareaAutosize from "solid-textarea-autosize";

export interface ITextInputProps {
  class?: string;
  [key: string]: any;
}

export const TextInput = (props: ITextInputProps) => {
  let inputRef: HTMLTextAreaElement | undefined = undefined;

  const onblur: JSX.EventHandler<HTMLTextAreaElement, FocusEvent> = (e) => {
    e.preventDefault();

    inputRef?.focus();
  };

  return (
    <TextareaAutosize
      ref={inputRef}
      {...props}
      placeholder="Write your message here, press enter to send."
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
