//import any general animations here
import { buttonAnimation } from "./button";
import { initNav } from "./nav";
import { StaggerText } from "./split";
import { animateGridLines } from "./gridLine";

export function initGenAnimations() {
  buttonAnimation();
  initNav();
  new StaggerText("data-a-split");
  animateGridLines();
}
