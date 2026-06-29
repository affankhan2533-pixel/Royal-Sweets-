/**
 * Container — Universal max-width centering wrapper
 *
 * Usage:
 *   <Container>…content…</Container>
 *   <Container size="wide">…wider content…</Container>
 *   <Container size="narrow">…narrow content…</Container>
 */

import React from "react";

type ContainerSize = "default" | "wide" | "narrow" | "full";

interface ContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  id?: string;
}

const MAX_WIDTHS: Record<ContainerSize, string> = {
  narrow:  "860px",
  default: "1320px",
  wide:    "1560px",
  full:    "100%",
};

export default function Container({
  children,
  size = "default",
  className = "",
  style,
  as: Tag = "div",
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={className}
      style={{
        width: "100%",
        maxWidth: MAX_WIDTHS[size],
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft:  "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
