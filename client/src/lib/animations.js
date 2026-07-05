import gsap from "gsap";
import { useLayoutEffect } from "react";

export const EASE = "power3.out";

/**
 * Staggered fade+rise for a grid/list of children, keyed to `deps` so it
 * re-runs when the underlying data (e.g. fetched places) changes.
 */
export function useStaggerReveal(containerRef, selector, deps = []) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const items = container.querySelectorAll(selector);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: EASE,
          stagger: 0.06,
          clearProps: "transform",
        }
      );
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * One-time entrance animation for hero/intro blocks on mount.
 */
export function useEntranceReveal(ref, options = {}) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: options.y ?? 18 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 0.7,
          delay: options.delay ?? 0,
          ease: EASE,
        }
      );
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function fadeIn(target, vars = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, ...vars.from },
    { opacity: 1, duration: 0.4, ease: EASE, ...vars.to }
  );
}
