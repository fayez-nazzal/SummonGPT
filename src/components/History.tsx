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
        let content = "";

        for (const bobble of item.bobbles) {
          content += bobble.content + ";";

          if (content.length > 100) break;
        }

        return (
          <button
            class={scn(
              "flex w-full p-2 max-w-32 bg-melt hover:bg-secondary rounded-lg my-1"
            )}
            onClick={() => props.onItemSelect(item)}
          >
            <div class="text-left flex-1 truncate">{content}</div>
          </button>
        );
      })}
    </div>
  );
};

export default History;
