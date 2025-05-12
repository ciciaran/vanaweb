import { stepFlow } from "./stepFlow";
import { swiperInit } from "./swiper";

export const initDLPAnimation = () => {
  document.addEventListener("DOMContentLoaded", () => {
    swiperInit(); // Ensure Swiper is initialized on load
    stepFlow(); // Initiate the step flow logic
  });
};
