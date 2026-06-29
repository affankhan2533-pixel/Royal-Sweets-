"use client";
import { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  href?: string;
  id?: string;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  id,
}: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!btnRef.current || !textRef.current) return;
    
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    // Calculate distance from cursor to center of button
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    
    // Parallax effect: outer button frame moves less, inner text moves more
    gsap.to(btnRef.current, {
      x: dx * 0.22,
      y: dy * 0.22,
      duration: 0.4,
      ease: "power2.out"
    });
    
    gsap.to(textRef.current, {
      x: dx * 0.12,
      y: dy * 0.12,
      duration: 0.4,
      ease: "power2.out"
    });
  }, []);

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
    gsap.to(btnRef.current, { scale: 1.03, duration: 0.3, ease: "power2.out" });
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (!btnRef.current || !textRef.current) return;
    
    // Return both outer frame and inner text to center with a smooth spring back
    gsap.to(btnRef.current, { 
      x: 0, 
      y: 0, 
      scale: 1, 
      duration: 0.75, 
      ease: "elastic.out(1.1, 0.45)" 
    });
    
    gsap.to(textRef.current, { 
      x: 0, 
      y: 0, 
      duration: 0.75, 
      ease: "elastic.out(1.1, 0.45)" 
    });
  }, []);

  return (
    <button
      ref={btnRef}
      id={id}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`btn-luxury ${variant === "primary" ? "btn-primary" : "btn-outline"} ${className}`}
      style={{
        // Uses light-themed CSS shadows from globals.css for optimal GPU transition sync
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <span 
        ref={textRef}
        style={{ 
          position: "relative", 
          zIndex: 2, 
          display: "flex", 
          alignItems: "center", 
          gap: 10,
          pointerEvents: "none" // prevents text hover boundary from resetting mouse positions
        }}
      >
        {children}
      </span>
    </button>
  );
}
