"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export function FormGuard({
  action,
  revision,
}: {
  action: "contact" | "newsletter";
  revision: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!loaded || !sitekey || !host.current || !window.turnstile) return;
    const api = window.turnstile;
    const id = api.render(host.current, {
      sitekey,
      action,
      theme: "dark",
      // Compact challenges also fit the narrowest contact/newsletter columns.
      size: "compact",
      appearance: "interaction-only",
      "response-field-name": "token",
      "error-callback": () => {
        setUnavailable(true);
        return true;
      },
      callback: () => setUnavailable(false),
    });
    return () => api.remove(id);
  }, [action, loaded, revision, sitekey]);
  return (
    <>
      <div className="form-trap" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {sitekey && (
        <>
          <Script
            id="verendo-turnstile"
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={() => setLoaded(true)}
            onError={() => setUnavailable(true)}
          />
          <div ref={host} data-turnstile />
          {unavailable && (
            <p className="form-help" role="status">
              The security check could not load. Please refresh, or contact us
              by email.
            </p>
          )}
        </>
      )}
    </>
  );
}
