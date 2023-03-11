import { Link } from "@solidjs/router";
import scn from "scn";
import { TextInput } from "../components/UserInput";
import { hideWindow } from "../tauri";

interface IHomeRouteProps {
  containerRef: HTMLDivElement | undefined;
}

const HomeRoute = (props: IHomeRouteProps) => {
  window.addEventListener("click", (ev) => {
    if (props.containerRef && !props.containerRef.contains(ev.target as Node)) {
      //setTimeout(() => hideWindow);
    }
  });

  const onSetShortcutClick = () => {
    localStorage.removeItem("shortcut");
  };

  return (
    <div class={scn("flex flex-col-reverse flex gap-4")}>
      <TextInput />
      <Link class="hidden" onclick={onSetShortcutClick} href="/shortcut">
        Setup Shortcut
      </Link>
    </div>
  );
};

export default HomeRoute;
