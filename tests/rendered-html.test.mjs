import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Trust Lab", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Trust Lab<\/title>/i);
  assert.match(html, /TRUST LAB/);
  assert.match(html, /Would You Trust Me\?/);
  assert.match(html, /The AI Coworker/);
  assert.match(html, /Trust calibration/);
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.doesNotMatch(html, /react-loading-skeleton|Your site is taking shape|Codex is building/i);
});

test("keeps Trust Lab product files free of starter preview imports", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Start game audio/);
  assert.match(page, /tone-\$\{tone\}\.mp3/);
  assert.doesNotMatch(page, /speechSynthesis|SpeechSynthesisUtterance|playNarration|Voice transcript/);
  assert.match(page, /The Feed Chooses/);
  assert.match(page, /Rewrite the Rules/);
  assert.match(page, /Sandbox/);
  assert.match(layout, /title:\s*"Trust Lab"/);
  assert.match(css, /scene-ai/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(page + layout + css + packageJson, /_sites-preview|SkeletonPreview|react-loading-skeleton/);
});

test("ships animated game sounds without spoken narration", async () => {
  const audioDirectory = new URL("../public/audio/", import.meta.url);
  const files = await readdir(audioDirectory);
  assert.equal(files.filter((file) => file.startsWith("action-")).length, 0);
  assert.equal(files.filter((file) => file.startsWith("chapter-")).length, 0);
  assert.ok(files.includes("ambient.mp3"));
  assert.ok(files.includes("tone-bright.mp3"));

  const sample = await stat(new URL("tone-bright.mp3", audioDirectory));
  assert.ok(sample.size > 1_000);
});
