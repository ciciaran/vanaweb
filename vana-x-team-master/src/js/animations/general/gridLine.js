// Import GSAP and ScrollTrigger
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Function to animate grid lines
export function animateGridLines({
  duration = 1,
  ease = "power1.inOut",
  staggerAmount = 0.2,
  resetOnLeave = true,
  lineSelector = '[data-grid="h-line"], [data-grid="v-line"]',
  wrapSelector = '[data-grid="line-wrap"]',
} = {}) {
  // Animate individual lines
  gsap.utils.toArray(lineSelector).forEach((line) => {
    const isHorizontal = line.dataset.grid === "h-line";
    const targetProperty = isHorizontal ? "width" : "height";

    // Set initial state
    gsap.set(line, { [targetProperty]: 0 });

    // Create ScrollTrigger for individual lines
    ScrollTrigger.create({
      trigger: line,
      start: "top 80%",
      end: "top 20%",
      onEnter: () => {
        gsap.to(line, {
          [targetProperty]: "100%",
          duration,
          ease,
        });
      },
      onLeaveBack: resetOnLeave
        ? () => gsap.to(line, { [targetProperty]: 0, duration, ease })
        : null,
    });
  });

  // Animate lines inside a wrap with alternating directions
  gsap.utils.toArray(wrapSelector).forEach((wrap) => {
    const lines = gsap.utils.toArray(lineSelector, wrap);

    lines.forEach((line, index) => {
      const isHorizontal = line.dataset.grid === "h-line";
      const targetProperty = isHorizontal ? "width" : "height";

      // Alternating logic
      const fromSide = isHorizontal
        ? index % 2 === 0
          ? { left: "0%", right: "auto" }
          : { left: "auto", right: "0%" }
        : index % 2 === 0
        ? { top: "0%", bottom: "auto" }
        : { top: "auto", bottom: "0%" };

      // Set initial state with alternating direction
      gsap.set(line, { [targetProperty]: 0, ...fromSide });

      // Create ScrollTrigger for wrapped lines with stagger and alternate directions
      ScrollTrigger.create({
        trigger: wrap,
        start: "top 80%",
        end: "top 20%",
        onEnter: () => {
          gsap.to(line, {
            [targetProperty]: "100%",
            duration,
            ease,
            stagger: { amount: staggerAmount },
          });
        },
        onLeaveBack: resetOnLeave
          ? () =>
              gsap.to(line, {
                [targetProperty]: 0,
                duration,
                ease,
                stagger: { amount: staggerAmount },
              })
          : null,
      });
    });
  });
}
