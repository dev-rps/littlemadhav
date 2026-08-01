"use client";
import { useEffect, useRef, useState, RefObject } from "react";

/**
 * Custom hook for IntersectionObserver-based scroll animations.
 * Returns a ref and a boolean `isVisible` that becomes true when the element enters the viewport.
 *
 * Usage:
 *   const [ref, isVisible] = useScrollAnimation();
 *   <div ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // only trigger once
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/**
 * Wrapper component for scroll-triggered fade-in animation.
 * Wraps children in a div that fades in + slides up when scrolled into view.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
