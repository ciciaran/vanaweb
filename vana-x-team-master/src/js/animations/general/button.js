import gsap from "gsap";
import SplitType from "split-type";

export function buttonAnimation() {
  console.log("Button Animation Loaded");

  // Animation parameters
  const params = {
    shimmer: {
      duration: 0.1,
      stagger: 0.03,
    },
    icon: {
      duration: 0.6,
      ease: "expo.out",
      delay: 0.1,
    },
  };

  const buttons = document.querySelectorAll('[data-btn="link"]');

  buttons.forEach((button) => {
    const text = button.querySelector('[data-btn="text"]');
    const iconRel = button.querySelector('[data-btn="icon-rel"]');
    const iconAb = button.querySelector('[data-btn="icon-ab"]');

    // Split text into characters
    const splitText = new SplitType(text, { types: "chars" });

    // State management
    const state = {
      isHovered: false,
      isAnimating: false,
      currentAnimation: null,
    };

    // Set initial states
    gsap.set(iconRel, { x: 0 });
    gsap.set(iconAb, { x: -100 });

    // Create animations
    const shimmerEffect = gsap.to(splitText.chars, {
      opacity: 0.2,
      stagger: {
        each: params.shimmer.stagger,
        onComplete: function () {
          gsap.to(this.targets(), {
            opacity: 1,
            duration: params.shimmer.duration,
          });
        },
      },
      duration: params.shimmer.duration,
      paused: true,
    });

    function animateIcons(toEnter) {
      const tl = gsap.timeline({
        onStart: () => {
          state.isAnimating = true;
        },
        onComplete: () => {
          state.isAnimating = false;
          if (state.isHovered !== toEnter) {
            animateIcons(!toEnter);
          }
        },
      });

      tl.to(
        iconRel,
        {
          x: toEnter ? 100 : 0,
          duration: params.icon.duration,
          ease: params.icon.ease,
        },
        params.icon.delay
      ).to(
        iconAb,
        {
          x: toEnter ? 0 : -100,
          duration: params.icon.duration,
          ease: params.icon.ease,
        },
        params.icon.delay
      );

      return tl;
    }

    function enterAnimation() {
      if (state.isHovered) return;
      state.isHovered = true;

      shimmerEffect.restart();

      if (state.currentAnimation) {
        state.currentAnimation.kill();
      }

      state.currentAnimation = animateIcons(true);
    }

    function exitAnimation() {
      if (!state.isHovered) return;
      state.isHovered = false;

      if (state.currentAnimation) {
        state.currentAnimation.kill();
      }

      state.currentAnimation = animateIcons(false);
    }

    // Event listeners
    function handleMouseEnter() {
      enterAnimation();
    }

    function handleMouseLeave() {
      exitAnimation();
    }

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup function for this specific button
    button.cleanup = () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      if (state.currentAnimation) {
        state.currentAnimation.kill();
      }
      shimmerEffect.kill();
    };
  });

  // Global cleanup function
  return function cleanup() {
    buttons.forEach((button) => {
      if (typeof button.cleanup === "function") {
        button.cleanup();
      }
    });
  };
}
