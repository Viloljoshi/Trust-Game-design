"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MetricKey =
  | "calibration"
  | "cooperation"
  | "repair"
  | "integrity"
  | "aiReliance"
  | "resilience";

type Metrics = Record<MetricKey, number>;

type Action = {
  id: string;
  label: string;
  short: string;
  line: string;
  result: string;
  lesson: string;
  tone: "soft" | "bright" | "low" | "alert";
  trustShift: number;
  tokens: number;
  deltas: Partial<Metrics>;
};

type Chapter = {
  id: string;
  number: string;
  title: string;
  scale: string;
  concept: string;
  prompt: string;
  characters: string[];
  research: string;
  visual: "exchange" | "mistake" | "group" | "reputation" | "feed" | "ai" | "rules" | "sandbox";
  actions: Action[];
};

type Character = {
  name: string;
  role: string;
  className: string;
  prop: string;
};

const characters: Record<string, Character> = {
  Scout: {
    name: "Scout",
    role: "calibrated reciprocator",
    className: "scout",
    prop: "notebook",
  },
  Patch: {
    name: "Patch",
    role: "repairer",
    className: "patch",
    prop: "gold thread",
  },
  Wall: {
    name: "Wall",
    role: "boundary setter",
    className: "wall",
    prop: "gate",
  },
  Velvet: {
    name: "Velvet",
    role: "strategic charmer",
    className: "velvet",
    prop: "ribbon",
  },
  Echo: {
    name: "Echo",
    role: "conditional joiner",
    className: "echo",
    prop: "mirrors",
  },
  Drift: {
    name: "Drift",
    role: "free rider",
    className: "drift",
    prop: "pockets",
  },
  Ledger: {
    name: "Ledger",
    role: "reputation reader",
    className: "ledger",
    prop: "tabs",
  },
  Mask: {
    name: "Mask",
    role: "reputation hacker",
    className: "mask",
    prop: "two faces",
  },
  Lens: {
    name: "Lens",
    role: "source verifier",
    className: "lens",
    prop: "magnifier",
  },
  Spark: {
    name: "Spark",
    role: "outrage amplifier",
    className: "spark",
    prop: "badges",
  },
  Oracle: {
    name: "Oracle",
    role: "confident AI",
    className: "oracle",
    prop: "halo",
  },
  Compass: {
    name: "Compass",
    role: "calibrated AI",
    className: "compass",
    prop: "ring",
  },
  Architect: {
    name: "Architect",
    role: "institution builder",
    className: "architect",
    prop: "blocks",
  },
};

