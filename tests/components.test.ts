import assert from "node:assert/strict";
import { test, afterEach } from "node:test";
import { JSDOM } from "jsdom";
import React from "react";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "https://verendo.example/contact",
  pretendToBeVisual: true,
});
let width = 390,
  height = 844;
const queries = new Map<
  string,
  {
    listeners: Set<() => void>;
    media: string;
    readonly matches: boolean;
    addEventListener: (_name: string, callback: () => void) => void;
    removeEventListener: (_name: string, callback: () => void) => void;
    addListener: (callback: () => void) => void;
    removeListener: (callback: () => void) => void;
  }
>();
const matches = (query: string) =>
  query.includes("prefers-reduced-motion")
    ? false
    : query.includes("max-width")
      ? width <= Number(query.match(/\d+/)?.[0])
      : query.includes("max-height")
        ? height <= Number(query.match(/\d+/)?.[0])
        : false;
const matchMedia = (query: string) => {
  if (!queries.has(query)) {
    const listeners = new Set<() => void>();
    queries.set(query, {
      listeners,
      media: query,
      get matches() {
        return matches(query);
      },
      addEventListener: (_name, cb) => {
        listeners.add(cb);
      },
      removeEventListener: (_name, cb) => {
        listeners.delete(cb);
      },
      addListener: (cb) => {
        listeners.add(cb);
      },
      removeListener: (cb) => {
        listeners.delete(cb);
      },
    });
  }
  return queries.get(query)! as unknown as MediaQueryList;
};
class IntersectionMock {
  constructor(private callback: IntersectionObserverCallback) {}
  observe(element: Element) {
    queueMicrotask(() =>
      this.callback(
        [
          {
            target: element,
            isIntersecting: true,
            intersectionRatio: 1,
          } as IntersectionObserverEntry,
        ],
        this as unknown as IntersectionObserver,
      ),
    );
  }
  unobserve() {}
  disconnect() {}
}
class ResizeMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "Element",
  "SVGElement",
  "Node",
  "MutationObserver",
  "HTMLInputElement",
  "HTMLSelectElement",
  "HTMLFormElement",
  "FormData",
  "getComputedStyle",
] as const) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value:
      key === "window"
        ? dom.window
        : (dom.window as unknown as Record<string, unknown>)[key],
  });
}
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
Object.assign(globalThis, {
  matchMedia,
  IntersectionObserver: IntersectionMock,
  ResizeObserver: ResizeMock,
  requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
  cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
  IS_REACT_ACT_ENVIRONMENT: true,
});
Object.assign(dom.window, {
  matchMedia,
  IntersectionObserver: IntersectionMock,
  ResizeObserver: ResizeMock,
  scrollTo: () => {},
});
Object.defineProperty(dom.window, "innerWidth", { get: () => width });
Object.defineProperty(dom.window, "innerHeight", { get: () => height });

const { render, cleanup, fireEvent, waitFor, act } =
  await import("@testing-library/react");
const { SearchParamsContext } =
  await import("next/dist/shared/lib/hooks-client-context.shared-runtime.js");
const { ContactPage } = await import("../components/verendo/pages");
const { BusinessFriction, ProcessSequence, WhyVerendo } =
  await import("../components/verendo/experience");
const fetchOriginal = globalThis.fetch;
afterEach(async () => {
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 30)); });
  cleanup();
  globalThis.fetch = fetchOriginal;
});

const renderContact = () =>
  render(
    React.createElement(
      SearchParamsContext.Provider,
      { value: new URLSearchParams() },
      React.createElement(ContactPage),
    ),
  );
function fill(container: HTMLElement) {
  for (const [name, value] of Object.entries({
    name: "Test Visitor",
    email: "visitor@example.com",
    company: "Example Business",
    message: "Please help us build our new business website.",
  }))
    fireEvent.change(container.querySelector(`[name="${name}"]`)!, {
      target: { value },
    });
  fireEvent.change(container.querySelector('[name="service"]')!, {
    target: { value: "website-development" },
  });
  fireEvent.change(container.querySelector('[name="budget"]')!, {
    target: { value: "$15k" },
  });
}

test("budget shows exactly the four requested values and stays optional", async () => {
  const view = renderContact();
  const select = view.container.querySelector(
    'select[name="budget"]',
  ) as unknown as HTMLSelectElement;
  assert.deepEqual(
    Array.from(select.options)
      .filter((option) => option.value)
      .map((option) => option.value),
    ["$5k", "$10k", "$15k", "$20k+"],
  );
  assert.equal(select.required, false);
  await act(async () => {});
});

