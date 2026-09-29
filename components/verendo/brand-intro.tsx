"use client";
import { useEffect, useSyncExternalStore } from "react";

// Keep completion for this document even if React remounts the component.
// A real refresh creates a new document, so it still plays the opening screen.
const completedDocuments = new WeakSet<Document>();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const getSnapshot = () => completedDocuments.has(document);
const getServerSnapshot = () => false;
function finishIntro() {
  completedDocuments.add(document);
  for (const listener of listeners) listener();
}

export function BrandIntro() {
  const complete = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    if (complete) return;
    // CSS remains the timing source (2.6s). Recover if animationend is missed.
    const timeout = window.setTimeout(finishIntro, 2800);
    return () => window.clearTimeout(timeout);
  }, [complete]);
  if (complete) return null;
  return (
    <div
      className="verendo-intro"
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) finishIntro();
      }}
    >
      <span className="verendo-intro-wordmark">Verendo</span>
    </div>
  );
}