const chapters: Chapter[] = [
  {
    id: "prologue",
    number: "00",
    title: "Would You Trust Me?",
    scale: "one exchange",
    concept: "Baseline trust under incomplete information.",
    prompt:
      "Scout has one token. You have one token. A token given away becomes two tokens for the other person.",
    characters: ["Scout", "Velvet"],
    research: "Prisoner's dilemma framing, betrayal aversion and baseline prediction.",
    visual: "exchange",
    actions: [
      {
        id: "small-trust",
        label: "Give one token",
        short: "Give",
        line: "Let's start small and see what happens.",
        result: "Scout gives too. Both tokens cross the machine and return doubled.",
        lesson: "A small reversible risk can buy useful evidence.",
        tone: "bright",
        trustShift: 9,
        tokens: 2,
        deltas: { calibration: 5, cooperation: 8, resilience: 2 },
      },
      {
        id: "keep-token",
        label: "Keep your token",
        short: "Keep",
        line: "You protected yourself before you had evidence.",
        result: "Scout still gives. You gain more now, but the line between you thins.",
        lesson: "Protection can prevent loss, and it can also spend a future relationship.",
        tone: "low",
        trustShift: -8,
        tokens: 3,
        deltas: { calibration: -1, cooperation: -7, resilience: -3 },
      },
      {
        id: "ask-first",
        label: "Ask first",
        short: "Ask",
        line: "What would make this feel safe enough to try?",
        result: "Scout suggests a one-token limit and a replay after the reveal.",
        lesson: "Communication can create cooperation when the risk stays bounded.",
        tone: "soft",
        trustShift: 5,
        tokens: 1,
        deltas: { calibration: 6, cooperation: 3, repair: 2 },
      },
    ],
  },
  {
    id: "exchange",
    number: "01",
    title: "The Exchange",
    scale: "repeated relationship",
    concept: "Reciprocity changes when the future is uncertain.",
    prompt:
      "Velvet cooperated twice, then a larger opportunity appeared. Do you expect warmth or opportunism?",
    characters: ["Scout", "Velvet", "Drift"],
    research: "Axelrod and Hamilton, direct reciprocity, time horizons and tournament strategies.",
    visual: "exchange",
    actions: [
      {
        id: "cooperate",
        label: "Cooperate again",
        short: "Cooperate",
        line: "You treat the good history as evidence, not proof.",
        result: "Scout reciprocates. Velvet smiles, then keeps the larger return.",
        lesson: "Past cooperation matters, but temptation changes the evidence you need.",
        tone: "bright",
        trustShift: 6,
        tokens: 2,
        deltas: { calibration: 3, cooperation: 6, resilience: 1 },
      },
      {
        id: "defect",
        label: "Defect on the final round",
        short: "Defect",
        line: "If the ending is known, the last move changes the game.",
        result: "You gain now. Future partners copy the caution they observed.",
        lesson: "Known endings can make cooperation unravel backward.",
        tone: "alert",
        trustShift: -10,
        tokens: 3,
        deltas: { calibration: 2, cooperation: -9, resilience: -5 },
      },
      {
        id: "forgiving-tit",
        label: "Copy, then forgive once",
        short: "Forgive once",
        line: "You answer harm proportionately and leave room for one mistake.",
        result: "One noisy defection does not become a permanent feud.",
        lesson: "Forgiveness is most useful when the world contains errors.",
        tone: "soft",
        trustShift: 8,
        tokens: 2,
        deltas: { calibration: 6, cooperation: 6, repair: 4, resilience: 5 },
      },
    ],
  },
  {
    id: "mistake",
    number: "02",
    title: "One Mistake",
    scale: "relationship repair",
    concept: "Betrayal, error and repair are not the same thing.",
    prompt:
      "Patch missed a support block after three reliable rounds. The bridge cracked, but the cause is hidden.",
    characters: ["Patch", "Wall", "Scout"],
    research: "Noise, communication, apology, compensation and trust repair.",
    visual: "mistake",
    actions: [
      {
        id: "verify",
        label: "Inspect the delivery log",
        short: "Verify",
        line: "Where did the block actually disappear?",
        result: "The log shows a message failure. Patch sent the block to the wrong slot.",
        lesson: "Verification is valuable when attribution is uncertain and the stakes are high.",
        tone: "bright",
        trustShift: 10,
        tokens: -1,
        deltas: { calibration: 9, repair: 8, resilience: 6 },
      },
      {
        id: "retaliate",
        label: "Retaliate immediately",
        short: "Retaliate",
        line: "That looked unfair, so you answer with a cost.",
        result: "Patch loses tokens. The bridge loses another support before the cause is known.",
        lesson: "Punishment without verification can create the harm it was meant to prevent.",
        tone: "alert",
        trustShift: -15,
        tokens: -2,
        deltas: { calibration: -6, cooperation: -6, repair: -8, resilience: -7 },
      },
      {
        id: "boundary",
        label: "Reduce exposure",
        short: "Set boundary",
        line: "I can forgive this and still change the terms.",
        result: "Wall lowers the risk while Patch demonstrates follow-through.",
        lesson: "Forgiveness and future vulnerability can be separate decisions.",
        tone: "soft",
        trustShift: 4,
        tokens: 0,
        deltas: { calibration: 6, repair: 5, resilience: 8 },
      },
    ],
  },
  {
    id: "group",
    number: "03",
    title: "The Shared Pot",
    scale: "public good",
    concept: "Visible norms can build cooperation or collapse it.",
    prompt:
      "Five agents receive ten tokens. Contributed tokens multiply, then return to the whole group.",
    characters: ["Echo", "Drift", "Scout"],
    research: "Conditional cooperation, free riding, costly punishment and fairness context.",
    visual: "group",
    actions: [
      {
        id: "public-contribute",
        label: "Make contributions public",
        short: "Public pot",
        line: "Echo looks around, sees others helping and steps closer.",
        result: "Contribution rises. Drift has fewer places to hide.",
        lesson: "Visibility can support norms, but it needs context about capacity.",
        tone: "bright",
        trustShift: 6,
        tokens: 4,
        deltas: { cooperation: 9, calibration: 4, resilience: 5 },
      },
      {
        id: "punish",
        label: "Punish low contributors",
        short: "Punish",
        line: "Gavel stamps a consequence and pays a cost too.",
        result: "Free riding falls, but one low-capacity member is nearly misclassified.",
        lesson: "Sanctions can protect cooperation when they are accurate and proportional.",
        tone: "alert",
        trustShift: -2,
        tokens: -1,
        deltas: { cooperation: 3, calibration: -1, resilience: -1 },
      },
      {
        id: "appeal",
        label: "Add an appeal step",
        short: "Appeal",
        line: "The evidence card moves before the stamp lands.",
        result: "A capacity difference is revealed. Punishment accuracy improves.",
        lesson: "Due process slows action, but can prevent avoidable retaliation.",
        tone: "soft",
        trustShift: 5,
        tokens: 1,
        deltas: { calibration: 8, cooperation: 5, resilience: 7 },
      },
    ],
  },
  {
    id: "reputation",
    number: "04",
    title: "Everyone Is Watching",
    scale: "marketplace",
    concept: "Ratings are signals, not ground truth.",
    prompt:
      "Two providers have five stars. One has verified transactions. One has a fresh burst from three linked accounts.",
    characters: ["Ledger", "Mask", "Velvet"],
    research: "Indirect reciprocity, fake reviews, observation effects and platform incentives.",
    visual: "reputation",
    actions: [
      {
        id: "trust-stars",
        label: "Trust the highest rating",
        short: "Stars",
        line: "Five stars feels clear until the sample size appears.",
        result: "Mask's duplicate review bubbles light up at the same time.",
        lesson: "Averages need count, recency, verification and source independence.",
        tone: "alert",
        trustShift: -7,
        tokens: -2,
        deltas: { calibration: -5, integrity: -6, resilience: -3 },
      },
      {
        id: "inspect-reviews",
        label: "Inspect review sources",
        short: "Inspect",
        line: "Ledger opens the layers behind the score.",
        result: "Purchased reviews separate from verified transaction history.",
        lesson: "Reputation becomes stronger when the system exposes signal quality.",
        tone: "bright",
        trustShift: 7,
        tokens: 1,
        deltas: { calibration: 8, integrity: 9, resilience: 4 },
      },
      {
        id: "decay-rule",
        label: "Add review decay",
        short: "Decay",
        line: "Recent conduct matters without erasing the whole past.",
        result: "Old reliable accounts recover slowly. Laundered identities lose shine.",
        lesson: "Good systems make abuse detectable and repair possible.",
        tone: "soft",
        trustShift: 5,
        tokens: 0,
        deltas: { integrity: 7, resilience: 7, repair: 2 },
      },
    ],
  },
  {
    id: "feed",
    number: "05",
    title: "The Feed Chooses",
    scale: "information network",
    concept: "Attention incentives can outrun evidence.",
    prompt:
      "A shocking claim is spreading fast. It has emotion, repetition and weak source independence.",
    characters: ["Lens", "Spark", "Echo"],
    research: "False-news diffusion, outrage, homophily, source tracing and platform objectives.",
    visual: "feed",
    actions: [
      {
        id: "share-now",
        label: "Share immediately",
        short: "Share",
        line: "Spark multiplies the card before the fact check arrives.",
        result: "Attention jumps. Accuracy and group trust fall.",
        lesson: "Speed creates reach before correction has a chance to catch up.",
        tone: "alert",
        trustShift: -9,
        tokens: 4,
        deltas: { integrity: -10, calibration: -4, resilience: -5 },
      },
      {
        id: "trace-source",
        label: "Trace the original source",
        short: "Trace",
        line: "Lens separates one loud bubble into its actual sources.",
        result: "Three shares came from the same origin. The claim loses certainty.",
        lesson: "Independent confirmation matters more than repeated exposure.",
        tone: "bright",
        trustShift: 6,
        tokens: -1,
        deltas: { integrity: 10, calibration: 7, resilience: 4 },
      },
      {
        id: "rebalance-feed",
        label: "Rank for accuracy too",
        short: "Re-rank",
        line: "The feed slows the loudest card and surfaces context.",
        result: "Engagement dips, but belief accuracy and diversity rise.",
        lesson: "Platform rules shape what users think is normal.",
        tone: "soft",
        trustShift: 4,
        tokens: 0,
        deltas: { integrity: 7, resilience: 7, cooperation: 2 },
      },
    ],
  },
  {
    id: "ai",
    number: "06",
    title: "The AI Coworker",
    scale: "human and AI team",
    concept: "Confidence is not competence.",
    prompt:
      "Oracle gives a fluent recommendation on a rare case. Compass asks for missing context and shows uncertainty.",
    characters: ["Oracle", "Compass", "Scout"],
    research: "Automation bias, algorithm aversion, task competence and confidence calibration.",
    visual: "ai",
    actions: [
      {
        id: "accept-oracle",
        label: "Accept Oracle",
        short: "Accept",
        line: "The answer is immediate, fluent and very sure.",
        result: "The rare case was outside Oracle's strong region. Confidence stayed large.",
        lesson: "Fluency can hide distribution shift.",
        tone: "alert",
        trustShift: -8,
        tokens: 2,
        deltas: { aiReliance: -8, calibration: -5, resilience: -2 },
      },
      {
        id: "ask-uncertainty",
        label: "Request uncertainty",
        short: "Uncertainty",
        line: "Compass narrows the ring and asks for one missing fact.",
        result: "The decision routes to review only when the case is unfamiliar.",
        lesson: "Useful AI systems know when not to decide alone.",
        tone: "bright",
        trustShift: 8,
        tokens: 1,
        deltas: { aiReliance: 10, calibration: 7, resilience: 5 },
      },
      {
        id: "manual-only",
        label: "Override everything",
        short: "Manual",
        line: "You avoid automation bias, but reject useful routine help.",
        result: "Rare-case quality improves. Routine throughput collapses.",
        lesson: "Underreliance can be a cost too.",
        tone: "low",
        trustShift: 0,
        tokens: -2,
        deltas: { aiReliance: -2, calibration: 2, resilience: -3 },
      },
    ],
  },
  {
    id: "rules",
    number: "07",
    title: "Rewrite the Rules",
    scale: "institution",
    concept: "Better systems change incentives, not just intentions.",
    prompt:
      "A market has review manipulation, a group has free riding and an AI workflow has automation bias.",
    characters: ["Architect", "Ledger", "Compass"],
    research: "Institutional design, monitoring, appeals, privacy, sanctions and exit rights.",
    visual: "rules",
    actions: [
      {
        id: "monitor-more",
        label: "Increase monitoring",
        short: "Monitor",
        line: "Cheating becomes easier to detect. Privacy drops.",
        result: "Abuse falls quickly, but user comfort and exit risk worsen.",
        lesson: "More visibility is powerful, but not free.",
        tone: "low",
        trustShift: 3,
        tokens: -1,
        deltas: { integrity: 5, resilience: 1, calibration: 1 },
      },
      {
        id: "appeals-audits",
        label: "Fund appeals and audits",
        short: "Audit",
        line: "The system samples claims and lets errors be challenged.",
        result: "False punishment drops. Persistent abuse still has a path to removal.",
        lesson: "Trustworthy institutions combine detection with correction.",
        tone: "bright",
        trustShift: 8,
        tokens: 0,
        deltas: { resilience: 10, integrity: 7, repair: 5 },
      },
      {
        id: "second-chance",
        label: "Add repair paths",
        short: "Repair path",
        line: "Harm requires compensation and changed behavior, not just a reset.",
        result: "Recoverable mistakes heal. Repeat abuse becomes easier to identify.",
        lesson: "Forgiveness works best when it is paired with evidence and boundaries.",
        tone: "soft",
        trustShift: 7,
        tokens: 1,
        deltas: { repair: 10, resilience: 8, cooperation: 4 },
      },
    ],
  },
  {
    id: "sandbox",
    number: "LAB",
    title: "Sandbox",
    scale: "open experiment",
    concept: "Change the world and rerun the trust problem.",
    prompt:
      "Tune noise, future interaction, reputation quality and AI calibration. The system responds immediately.",
    characters: ["Scout", "Echo", "Compass"],
    research: "Seeded counterfactuals, sensitivity testing and simulation literacy.",
    visual: "sandbox",
    actions: [
      {
        id: "rerun",
        label: "Rerun simulation",
        short: "Rerun",
        line: "The same rules run again with your current settings.",
        result: "The chart redraws. Compare the system, not just one lucky outcome.",
        lesson: "Simulation helps you see patterns that one anecdote can hide.",
        tone: "bright",
        trustShift: 2,
        tokens: 0,
        deltas: { calibration: 4, resilience: 4 },
      },
      {
        id: "shock",
        label: "Add a mistake shock",
        short: "Shock",
        line: "A noisy event hits the system.",
        result: "Forgiving rules bend. Brittle rules fracture.",
        lesson: "Resilience is what remains after a plausible mistake.",
        tone: "alert",
        trustShift: -6,
        tokens: -1,
        deltas: { calibration: 3, resilience: -2, repair: 4 },
      },
      {
        id: "compare",
        label: "Compare rules",
        short: "Compare",
        line: "Two worlds run side by side.",
        result: "The stricter world prevents more harm. The repair world preserves more cooperation.",
        lesson: "Calibration means choosing the right trade-off for the stakes.",
        tone: "soft",
        trustShift: 3,
        tokens: 0,
        deltas: { calibration: 7, resilience: 6, integrity: 3 },
      },
    ],
  },
];

