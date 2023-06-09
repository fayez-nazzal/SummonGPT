import { EBobbleType, IBobble } from "../types";
import scn from "scn";
import { createEffect, createSignal } from "solid-js";
import { FaSolidCopy, FaSolidClipboardCheck } from "solid-icons/fa";
import { copyToClipboard } from "../tauri";
import { Avatar } from "./Avatar";

interface IBobbleProps {
  bobble: IBobble;
  customImage?: string;
}

const Bobble = (props: IBobbleProps) => {
  let wrapperRef: HTMLDivElement | undefined = undefined;
  let [isCopied, setIsCopied] = createSignal(false);
  createEffect(() => {
    if (wrapperRef) {
      wrapperRef.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  });

  const onCopy = () => {
    if (typeof props.bobble.content !== "string") return;

    setIsCopied(true);
    copyToClipboard(props.bobble.content);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  // copy on right click
  const onMouseDown = (e: MouseEvent) => {
    if (e.button === 2) {
      onCopy();
    }
  };

  return (
    <div
      ref={wrapperRef}
      class={scn(
        "flex gap-2",
        ["hidden", !props.bobble.content],
        ["flex-row-reverse", props.bobble.role === EBobbleType.Assistant]
      )}
      onMouseDown={onMouseDown}
      onDblClick={onCopy}
    >
      <button
        class={scn(
          "mr-auto ml-1",
          [
            "hidden",
            props.bobble.role !== EBobbleType.Assistant ||
              typeof props.bobble.content !== "string",
          ],
          ["text-melt hover:text-primary", !isCopied()],
          ["text-success", isCopied()]
        )}
        onClick={onCopy}
      >
        <FaSolidClipboardCheck
          class={scn("w-5 h-5", ["hidden", !isCopied()])}
        />
        <FaSolidCopy class={scn("w-5 h-5", ["hidden", isCopied()])} />
      </button>
      <div
        class={scn(
          "max-w-[540px]",
          ["bg-primary", props.bobble.role === EBobbleType.Assistant],
          [
            "bg-background-dark/20 dark:bg-background-light/20 ml-auto",
            props.bobble.role === EBobbleType.User,
          ],
          "rounded-lg py-2 px-3",
          "text-textPrimary font-normal txt-md",
          "whitespace-pre-line"
        )}
      >
        {props.bobble.content}
      </div>
      <Avatar customImage={props.customImage} role={props.bobble.role} />
    </div>
  );
};

export default Bobble;
