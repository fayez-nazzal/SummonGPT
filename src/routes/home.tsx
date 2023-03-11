import { useNavigate } from "@solidjs/router";
import scn from "scn";
import { createSignal } from "solid-js";
import { TextInput } from "../components/UserInput";
import { onSetupShortcut } from "../tauri";

interface IHomeRouteProps {
  containerRef: HTMLDivElement | undefined;
}

const HomeRoute = (props: IHomeRouteProps) => {
  const navigate = useNavigate();
  const [shortcut] = createSignal(localStorage.getItem("shortcut") || "");

  if (!shortcut()) {
    navigate("/shortcut");
  }

  window.addEventListener("click", (ev) => {
    if (props.containerRef && !props.containerRef.contains(ev.target as Node)) {
      //setTimeout(() => hideWindow);
    }
  });

  onSetupShortcut(() => {
    localStorage.removeItem("shortcut");
    navigate("/shortcut");
  });

  return (
    <div class={scn("flex flex-col-reverse flex gap-4")}>
      <TextInput />
    </div>
  );
};

export default HomeRoute;
