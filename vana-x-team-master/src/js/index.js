import "../styles/index.css";
import { initAll } from "./utils/initAll";

function init() {
  initAll();
}

function domReady(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

domReady(init);

export { init };
