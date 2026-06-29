"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorOuter = useRef<HTMLDivElement>(null);
  const cursorInner = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024 || window.matchMedia("(pointer: coarse)").matches) return; // No custom cursor on mobile/tablet or touch screens

    const outer = cursorOuter.current;
    const inner = cursorInner.current;
    if (!outer || !inner) return;

    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);

      gsap.to(inner, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: "power2.out",
      });
    };

    // Outer cursor follows with lag
    const tick = () => {
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;
      gsap.set(outer, { x: outerX, y: outerY });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Hover effects
    const onEnterHover = () => {
      gsap.to(outer, { scale: 2.2, opacity: 0.5, duration: 0.3 });
      gsap.to(inner, { scale: 0.4, duration: 0.3 });
    };
    const onLeaveHover = () => {
      gsap.to(outer, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(inner, { scale: 1, duration: 0.3 });
    };

    const attachHover = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterHover);
        el.addEventListener("mouseleave", onLeaveHover);
      });
    };

    window.addEventListener("mousemove", onMove);
    attachHover();

    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, [visible]);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorOuter}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(255, 153, 51, 0.75)",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
          mixBlendMode: "normal",
        }}
      />
      {/* Inner dot */}
      <div
        ref={cursorInner}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--saffron)",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
    </>
  );
}