const initialMetrics: Metrics = {
  calibration: 58,
  cooperation: 52,
  repair: 45,
  integrity: 49,
  aiReliance: 50,
  resilience: 54,
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

function updateMetrics(metrics: Metrics, deltas: Partial<Metrics>): Metrics {
  return {
    calibration: clamp(metrics.calibration + (deltas.calibration ?? 0)),
    cooperation: clamp(metrics.cooperation + (deltas.cooperation ?? 0)),
    repair: clamp(metrics.repair + (deltas.repair ?? 0)),
    integrity: clamp(metrics.integrity + (deltas.integrity ?? 0)),
    aiReliance: clamp(metrics.aiReliance + (deltas.aiReliance ?? 0)),
    resilience: clamp(metrics.resilience + (deltas.resilience ?? 0)),
  };
}

function metricLabel(key: MetricKey) {
  const labels: Record<MetricKey, string> = {
    calibration: "Trust calibration",
    cooperation: "Cooperation",
    repair: "Repair",
    integrity: "Information integrity",
    aiReliance: "AI reliance",
    resilience: "System resilience",
  };

  return labels[key];
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [trust, setTrust] = useState(46);
  const [tokens, setTokens] = useState(6);
  const [round, setRound] = useState(1);
  const [lastAction, setLastAction] = useState<Action>(chapters[0].actions[0]);
  const [effectsOn, setEffectsOn] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [soundState, setSoundState] = useState<"off" | "ready" | "playing">("off");
  const [motionOff, setMotionOff] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [sandbox, setSandbox] = useState({
    future: 68,
    error: 16,
    reputation: 58,
    ai: 62,
  });
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);

  const chapter = chapters[activeIndex];
  const activeCharacters = chapter.characters.map((name) => characters[name]);

  const sandboxScores = useMemo(() => {
    const cooperation = clamp(
      28 + sandbox.future * 0.42 + sandbox.reputation * 0.16 - sandbox.error * 0.28,
    );
    const misinformation = clamp(82 - sandbox.reputation * 0.45 + sandbox.error * 0.34);
    const aiAccuracy = clamp(18 + sandbox.ai * 0.78 - sandbox.error * 0.18);
    const resilience = clamp(
      20 + sandbox.future * 0.2 + sandbox.reputation * 0.24 + sandbox.ai * 0.18 - sandbox.error * 0.18,
    );

    return { cooperation, misinformation, aiAccuracy, resilience };
  }, [sandbox]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", motionOff);
  }, [motionOff]);

  useEffect(() => {
    return () => {
      musicRef.current?.pause();
      sfxRef.current?.pause();
    };
  }, []);

  function playTone(tone: Action["tone"], force = false) {
    if ((!audioUnlocked || !effectsOn) && !force) return;

    sfxRef.current?.pause();
    const audio = new Audio(`/audio/tone-${tone}.mp3`);
    audio.volume = 0.82;
    audio.onplay = () => setSoundState("playing");
    audio.onended = () => setSoundState("ready");
    audio.onerror = () => setSoundState("ready");
    sfxRef.current = audio;
    void audio.play().catch(() => setSoundState("ready"));
  }

  async function startAmbient() {
    if (musicRef.current) {
      await musicRef.current.play();
      setAmbientOn(true);
      return;
    }

    const audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.28;
    musicRef.current = audio;
    await audio.play();
    setAmbientOn(true);
  }

  function stopAmbient() {
    musicRef.current?.pause();
    setAmbientOn(false);
  }

  async function toggleAmbient() {
    if (!audioUnlocked) {
      await activateAudio(true);
      return;
    }

    if (ambientOn) {
      stopAmbient();
      return;
    }

    try {
      await startAmbient();
      playTone("soft");
    } catch {
      setAmbientOn(false);
    }
  }

  async function activateAudio(includeAmbient = true) {
    setAudioUnlocked(true);
    setEffectsOn(true);
    setSoundState("ready");
    playTone("bright", true);
    if (includeAmbient) {
      void startAmbient().catch(() => setAmbientOn(false));
    }
  }

  function toggleEffects() {
    if (!effectsOn) {
      void activateAudio(false);
      return;
    }

    sfxRef.current?.pause();
    setEffectsOn(false);
    setSoundState("off");
  }

  function chooseChapter(index: number) {
    const next = chapters[index];
    setActiveIndex(index);
    setLastAction(next.actions[0]);
    setPulse((value) => value + 1);
    playTone("soft");
  }

  function applyAction(action: Action) {
    setLastAction(action);
    setTrust((value) => clamp(value + action.trustShift));
    setTokens((value) => Math.max(0, value + action.tokens));
    setMetrics((value) => updateMetrics(value, action.deltas));
    setRound((value) => value + 1);
    setPulse((value) => value + 1);
    playTone(action.tone);
  }

  function resetLab() {
    setActiveIndex(0);
    setMetrics(initialMetrics);
    setTrust(46);
    setTokens(6);
    setRound(1);
    setLastAction(chapters[0].actions[0]);
    setSandbox({ future: 68, error: 16, reputation: 58, ai: 62 });
    setPulse((value) => value + 1);
    playTone("bright");
  }

  return (
    <main className={`trust-lab ${motionOff ? "motion-off" : ""}`}>
      <header className="lab-header" aria-label="Trust Lab controls">
        <div>
          <p className="eyebrow">Research-backed interactive game</p>
          <h1>TRUST LAB</h1>
        </div>

        <div className="header-actions">
          <button
            className={effectsOn ? "icon-button active" : "icon-button"}
            type="button"
            aria-pressed={effectsOn}
            onClick={toggleEffects}
          >
            {effectsOn ? "FX on" : "FX off"}
          </button>
          <button
            className={ambientOn ? "icon-button active" : "icon-button"}
            type="button"
            aria-pressed={ambientOn}
            onClick={toggleAmbient}
          >
            {ambientOn ? "Ambient on" : "Ambient off"}
          </button>
          <button
            className={motionOff ? "icon-button active" : "icon-button"}
            type="button"
            aria-pressed={motionOff}
            onClick={() => setMotionOff((value) => !value)}
          >
            Still
          </button>
          <button className="icon-button" type="button" onClick={resetLab}>
            Reset
          </button>
        </div>
      </header>

      <section className={audioUnlocked ? "audio-console unlocked" : "audio-console"} aria-live="polite">
        <button
          className="audio-start"
          type="button"
          onClick={() => void activateAudio(true)}
        >
          <span className="audio-icon" aria-hidden="true">{audioUnlocked ? "♪" : "▶"}</span>
          <span>
            <strong>{audioUnlocked ? "Game sounds ready" : "Start game audio"}</strong>
            <small>
              {audioUnlocked
                ? ambientOn
                  ? "Animated effects and soft ambience are on"
                  : "Animated effects are on"
                : "Playful feedback sounds for every move"}
            </small>
          </span>
        </button>
        <div className={soundState === "playing" ? "sound-wave playing" : "sound-wave"} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => <i key={index} />)}
        </div>
        <span className="audio-status">
          {soundState === "playing" ? "Boop!" : audioUnlocked ? "Audio ready" : "Waiting for your tap"}
        </span>
      </section>

      <nav className="chapter-rail" aria-label="Trust Lab chapters">
        {chapters.map((item, index) => (
          <button
            key={item.id}
            className={index === activeIndex ? "chapter-dot active" : "chapter-dot"}
            type="button"
            aria-current={index === activeIndex ? "step" : undefined}
            onClick={() => chooseChapter(index)}
          >
            <span>{item.number}</span>
            {item.title}
          </button>
        ))}
      </nav>

      <section className="game-shell" aria-label={`${chapter.title} interactive scene`}>
        <aside className="story-panel">
          <div className="dot" aria-hidden="true">
            <span />
          </div>
          <p className="chapter-number">{chapter.number}</p>
          <h2>{chapter.title}</h2>
          <p className="scale">{chapter.scale}</p>
          <p className="prompt">{chapter.prompt}</p>
          <p className="caption">
            <strong>Dot:</strong> {lastAction.line}
          </p>
        </aside>

        <section className={`lab-canvas ${chapter.visual}`} data-pulse={pulse}>
          <div className="canvas-topline">
            <span>{chapter.concept}</span>
            <span>Round {round}</span>
          </div>

          <div className="relationship-wrap" aria-hidden="true">
            <div className="relationship-line" style={{ width: `${clamp(trust, 18, 92)}%` }} />
            <div className={trust > 58 ? "relationship-label strong" : "relationship-label"}>
              evidence {trust}%
            </div>
          </div>

          <div className="agent-row">
            {activeCharacters.map((agent, index) => (
              <CharacterFigure key={agent.name} agent={agent} index={index} />
            ))}
          </div>

          <SceneVisual visual={chapter.visual} pulse={pulse} sandboxScores={sandboxScores} />
        </section>

        <aside className="decision-panel">
          <div className="decision-heading">
            <p className="eyebrow">Choose</p>
            <span>{tokens} tokens</span>
          </div>

          <div className="action-grid">
            {chapter.actions.map((action) => (
              <button
                key={action.id}
                className={`action-button ${lastAction.id === action.id ? "selected" : ""}`}
                type="button"
                onClick={() => applyAction(action)}
              >
                <span>{action.short}</span>
                {action.label}
              </button>
            ))}
          </div>

          {chapter.visual === "sandbox" && (
            <div className="sandbox-controls" aria-label="Sandbox variables">
              <RangeControl
                label="Future interaction"
                value={sandbox.future}
                onChange={(future) => setSandbox((value) => ({ ...value, future }))}
              />
              <RangeControl
                label="Mistake rate"
                value={sandbox.error}
                onChange={(error) => setSandbox((value) => ({ ...value, error }))}
              />
              <RangeControl
                label="Reputation quality"
                value={sandbox.reputation}
                onChange={(reputation) => setSandbox((value) => ({ ...value, reputation }))}
              />
              <RangeControl
                label="AI calibration"
                value={sandbox.ai}
                onChange={(ai) => setSandbox((value) => ({ ...value, ai }))}
              />
            </div>
          )}

          <div className="outcome" aria-live="polite">
            <p>{lastAction.result}</p>
            <span>{lastAction.lesson}</span>
          </div>

        </aside>
      </section>

      <section className="metrics-band" aria-label="Trust Lab metrics">
        {(Object.keys(metrics) as MetricKey[]).map((key) => (
          <div key={key} className="metric">
            <div>
              <span>{metricLabel(key)}</span>
              <strong>{metrics[key]}</strong>
            </div>
            <div className="metric-track">
              <span style={{ width: `${metrics[key]}%` }} />
            </div>
          </div>
        ))}
      </section>

      <section className="research-strip">
        <div>
          <p className="eyebrow">Research behind this scene</p>
          <p>{chapter.research}</p>
        </div>
        <div>
          <p className="eyebrow">Current calibration note</p>
          <p>
            You are balancing prevented exploitation against missed cooperation. The game reports
            trade-offs, not personality labels.
          </p>
        </div>
      </section>

    </main>
  );
}

