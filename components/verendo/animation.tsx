"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  animate,
} from "motion/react";
import Lenis from "lenis";

// The same easing is shared by entrances and page transitions.
export const ease = [0.22, 1, 0.36, 1] as const;
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      smoothWheel: true,
      anchors: true,
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.75, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
export function TextReveal({
  text,
  as = "h2",
  className = "",
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const Tag = as === "h1" ? motion.h1 : as === "h3" ? motion.h3 : motion.h2;
  let index = 0;
  return (
    <Tag
      className={`text-reveal ${className}`}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {text.split(" ").map((word, i) => (
        <span className="word" aria-hidden="true" key={i}>
          {[...word].map((letter, j) => {
            const n = index++;
            return (
              <motion.span
                key={j}
                className="letter"
                variants={{
                  hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: Math.min(n * 0.013, 0.8),
                      ease,
                    },
                  },
                }}
              >
                {letter}
              </motion.span>
            );
          })}
          {i < text.split(" ").length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </Tag>
  );
}
export function Video({
  src,
  className = "",
  label,
  poster,
}: {
  src: string;
  className?: string;
  label?: string;
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "160px" });
  const reduced = useReducedMotion();
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (inView && !reduced) void video.play().catch(() => {});
    else video.pause();
  }, [inView, reduced]);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
      aria-label={label}
      aria-hidden={!label}
    />
  );
}
export function ParallaxImage({
  src,
  className = "",
  alt = "",
}: {
  src: string;
  className?: string;
  alt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null),
    reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <div ref={ref} className={`parallax-image ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y: reduced ? 0 : y }}
      />
    </div>
  );
}
export function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null),
    seen = useInView(ref, { once: true }),
    reduced = useReducedMotion();
  const [number, setNumber] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const controls = animate(0, value, {
      duration: reduced ? 0 : 1.6,
      ease,
      onUpdate: (n) => setNumber(Math.round(n)),
    });
    return () => controls.stop();
  }, [seen, value, reduced]);
  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      <span aria-hidden="true">
        {number}
        {suffix}
      </span>
    </span>
  );
}
