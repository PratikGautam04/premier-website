"use client";

import { useEffect, useState } from "react";

interface ScrollEffectsProps {
  currentPage?: string;
}

// Auto reveal selector mapping matching motion.js
const AUTO_SELECTORS: [string, string][] = [
  [".phero .wrap>*", ""],
  [".hero-copy>*", ""],
  [".hero-vis", "zoom"],
  [".shead>*", ""],
  [".split-copy>*", ""],
  [".split-media", "zoom"],
  [".pillar", ""],
  [".attr", ""],
  [".feat", ""],
  ["details.q", ""],
  [".faq-grid>.t-l", ""],
  [".cta-box", "zoom"],
  [".ccard", ""],
  [".others a", ""],
  [".themes span", "pop"],
  [".info>div", ""],
  [".form", ""],
  [".quote .wrap>*", ""],
  [".lc-copy>*", ""],
  [".lc-media", "zoom"],
  [".stat", ""],
  [".chero .wrap>*", ""],
  [".cb-copy>*", ""],
  [".gal figure", "zoom"],
  [".uses>div", "pop"],
  [".swblock", "zoom"],
  [".bands", ""],
  [".abt2-l>*:not(h2)", ""],
  [".acard", "zoom"],
  [".proc .shead>*", ""],
  [".pnode", ""],
  [".fact", ""],
  [".bcard", "zoom"],
  [".abp-intro>*", ""],
  [".abp-banner>div>*", ""],
];

export default function ScrollEffects({ currentPage }: ScrollEffectsProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // 1. Scroll progress bar updater
  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(window.scrollY / total);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Auto-reveal elements, stagger siblings, and observe on scroll
  useEffect(() => {
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    const setupReveal = () => {
      // 1. Tag auto-reveal selectors with data-r
      AUTO_SELECTORS.forEach(([sel, type]) => {
        const els = document.querySelectorAll(sel);
        els.forEach((el) => {
          if (
            el.hasAttribute("data-r") ||
            el.closest(".abt") ||
            el.closest(".xq-pin") ||
            el.closest(".why-pin")
          ) {
            return;
          }
          el.setAttribute("data-r", type);
        });
      });

      // 2. Stagger sibling reveal delays (--d)
      const groups: { p: Element; n: number }[] = [];
      const pending = document.querySelectorAll<HTMLElement>("[data-r]");

      pending.forEach((el) => {
        const p = el.parentElement;
        if (!p) return;
        let g = groups.find((x) => x.p === p);
        if (!g) {
          g = { p, n: 0 };
          groups.push(g);
        }
        el.style.setProperty("--d", `${Math.min(g.n, 6) * 80}ms`);
        g.n++;
      });

      // 3. Observe unrevealed elements
      pending.forEach((el) => {
        if (isReducedMotion) {
          el.classList.add("in");
        } else if (!el.classList.contains("in")) {
          observer.observe(el);
        }
      });
    };

    // Run setup immediately and after a brief delay to catch rendered sections
    setupReveal();
    const timer1 = setTimeout(setupReveal, 150);
    const timer2 = setTimeout(setupReveal, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
    };
  }, [currentPage]);

  return (
    <div className="pbar" aria-hidden="true">
      <i style={{ transform: `scaleX(${scrollProgress})` }} />
    </div>
  );
}
