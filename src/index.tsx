/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import "./et-book.css";
import App from "./App";
import { hashIntegration, Router } from "@solidjs/router";
import { setAppTheme } from "./tauri";

setAppTheme();

document.addEventListener("contextmenu", (e) => e.preventDefault());

render(
  () => (
    <Router source={hashIntegration()}>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
