import { useEffect, useRef } from "react";

/**
 * Attach to any element ref — adds .revealed class when it enters the viewport.
 * @param {object} options - IntersectionObserver options
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("revealed");
        obs.disconnect();
      }
    }, { threshold: 0.12, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/**
 * Attach to a container — stagger-reveals all direct children with class .reveal-child
 */
export function useStaggerReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.querySelectorAll(".reveal-child");
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add("revealed"), i * 80);
        });
        obs.disconnect();
      }
    }, { threshold: 0.08, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
