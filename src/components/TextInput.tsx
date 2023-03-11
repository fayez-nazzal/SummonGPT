import scn from "scn";

export interface ITextInputProps {
  class?: string;
  [key: string]: any;
}

export const TextInput = (props: ITextInputProps) => {
  return (
    <input
      type="text"
      {...props}
      class={scn(
        "bg-transparent",
        "text-sm",
        "rounded-lg py-1 px-1.5 focus:outline-none ",
        props.class
      )}
    />
  );
};
