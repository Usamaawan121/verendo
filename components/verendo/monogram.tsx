"use client";
import { useEffect, useRef, useState } from "react";
import type { VerendoSceneController } from "./scene-engine";

/** A local poster stays visible when WebGL cannot run. */
export function VerendoMonogram({
  variant = "hero",
  className = "",
}: {
  variant?: "hero" | "footer";
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = root.current,
      host = mount.current;
    if (!element || !host) return;
    let disposed = false,
      pending = false,
      visible = false;
    let scene: VerendoSceneController | undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const refresh = () => {
      scene?.setReducedMotion(preference.matches);
      scene?.setActive(visible && !document.hidden);
    };
    const load = async () => {
      if (pending || disposed) return;
      pending = true;
      try {
        const { createVerendoScene } = await import("./scene-engine");
        if (disposed) return;
        scene = createVerendoScene(host, variant, () => {
          if (!disposed) setReady(false);
        });
        refresh();
        if (!disposed) setReady(true);
      } catch {
        scene?.dispose();
        scene = undefined;
        if (!disposed) setReady(false);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) void load();
        refresh();
      },
      { rootMargin: "160px" },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", refresh);
    preference.addEventListener("change", refresh);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      preference.removeEventListener("change", refresh);
      scene?.dispose();
    };
  }, [variant]);
  return (
    <div
      ref={root}
      className={`verendo-scene ${className}`}
      data-variant={variant}
      data-ready={ready}
      aria-hidden="true"
    >
      {variant === "hero" && (
        <img
          className="verendo-scene-landscape"
          src="/media/verendo-v-landscape.webp"
          alt=""
          fetchPriority="high"
        />
      )}
      <img
        className="verendo-scene-poster"
        src={
          variant === "hero" ? "/media/verendo-v-poster.webp" : "/favicon.svg"
        }
        alt=""
        loading={variant === "hero" ? "eager" : "lazy"}
      />
      <div className="verendo-scene-canvas" ref={mount} />
    </div>
  );
}
