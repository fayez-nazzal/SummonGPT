import scn from "scn";
import { getFileSrc } from "../tauri";
import { EBobbleType } from "../types";
import { getIconForBobbleType } from "../utils";

export interface IAvatarProps {
  role: EBobbleType;
  customImage?: string;
}

export const Avatar = (props: IAvatarProps) => {
  let Icon = getIconForBobbleType(props.role);

  if (props.customImage !== undefined) {
    Icon = () => (
      <img
        src={getFileSrc(props.customImage as string)}
        class="w-full h-full"
      />
    );
  }

  return (
    <div
      class={scn(
        "flex justify-center items-center rounded-lg w-8 h-8 overflow-hidden text-textPrimary-dark dark:text-textPrimary-light",
        ["bg-textPrimary", props.role === EBobbleType.User],
        ["hidden", props.role === EBobbleType.Spell],
        "mt-0.5"
      )}
    >
      <Icon />
    </div>
  );
};
