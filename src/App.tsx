import { Route, Routes } from "@solidjs/router";
import ShortcutRoute from "./routes/shortcut";

function App() {
  return (
    <Routes>
      <Route path="/" component={ShortcutRoute} />
    </Routes>
  );
}

export default App;
