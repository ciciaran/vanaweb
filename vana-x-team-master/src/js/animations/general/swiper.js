import Swiper from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";

export const cohortsSwiperInit = () => {
  return new Swiper(".swiper", {
    speed: 400,

    mousewheel: {
      forceToAxis: true,
    },

    keyboard: {
      enabled: true,
    },

    freeMode: true,

    direction: "horizontal",

    draggable: true,

    scrollbar: {
      el: ".swiper-scrollbar", // The element that will be created automatically
      hide: false, // The scrollbar will be visible
      draggable: true, // Enable dragging
    },
  });
};