function CharacterFigure({ agent, index }: { agent: Character; index: number }) {
  return (
    <figure className={`agent ${agent.className}`} style={{ animationDelay: `${index * 120}ms` }}>
      <div className="body">
        <span className="eye left" />
        <span className="eye right" />
        <span className="mouth" />
        <span className="prop">{agent.prop}</span>
      </div>
      <figcaption>
        <strong>{agent.name}</strong>
        <span>{agent.role}</span>
      </figcaption>
    </figure>
  );
}

function SceneVisual({
  visual,
  pulse,
  sandboxScores,
}: {
  visual: Chapter["visual"];
  pulse: number;
  sandboxScores: {
    cooperation: number;
    misinformation: number;
    aiAccuracy: number;
    resilience: number;
  };
}) {
  if (visual === "mistake") {
    return (
      <div className="scene scene-mistake" key={pulse}>
        <div className="bridge">
          <span />
          <span />
          <span className="cracked" />
          <span />
        </div>
        <div className="gold-thread" />
      </div>
    );
  }

  if (visual === "group") {
    return (
      <div className="scene scene-group" key={pulse}>
        {[72, 56, 42, 66, 31].map((height, index) => (
          <div key={index} className="contribution">
            <span style={{ height: `${height}%` }} />
          </div>
        ))}
        <div className="shared-pot">shared pot</div>
      </div>
    );
  }

  if (visual === "reputation") {
    return (
      <div className="scene scene-reputation" key={pulse}>
        <div className="rating-stack">
          <span>5.0 verified 128</span>
          <span>4.9 recent 42</span>
          <span>5.0 linked 3</span>
        </div>
        <div className="review-bubbles">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (visual === "feed") {
    return (
      <div className="scene scene-feed" key={pulse}>
        <div className="feed-card">claim</div>
        <div className="network">
          {Array.from({ length: 13 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (visual === "ai") {
    return (
      <div className="scene scene-ai" key={pulse}>
        <div className="confidence-ring oracle-ring">
          <span>94%</span>
        </div>
        <div className="confidence-ring compass-ring">
          <span>62%</span>
        </div>
        <div className="case-file">rare case</div>
      </div>
    );
  }

  if (visual === "rules") {
    return (
      <div className="scene scene-rules" key={pulse}>
        {["appeal", "audit", "privacy", "exit", "repair"].map((rule) => (
          <span key={rule}>{rule}</span>
        ))}
      </div>
    );
  }

  if (visual === "sandbox") {
    return (
      <div className="scene scene-sandbox" key={pulse}>
        <ScoreBar label="cooperation" value={sandboxScores.cooperation} />
        <ScoreBar label="misinfo reach" value={sandboxScores.misinformation} inverse />
        <ScoreBar label="AI accuracy" value={sandboxScores.aiAccuracy} />
        <ScoreBar label="resilience" value={sandboxScores.resilience} />
      </div>
    );
  }

  return (
    <div className="scene scene-exchange" key={pulse}>
      <div className="machine">
        <span>2x</span>
      </div>
      <div className="token token-a" />
      <div className="token token-b" />
      <div className="token token-c" />
    </div>
  );
}

function RangeControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-control">
      <span>
        {label}
        <strong>{value}</strong>
      </span>
      <input
        min="0"
        max="100"
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ScoreBar({ label, value, inverse = false }: { label: string; value: number; inverse?: boolean }) {
  return (
    <div className={inverse ? "score-bar inverse" : "score-bar"}>
      <span>{label}</span>
      <div>
        <i style={{ width: `${value}%` }} />
      </div>
      <strong>{Math.round(value)}</strong>
    </div>
  );
}
