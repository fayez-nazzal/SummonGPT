import { EBobbleType, IBobble } from "../types";
import { FaSolidHatWizard } from "solid-icons/fa";
import scn from "scn";

interface IBobbleProps {
  bobble: IBobble;
}

const Bobble = (props: IBobbleProps) => {
  const Icon =
    props.bobble.role === EBobbleType.User
      ? FaSolidHatWizard
      : FaSolidHatWizard;

  return (
    <div class="flex gap-2 items-center">
      <div
        class={scn(
          "max-w-32",
          ["bg-primary", props.bobble.role === EBobbleType.Assistant],
          [
            "bg-background-dark/20 dark:bg-background-light/20 ml-auto",
            props.bobble.role === EBobbleType.User,
          ],
          "rounded-lg py-2 px-3",
          "text-textPrimary font-normal txt-md"
        )}
      >
        {props.bobble.content}
      </div>
      <div class="bg-[#af85ff] flex justify-center items-center rounded-lg w-8 h-8 text-textPrimary">
        <Icon />
      </div>
    </div>
  );
};

export default Bobble;
