import { initGenAnimations } from "../animations/general";
import { initHomeAnimations } from "../animations/home";
import { renderEvents } from "../components/eventRenderer";
import { getEvents } from "../components/eventList";
import { initDLPAnimation } from "../animations/dlp";
import { cohortsSwiperInit } from "../animations/general/swiper";

// General scripts that should run on all pages
const initGeneralScripts = () => {
  console.log("General scripts initialized");
  initGenAnimations();
};

// Function to initialize event list (formerly in index.js)
const initializeEventList = async () => {
  try {
    const events = await getEvents();
    renderEvents(events);
  } catch (error) {
    console.error("Failed to initialize event list:", error);
    const listWrap = document.querySelector('[data-event="list-wrap"]');
    if (listWrap) {
      listWrap.innerHTML =
        "<p>Sorry, we couldn't load the events at this time. Please try again later.</p>";
    }
  }
};

// Get the current page's path
const getPagePath = () => {
  return window.location.pathname;
};

export const initAll = () => {
  const path = getPagePath();

  // Initialize general scripts for all pages
  initGeneralScripts();

  // Conditional initialization based on page path
  if (path === "/") {
    initHomeAnimations();
    cohortsSwiperInit();
  } else if (path.includes("/aurora-cohorts")) {
    // initAuroraCohortsAnimations();
    cohortsSwiperInit();
  } else if (path.includes("/events")) {
    initializeEventList();
  } else if (path.startsWith("/dlp")) {
    initDLPAnimation();
  }

  // Add other conditional page initializations here
};
