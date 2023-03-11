/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import "./et-book.css";
import App from "./App";
import { Router } from "@solidjs/router";
import { setAppTheme } from "./tauri";

setAppTheme();

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
