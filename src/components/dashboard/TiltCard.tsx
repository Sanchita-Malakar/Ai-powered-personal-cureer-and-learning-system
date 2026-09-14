"use client";

import React, { useRef, useState, useCallback } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "accent" | "ai" | "attention" | "none";
  maxTilt?: number;
  scale?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  glow = "none",
  maxTilt = 6,
  scale = 1.012,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease",
  });
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Mouse position relative to element (0 to 1)
      const mouseX = (e.clientX - rect.left) / width;
      const mouseY = (e.clientY - rect.top) / height;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      const rotateX = ((mouseY - 0.5) * -2 * maxTilt).toFixed(2);
      const rotateY = ((mouseX - 0.5) * 2 * maxTilt).toFixed(2);

      setTransformStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: "transform 0.1s ease-out, box-shadow 0.2s ease-out",
      });

      setGlarePosition({
        x: mouseX * 100,
        y: mouseY * 100,
        opacity: 0.14,
      });
    },
    [maxTilt, scale]
  );

  const handleMouseLeave = useCallback(() => {
    setTransformStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease",
    });
    setGlarePosition((prev) => ({
      ...prev,
      opacity: 0,
    }));
  }, []);

  const getGlowShadow = () => {
    switch (glow) {
      case "ai":
        return "hover:shadow-glow-ai hover:border-ai/40";
      case "accent":
        return "hover:shadow-glow-accent hover:border-accent/40";
      case "attention":
        return "hover:shadow-glow-attention hover:border-attention/40";
      default:
        return "hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`relative group/tilt rounded-2xl will-change-transform transform-gpu ${getGlowShadow()} ${className}`}
    >
      {/* Dynamic Specular Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glarePosition.opacity}) 0%, transparent 65%)`,
          opacity: glarePosition.opacity > 0 ? 1 : 0,
        }}
      />

      {/* Card Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