test("contact form preserves values until successful acknowledgement, then clears and confirms", async () => {
  let accept: ((value: Response) => void) | undefined;
  let captured: Record<string, string> = {};
  globalThis.fetch = async (_url, options) => {
    captured = JSON.parse(String(options?.body));
    return await new Promise<Response>((resolve) => {
      accept = resolve;
    });
  };
  const view = renderContact();
  fill(view.container);
  const form = view.container.querySelector("form")!;
  fireEvent.submit(form);
  await waitFor(() => assert.ok(accept));
  assert.equal(
    (view.container.querySelector('input[name="name"]') as HTMLInputElement)
      .value,
    "Test Visitor",
  );
  assert.equal(
    view.container
      .querySelector('button[type="submit"]')
      ?.hasAttribute("disabled"),
    true,
  );
  assert.equal(captured.budget, "$15k");
  assert.equal(captured.service, "website-development");
  await act(async () =>
    accept!(
      Response.json({
        ok: true,
        message: "Your project details have been sent.",
      }),
    ),
  );
  await waitFor(() =>
    assert.match(
      view.container.textContent || "",
      /Your project details have been sent/,
    ),
  );
  assert.equal(
    (view.container.querySelector('input[name="name"]') as HTMLInputElement)
      .value,
    "",
  );
  assert.equal(
    (view.container.querySelector('select[name="budget"]') as unknown as HTMLSelectElement)
      .value,
    "",
  );
  assert.equal(
    (
      view.container.querySelector(
        'select[name="service"]',
      ) as unknown as HTMLSelectElement
    ).value,
    "",
  );
  assert.equal(
    view.container.querySelector(".form-status")?.getAttribute("data-state"),
    "success",
  );
});

test("delivery failure keeps enquiry data and displays an error", async () => {
  globalThis.fetch = async () =>
    Response.json({ ok: false, message: "Please try again." }, { status: 502 });
  const view = renderContact();
  fill(view.container);
  fireEvent.submit(view.container.querySelector("form")!);
  await waitFor(() =>
    assert.equal(
      view.container.querySelector(".form-status")?.getAttribute("data-state"),
      "error",
    ),
  );
  assert.equal(
    (view.container.querySelector('input[name="name"]') as HTMLInputElement)
      .value,
    "Test Visitor",
  );
  assert.equal(
    (view.container.querySelector('select[name="budget"]') as unknown as HTMLSelectElement)
      .value,
    "$15k",
  );
});

test("phone and tablet widths keep animated process; short landscape keeps every step readable", async () => {
  const view = render(React.createElement(ProcessSequence));
  for (const viewport of [
    [320, 568],
    [360, 800],
    [390, 844],
    [412, 915],
    [768, 1024],
    [820, 1180],
    [1440, 900],
  ]) {
    await act(async () => {
      [width, height] = viewport;
      for (const query of queries.values())
        for (const cb of query.listeners) cb();
    });
    await waitFor(() =>
      assert.ok(view.container.querySelector(".process-sticky")),
    );
    assert.ok(!view.container.querySelector(".sequence-static"));
    for (const label of ["Uncover", "Plan", "Build", "Launch"])
      assert.ok(view.container.textContent?.includes(label));
  }
  await act(async () => {
    width = 844;
    height = 390;
    for (const query of queries.values())
      for (const cb of query.listeners) cb();
  });
  await waitFor(() =>
    assert.equal(
      view.container.querySelectorAll(".process-mobile-card").length,
      4,
    ),
  );
});

test("all benefit badges and both comparison cards survive responsive mode changes", async () => {
  const view = render(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(BusinessFriction),
      React.createElement(WhyVerendo),
    ),
  );
  for (const viewport of [
    [390, 844],
    [844, 390],
    [1440, 900],
    [390, 844],
  ]) {
    await act(async () => {
      [width, height] = viewport;
      for (const query of queries.values())
        for (const cb of query.listeners) cb();
    });
    assert.equal(view.container.querySelectorAll(".friction-badge").length, 4);
    assert.equal(view.container.querySelectorAll(".difference-card").length, 2);
    if (height < 541) {
      for (const el of view.container.querySelectorAll<HTMLElement>(
        ".difference-cards,.difference-card",
      ))
        assert.equal(el.style.opacity, "1");
    }
  }
});
