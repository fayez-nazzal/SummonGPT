import { EBobbleType, IBobble } from "../types";
import scn from "scn";
import { createEffect } from "solid-js";
import { getIconForBobbleType } from "../utils";

interface IBobbleProps {
  bobble: IBobble;
}

const Bobble = (props: IBobbleProps) => {
  let wrapperRef: HTMLDivElement | undefined = undefined;

  createEffect(() => {
    if (wrapperRef) {
      wrapperRef.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  });

  const Icon = getIconForBobbleType(props.bobble.role);

  return (
    <div
      ref={wrapperRef}
      class={scn("flex gap-2", [
        "flex-row-reverse",
        props.bobble.role === EBobbleType.Assistant,
      ])}
    >
      <div
        class={scn(
          "max-w-[540px]",
          ["bg-primary mr-auto", props.bobble.role === EBobbleType.Assistant],
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
      <div
        class={scn(
          "flex justify-center items-center rounded-lg w-8 h-8 text-textPrimary-dark dark:text-textPrimary-light",
          ["bg-textPrimary", props.bobble.role === EBobbleType.User],
          "mt-0.5"
        )}
      >
        <Icon />
      </div>
    </div>
  );
};

export default Bobble;
