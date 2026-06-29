/**
 * Section — Consistent vertical spacing wrapper for every page section.
 *
 * Usage:
 *   <Section background="cream" id="collection">
 *     <Container>…</Container>
 *   </Section>
 */

import React from "react";

type SectionBg = "white" | "cream" | "deep" | "dark" | "transparent";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  background?: SectionBg;
  /** Extra top border separator */
  bordered?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Size of the vertical padding: sm=40/60, md=80/120, lg=100/160 */
  pad?: "sm" | "md" | "lg";
  as?: React.ElementType;
}

const BG_MAP: Record<SectionBg, string> = {
  white:       "#FFFFFF",
  cream:       "var(--champagne)",
  deep:        "var(--bg-deep)",
  dark:        "var(--bg-dark)",
  transparent: "transparent",
};

const PAD_MAP: Record<"sm" | "md" | "lg", string> = {
  sm: "clamp(40px,  6vw,  80px) 0",
  md: "clamp(70px,  9vw, 120px) 0",
  lg: "clamp(90px, 11vw, 160px) 0",
};

export default function Section({
  children,
  id,
  background = "dark",
  bordered = false,
  className = "",
  style,
  pad = "md",
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={className}
      style={{
        position: "relative",
        backgroundColor: BG_MAP[background],
        padding: PAD_MAP[pad],
        borderTop: bordered ? "1px solid rgba(212, 168, 67, 0.14)" : undefined,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
