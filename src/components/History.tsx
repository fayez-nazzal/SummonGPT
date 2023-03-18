import scn from "scn";
import { IHistoryItem } from "../types";

export interface IHistoryProps {
  items: IHistoryItem[];
  onItemSelect: (item: IHistoryItem) => void;
}

const History = (props: IHistoryProps) => {
  return (
    <div class="">
      {props.items.map((item) => {
        const content = item.bobbles[0].content;

        return (
          <button class={scn("flex items-center w-full p-2")}>
            <span>{item.id}</span>
            <span>{content}</span>
          </button>
        );
      })}
    </div>
  );
};

export default History;
