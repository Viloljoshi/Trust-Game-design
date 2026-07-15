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
  assert.match(html, /Trust Lab/i);
  assert.match(html, /Learn how trust works by making choices/i);
  assert.match(html, /One short line shows what is happening/i);
  assert.match(html, /Tap a move/i);
  assert.match(html, /Score the round, then see what happened to trust/i);
  assert.match(html, /Start lesson 1/i);
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

  assert.match(page, /Start lesson 1/);
  assert.match(page, /Lesson \{activeIndex \+ 1\} of \{chapters\.length\}/);
  assert.match(page, /Round \{activeIndex \+ 1\}/);
  assert.match(page, /See your learning progress/);
  assert.match(page, /Research sources/);
  assert.match(page, /Read the science behind this lesson/);
  assert.match(page, /Read the paper/);
  assert.match(page, /Trust, Reciprocity, and Social History/);
  assert.match(page, /The Spread of True and False News Online/);
  assert.match(page, /Trust in Automation: Designing for Appropriate Reliance/);
  assert.match(page, /target="_blank" rel="noreferrer"/);
  assert.match(page, /Next lesson/);
  assert.match(page, /className="move-picker"/);
  assert.match(page, /strategyMoves\.map/);
  assert.doesNotMatch(page, /chapter\.actions\.map/);
  assert.match(page, /label: "Share"/);
  assert.match(page, /label: "Check first"/);
  assert.match(page, /label: "Ask uncertainty"/);
  assert.match(page, /label: "Build appeals"/);
  assert.match(page, /Score: You \$\{youScore\}, Characters \$\{characterScore\}/);
  assert.match(page, /\{youScore\} \{pointWord\(youScore\)\}/);
  assert.match(page, /This round: \+\$\{roundScore\.you\} vs \+\$\{roundScore\.characters\}/);
  assert.match(page, /round-point-gain/);
  assert.match(page, /mood-\$\{playerMood\}/);
  assert.match(page, /mood-\$\{characterMood\}/);
  assert.match(page, /className="score-face"/);
  assert.match(page, /className="tear left"/);
  assert.match(page, /points-stage/);
  assert.doesNotMatch(page, /\{tokens\} tokens/);
  assert.doesNotMatch(page, /className="token token-/);
  assert.match(page, /You win/);
  assert.match(page, /Characters win/);
  assert.match(page, /Trust \{lastAction\.trustShift >= 0 \? "gained" : "lost"\}/);
  assert.match(page, /What happened/);
  assert.match(page, /Remember/);
  assert.match(page, /role: "checks the source"/);
  assert.match(page, /Check what happened before blaming someone/);
  assert.match(page, /function scoreMove\(action: Action\)/);
  assert.match(page, /const AUTO_ADVANCE_MS = 5_000/);
  assert.match(page, /window\.setTimeout\([\s\S]*chooseChapter\(activeIndex \+ 1\)/);
  assert.match(page, /Nine rounds complete/);
  assert.match(page, /Play all 9 again/);
  assert.match(page, /openFinalReport/);
  assert.match(page, /tone-\$\{tone\}\.mp3/);
  assert.doesNotMatch(page, /speechSynthesis|SpeechSynthesisUtterance|playNarration|Voice transcript/);
  assert.match(page, /The Feed Chooses/);
  assert.match(page, /Rewrite the Rules/);
  assert.match(page, /Sandbox/);
  assert.match(layout, /title:\s*"Trust Lab"/);
  assert.match(css, /scene-ai/);
  assert.match(css, /characterVictory/);
  assert.match(css, /characterDefeat/);
  assert.match(css, /tearFall/);
  assert.match(css, /scoreFaceWin/);
  assert.match(css, /pointCardWin/);
  assert.match(css, /trustBreak/);
  assert.match(css, /source-entry/);
  assert.match(css, /source-cta/);
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
