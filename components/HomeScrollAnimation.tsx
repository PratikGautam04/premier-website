"use client";

import { useEffect } from "react";

/**
 * HomeScrollAnimation
 * 
 * Manages the scroll-driven animations on the Home page:
 * 1. 8-card Exquisite Collection sequence (.xq-track / .xq-pin)
 * 2. 6-card Why Premier sequence (.why-track / .why-pin)
 * 
 * Progresses cards smoothly as the user scrolls vertically through each section,
 * and allows clicking dots/tabs to smooth-scroll directly to that card.
 */
export default function HomeScrollAnimation() {
  useEffect(() => {
    const xqTrack = document.querySelector<HTMLElement>(".xq-track");
    const xqPin = document.querySelector<HTMLElement>(".xq-pin");
    const whyTrack = document.querySelector<HTMLElement>(".why-track");
    const whyPin = document.querySelector<HTMLElement>(".why-pin");

    if (!xqTrack && !whyTrack) return;

    // Helper: calculate scroll progress [0, 1] through a pinned section
    const getProgress = (track: HTMLElement, pin: HTMLElement) => {
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - pin.offsetHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / total));
    };

    // ---------------------------------------------------------------
    // 1. First Animation: Exquisite Collection sequence (dynamic card count)
    // ---------------------------------------------------------------
    let curXq = 0;
    const bgs = document.querySelectorAll<HTMLElement>(".xq-bg");
    const covers = document.querySelectorAll<HTMLElement>(".xq-cover");
    const copies = document.querySelectorAll<HTMLElement>(".xq-copy .slide-t");
    const dots = document.querySelectorAll<HTMLElement>(".xq-dots button");
    const countXq = covers.length || 8;

    if (xqTrack) {
      xqTrack.style.setProperty("--n", String(countXq));
    }

    const setXqCard = (index: number) => {
      if (index === curXq) return;
      const prev = curXq;
      curXq = index;

      if (covers[prev]) {
        covers[prev].classList.add("is-leaving");
        setTimeout(() => {
          covers[prev]?.classList.remove("is-leaving");
        }, 950);
      }

      bgs.forEach((bg, i) => bg.classList.toggle("on", i === index));
      covers.forEach((cover, i) =>
        cover.classList.toggle("is-active", i === index)
      );
      copies.forEach((copy, i) =>
        copy.classList.toggle("is-active", i === index)
      );
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-current", i === index ? "true" : "false");
      });
    };

    // Dot click handlers: smooth-scroll to corresponding card
    const dotCleanups: Array<() => void> = [];
    dots.forEach((dot, i) => {
      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        if (!xqTrack || !xqPin) return;
        const total = xqTrack.offsetHeight - xqPin.offsetHeight;
        const top = xqTrack.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: top + ((i + 0.5) / countXq) * total,
          behavior: "smooth",
        });
      };
      dot.addEventListener("click", handleClick);
      dotCleanups.push(() => dot.removeEventListener("click", handleClick));
    });

    // ---------------------------------------------------------------
    // 2. Second Animation: Why Premier sequence (dynamic card count)
    // ---------------------------------------------------------------
    let curWhy = 0;
    const tabs = document.querySelectorAll<HTMLElement>(".why .tab");
    const countWhy = tabs.length || 6;

    if (whyTrack) {
      whyTrack.style.setProperty("--n", String(countWhy));
    }

    const setWhyCard = (index: number) => {
      if (index === curWhy) return;
      curWhy = index;

      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.classList.toggle("on", on);
        tab.setAttribute("aria-expanded", on ? "true" : "false");
      });
    };

    // Tab click handlers: smooth-scroll to corresponding tab
    const tabCleanups: Array<() => void> = [];
    tabs.forEach((tab, i) => {
      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        if (!whyTrack || !whyPin) return;
        const total = whyTrack.offsetHeight - whyPin.offsetHeight;
        const top = whyTrack.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: top + ((i + 0.5) / countWhy) * total,
          behavior: "smooth",
        });
      };
      tab.addEventListener("click", handleClick);
      tabCleanups.push(() => tab.removeEventListener("click", handleClick));
    });

    // ---------------------------------------------------------------
    // 3. Scroll Loop: sync both card animations with vertical scroll
    // ---------------------------------------------------------------
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        // Progress 8-card sequence
        if (xqTrack && xqPin) {
          const rect = xqTrack.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const p = getProgress(xqTrack, xqPin);
            const activeIndex = Math.min(countXq - 1, Math.floor(p * countXq));
            setXqCard(activeIndex);
          }
        }

        // Progress 6-card sequence
        if (whyTrack && whyPin) {
          const rect = whyTrack.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const p = getProgress(whyTrack, whyPin);
            const activeIndex = Math.min(countWhy - 1, Math.floor(p * countWhy));
            setWhyCard(activeIndex);
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      dotCleanups.forEach((cleanup) => cleanup());
      tabCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
