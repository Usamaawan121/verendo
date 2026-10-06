"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const compactQuery = "(max-width: 809px)";
const shortQuery = "(max-height: 540px)";

function subscribeLayout(callback: () => void) {
  const queries = [compactQuery, shortQuery].map((query) => matchMedia(query));
  queries.forEach((query) => query.addEventListener("change", callback));
  return () =>
    queries.forEach((query) => query.removeEventListener("change", callback));
}

/** Screen width changes the composition, never whether motion is enabled. */
export function useMotionLayout() {
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const compact = useSyncExternalStore(
    subscribeLayout,
    () => matchMedia(compactQuery).matches,
    serverReady,
  );
  const short = useSyncExternalStore(
    subscribeLayout,
    () => matchMedia(shortQuery).matches,
    serverReady,
  );
  const reduced = Boolean(useReducedMotion());
  return {
    ready,
    compact,
    short,
    reduced,
    pinned: ready && !reduced && !short,
  };
}
