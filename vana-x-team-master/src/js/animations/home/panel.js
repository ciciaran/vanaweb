import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initPanelAnimation = () => {
  const mainStrip = document.querySelector('[data-strip="main"]');
  const childStrips = document.querySelectorAll('[data-strip="child"]');
  const images = document.querySelectorAll('[data-strip="image"]');

  if (mainStrip && childStrips.length > 0) {
    // Set initial state
    gsap.set(childStrips, { width: "100%" });
    gsap.set(images, { y: "0%" }); // Set initial state for images

    // Create a timeline with ScrollTrigger for the child strips
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mainStrip,
        start: "top 120%",
        end: "bottom 80%",
        scrub: 1,
        markers: false, // Remove this in production
      },
    });

    // Add staggered animations for the child strips
    childStrips.forEach((strip, index) => {
      tl.to(
        strip,
        {
          width: "0%",
          duration: 2,
          ease: "power2.inOut",
        },
        index * 0.1
      );
    });

    // Add parallax effect for images
    images.forEach((image) => {
      gsap.from(image, {
        y: "10%", // Adjust this value for the desired parallax effect
        scrollTrigger: {
          trigger: mainStrip,
          start: "top 120%", // Start the parallax effect when the image is in view
          end: "bottom 80%", // End the effect when the image leaves the view
          scrub: 1, // Smooth parallax movement
          markers: false, // Remove this in production
        },
      });
    });
  }
};
