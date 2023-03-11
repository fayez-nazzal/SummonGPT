import { useNavigate } from "@solidjs/router";
import scn from "scn";
import { createSignal, lazy } from "solid-js";
import { hideWindow, onSetupShortcut } from "../tauri";
const UserInput = lazy(() => import("../components/UserInput"));

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
      setTimeout(() => hideWindow);
    }
  });

  onSetupShortcut(() => {
    localStorage.removeItem("shortcut");
    navigate("/shortcut");
  });

  return (
    <div class={scn("flex flex-col-reverse flex gap-4")}>
      <UserInput />
    </div>
  );
};

export default HomeRoute;
