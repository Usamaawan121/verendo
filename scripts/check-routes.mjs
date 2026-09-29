import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Check actual rendered page content: a 200 response alone can hide a 404 screen.
const require = createRequire(import.meta.url);
const project = fileURLToPath(new URL("..", import.meta.url));
const expectations = JSON.parse(await readFile(new URL("./route-expectations.json", import.meta.url), "utf8"));
const port = Number(process.env.VERENDO_CHECK_PORT || 3102);
assert(Number.isInteger(port) && port > 0 && port <= 65535, "Invalid VERENDO_CHECK_PORT");
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: project,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
let output = "";
let startupError;
server.on("error", error => { startupError = error; });
for (const stream of [server.stdout, server.stderr]) {
  stream.on("data", chunk => { output = (output + chunk).slice(-20000); });
}
const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const decode = value => value.replace(/&#(x[\da-f]+|\d+);|&(amp|lt|gt|quot|apos|nbsp);/gi, (_, number, name) => number
  ? String.fromCodePoint(number[0].toLowerCase() === "x" ? parseInt(number.slice(1), 16) : Number(number))
  : ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[name.toLowerCase()]);
const normalize = value => decode(value).replace(/\s+/g, " ").trim();
const request = (route, options = {}) => fetch(base + route, { signal: AbortSignal.timeout(30000), ...options });
const media = new Set();
let passed = 0;

try {
  const deadline = Date.now() + 30000;
  while (!/Ready in/.test(output)) {
    if (startupError) throw startupError;
    if (server.exitCode !== null || Date.now() > deadline) {
      throw new Error(`Production server did not start. Run npm run build first.\n${output}`);
    }
    await delay(100);
  }
  for (const { path, heading } of expectations.pages) {
    const response = await request(path);
    const html = await response.text();
    assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert(main, `${path}: main content missing`);
    assert(!/class="[^"]*\bnot-found\b/.test(main), `${path}: 404 screen rendered`);
    const h1 = main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    assert(h1, `${path}: heading missing`);
    assert.equal(normalize(h1.replace(/<[^>]*>/g, "")), heading, `${path}: wrong page rendered`);
    assert(!/sanjaya/i.test(main), `${path}: previous brand found`);
    for (const match of html.matchAll(/(?:src|poster)="(\/(?:media\/[^"?#]+|favicon\.svg))"/g)) media.add(decode(match[1]));
    console.log(`PASS ${path} — ${heading}`);
    passed++;
  }
  for (const { from, to } of expectations.redirects) {
    const response = await request(from, { redirect: "manual" });
    assert([307, 308].includes(response.status), `${from}: redirect missing`);
    assert.equal(new URL(response.headers.get("location"), base).pathname, to, `${from}: wrong redirect target`);
    passed++;
  }
  for (const path of ["/missing-verendo-page", "/projects/not-a-project", "/blog/not-an-article", "/invalid%25path"]) {
    const response = await request(path);
    assert.equal(response.status, 404, `${path}: unknown page should return 404`);
    passed++;
  }
  for (const path of media) {
    const response = await request(path, { method: "HEAD" });
    assert.equal(response.status, 200, `${path}: missing media`);
    assert(/^(image|video)\//.test(response.headers.get("content-type") || ""), `${path}: not media`);
  }
  console.log(`\nPassed ${passed} route/content checks and ${media.size} referenced-media checks.`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (server.exitCode === null) {
    const closed = once(server, "exit");
    server.kill("SIGTERM");
    const timer = setTimeout(() => server.kill("SIGKILL"), 4000);
    await closed;
    clearTimeout(timer);
  }
}
