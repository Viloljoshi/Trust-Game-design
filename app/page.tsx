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

type RoundScore = {
  you: number;
  characters: number;
  verdict: "win" | "draw" | "loss";
};

const characters: Record<string, Character> = {
  Scout: {
    name: "Scout",
    role: "starts small",
    className: "scout",
    prop: "notebook",
  },
  Patch: {
    name: "Patch",
    role: "fixes mistakes",
    className: "patch",
    prop: "gold thread",
  },
  Wall: {
    name: "Wall",
    role: "sets limits",
    className: "wall",
    prop: "gate",
  },
  Velvet: {
    name: "Velvet",
    role: "chases bigger rewards",
    className: "velvet",
    prop: "ribbon",
  },
  Echo: {
    name: "Echo",
    role: "follows the group",
    className: "echo",
    prop: "mirrors",
  },
  Drift: {
    name: "Drift",
    role: "takes without giving",
    className: "drift",
    prop: "pockets",
  },
  Ledger: {
    name: "Ledger",
    role: "checks the record",
    className: "ledger",
    prop: "tabs",
  },
  Mask: {
    name: "Mask",
    role: "fakes a good image",
    className: "mask",
    prop: "two faces",
  },
  Lens: {
    name: "Lens",
    role: "checks the source",
    className: "lens",
    prop: "magnifier",
  },
  Spark: {
    name: "Spark",
    role: "spreads fast claims",
    className: "spark",
    prop: "badges",
  },
  Oracle: {
    name: "Oracle",
    role: "sounds very sure",
    className: "oracle",
    prop: "halo",
  },
  Compass: {
    name: "Compass",
    role: "shows uncertainty",
    className: "compass",
    prop: "ring",
  },
  Architect: {
    name: "Architect",
    role: "designs fair rules",
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
    prompt: "Give Scout a token and it becomes two.",
    characters: ["Scout", "Velvet"],
    research: "Prisoner's dilemma framing, betrayal aversion and baseline prediction.",
    visual: "exchange",
    actions: [
      {
        id: "small-trust",
        label: "Give one token",
        short: "Give",
        line: "Let's start small and see what happens.",
        result: "Scout gives one too. Both of you get two tokens.",
        lesson: "Start with a small risk. It gives you useful evidence.",
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
        result: "Scout gives, but you keep yours. You score more now and trust drops.",
        lesson: "A quick win can make future cooperation harder.",
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
        result: "Scout agrees to a one-token test before taking a bigger risk.",
        lesson: "Clear limits make a first step feel safer.",
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
    prompt: "Velvet helped twice. Now a bigger reward appears.",
    characters: ["Scout", "Velvet", "Drift"],
    research: "Axelrod and Hamilton, direct reciprocity, time horizons and tournament strategies.",
    visual: "exchange",
    actions: [
      {
        id: "cooperate",
        label: "Cooperate again",
        short: "Cooperate",
        line: "You treat the good history as evidence, not proof.",
        result: "Scout returns your help. Velvet keeps the bigger reward.",
        lesson: "Good history helps, but a bigger prize can change behavior.",
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
        result: "You take the last reward. Future partners become less willing to help.",
        lesson: "A last-round win can damage future trust.",
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
        result: "One mistaken move is forgiven, so cooperation continues.",
        lesson: "Forgive one likely mistake before ending a good relationship.",
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
    prompt: "Patch made one mistake after three good rounds.",
    characters: ["Patch", "Wall", "Scout"],
    research: "Noise, communication, apology, compensation and trust repair.",
    visual: "mistake",
    actions: [
      {
        id: "verify",
        label: "Inspect the delivery log",
        short: "Verify",
        line: "Where did the block actually disappear?",
        result: "The log shows an accident, not a betrayal.",
        lesson: "Check what happened before blaming someone.",
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
        result: "You punish Patch before checking. The bridge gets worse.",
        lesson: "Fast punishment can turn one mistake into a bigger problem.",
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
        result: "You lower the risk while Patch proves they can be reliable again.",
        lesson: "You can forgive and still set a safer limit.",
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
    prompt: "Everyone can add tokens to one shared pot.",
    characters: ["Echo", "Drift", "Scout"],
    research: "Conditional cooperation, free riding, costly punishment and fairness context.",
    visual: "group",
    actions: [
      {
        id: "public-contribute",
        label: "Make contributions public",
        short: "Public pot",
        line: "Echo looks around, sees others helping and steps closer.",
        result: "More people add tokens when contributions are visible.",
        lesson: "Seeing others help can make cooperation easier.",
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
        result: "Free riding falls, but someone with fewer tokens is punished unfairly.",
        lesson: "Punishment only works when it is fair and accurate.",
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
        result: "The appeal reveals why one person gave less.",
        lesson: "Let people explain before deciding they acted badly.",
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
    prompt: "Two providers have five stars. One may be faking it.",
    characters: ["Ledger", "Mask", "Velvet"],
    research: "Indirect reciprocity, fake reviews, observation effects and platform incentives.",
    visual: "reputation",
    actions: [
      {
        id: "trust-stars",
        label: "Trust the highest rating",
        short: "Stars",
        line: "Five stars feels clear until the sample size appears.",
        result: "The five-star score came from copied reviews.",
        lesson: "A high rating is not enough. Check who made the reviews.",
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
        result: "Real purchases separate from paid reviews.",
        lesson: "Trust ratings more when you can see where they came from.",
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
        result: "Recent behavior counts more, so fake accounts lose their advantage.",
        lesson: "Good rating systems reward change and expose repeated abuse.",
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
    prompt: "A shocking claim is spreading fast.",
    characters: ["Lens", "Spark", "Echo"],
    research: "False-news diffusion, outrage, homophily, source tracing and platform objectives.",
    visual: "feed",
    actions: [
      {
        id: "share-now",
        label: "Share immediately",
        short: "Share",
        line: "Spark multiplies the card before the fact check arrives.",
        result: "The claim spreads quickly, but it is wrong.",
        lesson: "Pause before sharing. Corrections move slower than rumors.",
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
        result: "Many shares came from the same source.",
        lesson: "Repetition is not proof. Look for independent sources.",
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
        result: "Fewer shocking posts spread, and more accurate posts appear.",
        lesson: "A feed's rules shape what people see and believe.",
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
    prompt: "One AI sounds certain. The other admits uncertainty.",
    characters: ["Oracle", "Compass", "Scout"],
    research: "Automation bias, algorithm aversion, task competence and confidence calibration.",
    visual: "ai",
    actions: [
      {
        id: "accept-oracle",
        label: "Accept Oracle",
        short: "Accept",
        line: "The answer is immediate, fluent and very sure.",
        result: "Oracle sounds sure, but misses this unusual case.",
        lesson: "Confidence does not always mean the answer is correct.",
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
        result: "Compass asks for one missing fact and sends the hard case to a person.",
        lesson: "A useful AI says when it needs help.",
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
        result: "You avoid the AI error, but simple work becomes much slower.",
        lesson: "Do not trust AI blindly or reject it completely.",
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
    prompt: "The system is being gamed. You can change one rule.",
    characters: ["Architect", "Ledger", "Compass"],
    research: "Institutional design, monitoring, appeals, privacy, sanctions and exit rights.",
    visual: "rules",
    actions: [
      {
        id: "monitor-more",
        label: "Increase monitoring",
        short: "Monitor",
        line: "Cheating becomes easier to detect. Privacy drops.",
        result: "Cheating drops, but everyone loses some privacy.",
        lesson: "More monitoring can help and also create a new cost.",
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
        result: "Fewer innocent users are punished, and repeat cheaters are removed.",
        lesson: "Fair systems check decisions and allow appeals.",
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
        result: "People can fix honest mistakes, while repeat abuse stays visible.",
        lesson: "Second chances work best with proof of changed behavior.",
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
    prompt: "Change the settings, then run the world again.",
    characters: ["Scout", "Echo", "Compass"],
    research: "Seeded counterfactuals, sensitivity testing and simulation literacy.",
    visual: "sandbox",
    actions: [
      {
        id: "rerun",
        label: "Rerun simulation",
        short: "Rerun",
        line: "The same rules run again with your current settings.",
        result: "New bars show how your settings change the same situation.",
        lesson: "Run a simulation more than once to see patterns, not luck.",
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
        result: "A mistake hits. Flexible rules recover; strict rules break.",
        lesson: "A strong system can recover from normal mistakes.",
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
        result: "Strict rules stop more harm. Repair rules keep more cooperation.",
        lesson: "The best rule depends on which risk matters most.",
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

const AUTO_ADVANCE_MS = 5_000;

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

function scoreMove(action: Action): RoundScore {
  const you = clamp(2 + action.tokens, 0, 6);
  const characters = clamp(2 + Math.round(action.trustShift / 5), 0, 6);
  const verdict = you === characters ? "draw" : you > characters ? "win" : "loss";

  return { you, characters, verdict };
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
  const [started, setStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [trust, setTrust] = useState(46);
  const [tokens, setTokens] = useState(6);
  const [youScore, setYouScore] = useState(0);
  const [characterScore, setCharacterScore] = useState(0);
  const [roundScore, setRoundScore] = useState<RoundScore | null>(null);
  const [round, setRound] = useState(1);
  const [lastAction, setLastAction] = useState<Action>(chapters[0].actions[0]);
  const [hasChosen, setHasChosen] = useState(false);
  const [effectsOn, setEffectsOn] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [motionOff, setMotionOff] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [sandbox, setSandbox] = useState({
    future: 68,
    error: 16,
    reputation: 58,
    ai: 62,
  });
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const autoAdvanceRef = useRef<number | null>(null);

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
      sfxRef.current?.pause();
      if (autoAdvanceRef.current !== null) {
        window.clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  function clearAutoAdvance() {
    if (autoAdvanceRef.current === null) return;

    window.clearTimeout(autoAdvanceRef.current);
    autoAdvanceRef.current = null;
  }

  function playTone(tone: Action["tone"], force = false) {
    if ((!audioUnlocked || !effectsOn) && !force) return;

    sfxRef.current?.pause();
    const audio = new Audio(`/audio/tone-${tone}.mp3`);
    audio.volume = 0.82;
    sfxRef.current = audio;
    void audio.play().catch(() => undefined);
  }

  function activateAudio() {
    setAudioUnlocked(true);
    setEffectsOn(true);
    playTone("bright", true);
  }

  function toggleEffects() {
    if (!effectsOn) {
      activateAudio();
      return;
    }

    sfxRef.current?.pause();
    setEffectsOn(false);
  }

  function chooseChapter(index: number) {
    clearAutoAdvance();
    const next = chapters[index];
    setActiveIndex(index);
    setLastAction(next.actions[0]);
    setHasChosen(false);
    setRoundScore(null);
    setPulse((value) => value + 1);
    playTone("soft");
  }

  function applyAction(action: Action) {
    clearAutoAdvance();
    const score = scoreMove(action);
    setLastAction(action);
    setHasChosen(true);
    setRoundScore(score);
    setYouScore((value) => value + score.you);
    setCharacterScore((value) => value + score.characters);
    setTrust((value) => clamp(value + action.trustShift));
    setTokens((value) => Math.max(0, value + action.tokens));
    setMetrics((value) => updateMetrics(value, action.deltas));
    setRound((value) => value + 1);
    setPulse((value) => value + 1);
    playTone(action.tone);

    if (activeIndex < chapters.length - 1) {
      autoAdvanceRef.current = window.setTimeout(
        () => chooseChapter(activeIndex + 1),
        AUTO_ADVANCE_MS,
      );
    }
  }

  function resetLab() {
    clearAutoAdvance();
    setActiveIndex(0);
    setMetrics(initialMetrics);
    setTrust(46);
    setTokens(6);
    setYouScore(0);
    setCharacterScore(0);
    setRoundScore(null);
    setRound(1);
    setLastAction(chapters[0].actions[0]);
    setHasChosen(false);
    setSandbox({ future: 68, error: 16, reputation: 58, ai: 62 });
    setPulse((value) => value + 1);
    playTone("bright");
  }

  function startGame() {
    setStarted(true);
    activateAudio();
  }

  function goToNextLesson() {
    if (activeIndex === chapters.length - 1) {
      resetLab();
      return;
    }

    chooseChapter(activeIndex + 1);
  }

  if (!started) {
    return (
      <main className="welcome-page">
        <section className="welcome" aria-labelledby="welcome-title">
          <div className="welcome-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <p className="eyebrow">Trust Lab</p>
          <h1 id="welcome-title">Learn how trust works by making choices.</h1>
          <p className="welcome-copy">
            Play nine short situations about people, groups, platforms and AI. Each takes about a
            minute.
          </p>

          <div className="welcome-steps" aria-label="How to play">
            <article>
              <span>1</span>
              <div>
                <strong>See the setup</strong>
                <p>One short line shows what is happening.</p>
              </div>
            </article>
            <article>
              <span>2</span>
              <div>
                <strong>Tap a move</strong>
                <p>Choose quickly. No long question.</p>
              </div>
            </article>
            <article>
              <span>3</span>
              <div>
                <strong>Watch the result</strong>
                <p>Score the round, then see what happened to trust.</p>
              </div>
            </article>
          </div>

          <button className="welcome-start" type="button" onClick={startGame}>
            Start lesson 1
            <span aria-hidden="true">→</span>
          </button>
          <p className="welcome-note">There are no personality scores and no perfect answers.</p>
        </section>
      </main>
    );
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
            {effectsOn ? "Sound on" : "Sound off"}
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

      <nav className="chapter-guide" aria-label="Lesson navigation">
        <button
          className="guide-arrow"
          type="button"
          aria-label="Previous lesson"
          disabled={activeIndex === 0}
          onClick={() => chooseChapter(activeIndex - 1)}
        >
          ←
        </button>
        <div className="guide-progress">
          <div>
            <span>Lesson {activeIndex + 1} of {chapters.length}</span>
            <strong>{chapter.title}</strong>
          </div>
          <div className="guide-track" aria-hidden="true">
            <span style={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }} />
          </div>
        </div>
        <button
          className="guide-arrow"
          type="button"
          aria-label="Next lesson"
          disabled={activeIndex === chapters.length - 1}
          onClick={() => chooseChapter(activeIndex + 1)}
        >
          →
        </button>
      </nav>

      <section className="game-shell" aria-label={`${chapter.title} interactive scene`}>
        <aside className="story-panel">
          <div className="dot" aria-hidden="true">
            <span />
          </div>
          <p className="chapter-number">Situation</p>
          <h2>{chapter.title}</h2>
          <p className="prompt">{chapter.prompt}</p>

          <div className="move-picker">
            <div className="move-heading">
              <strong>Your move</strong>
              <span>{tokens} tokens</span>
            </div>
            <div className="action-grid">
              {chapter.actions.map((action) => (
                <button
                  key={action.id}
                  className={`action-button ${hasChosen && lastAction.id === action.id ? "selected" : ""}`}
                  type="button"
                  aria-label={action.label}
                  disabled={hasChosen}
                  onClick={() => applyAction(action)}
                >
                  {action.short}
                </button>
              ))}
            </div>
          </div>

          {chapter.visual === "sandbox" && (
            <div className="sandbox-controls" aria-label="Sandbox variables">
              <RangeControl label="Future" value={sandbox.future} onChange={(future) => setSandbox((value) => ({ ...value, future }))} />
              <RangeControl label="Mistakes" value={sandbox.error} onChange={(error) => setSandbox((value) => ({ ...value, error }))} />
              <RangeControl label="Reputation" value={sandbox.reputation} onChange={(reputation) => setSandbox((value) => ({ ...value, reputation }))} />
              <RangeControl label="AI" value={sandbox.ai} onChange={(ai) => setSandbox((value) => ({ ...value, ai }))} />
            </div>
          )}
        </aside>

        <section className={`lab-canvas ${chapter.visual}`} data-pulse={pulse}>
          <div className="canvas-topline">
            <span>Round {round}</span>
            <span>{chapter.scale}</span>
          </div>

          <div
            className="scoreboard"
            aria-label={`Score: You ${youScore}, Characters ${characterScore}`}
            aria-live="polite"
          >
            <div className="score-side you-score"><span>You</span><strong>{youScore}</strong></div>
            <div className={`round-verdict ${roundScore?.verdict ?? "waiting"}`}>
              <strong>
                {!roundScore
                  ? "Pick a move"
                  : roundScore.verdict === "win"
                    ? "You win"
                    : roundScore.verdict === "loss"
                      ? "Characters win"
                      : "Draw"}
              </strong>
              <span>
                {roundScore
                  ? `+${roundScore.you} : +${roundScore.characters}`
                  : "this round"}
              </span>
            </div>
            <div className="score-side character-score"><span>Characters</span><strong>{characterScore}</strong></div>
          </div>

          <div className="relationship-wrap" aria-hidden="true">
            <div className="relationship-line" style={{ width: `${clamp(trust, 18, 92)}%` }} />
            <div className={trust > 58 ? "relationship-label strong" : "relationship-label"}>
              trust {trust}%
            </div>
          </div>

          <div className="agent-row">
            {activeCharacters.map((agent, index) => (
              <CharacterFigure key={agent.name} agent={agent} index={index} />
            ))}
          </div>

          <SceneVisual visual={chapter.visual} pulse={pulse} sandboxScores={sandboxScores} />
        </section>

        {hasChosen && roundScore && (
          <aside className={`decision-panel result-${roundScore.verdict}`}>
            <div className="outcome" aria-live="polite">
              <div className="result-summary">
                <p className="eyebrow">Round result</p>
                <strong>
                  {roundScore.verdict === "win" ? "You won" : roundScore.verdict === "loss" ? "You lost" : "It is a draw"}
                </strong>
                <span className={lastAction.trustShift >= 0 ? "trust-up" : "trust-down"}>
                  Trust {lastAction.trustShift >= 0 ? "gained" : "lost"} {Math.abs(lastAction.trustShift)}
                </span>
              </div>
              <div className="result-learning">
                <div>
                  <small>What happened</small>
                  <strong>{lastAction.result}</strong>
                </div>
                <div>
                  <small>Remember</small>
                  <span>{lastAction.lesson}</span>
                </div>
              </div>
              <button
                className="next-lesson"
                type="button"
                aria-label={activeIndex === chapters.length - 1 ? "Restart game" : "Continue to next lesson"}
                onClick={goToNextLesson}
              >
                {activeIndex === chapters.length - 1 ? "Play again" : "Next lesson"}
                <i aria-hidden="true">→</i>
              </button>
            </div>
          </aside>
        )}
      </section>

      <details className="learning-drawer">
        <summary>
          <span>See your learning progress</span>
          <small>Trust, cooperation and system effects</small>
        </summary>
        <section className="metrics-band" aria-label="Trust Lab metrics">
          {(Object.keys(metrics) as MetricKey[]).map((key) => (
            <div key={key} className="metric">
              <div>
                <span>{metricLabel(key)}</span>
                <strong>{metrics[key]}</strong>
              </div>
              <div className="metric-track"><span style={{ width: `${metrics[key]}%` }} /></div>
            </div>
          ))}
        </section>
      </details>

      <details className="learning-drawer">
        <summary>
          <span>Why this lesson matters</span>
          <small>Research and the key trade-off</small>
        </summary>
        <section className="research-strip">
          <div>
            <p className="eyebrow">Research behind this scene</p>
            <p>{chapter.research}</p>
          </div>
          <div>
            <p className="eyebrow">Keep in mind</p>
            <p>
              You are balancing prevented exploitation against missed cooperation. The game reports
              trade-offs, not personality labels.
            </p>
          </div>
        </section>
      </details>

    </main>
  );
}

function CharacterFigure({ agent, index }: { agent: Character; index: number }) {
  return (
    <figure className={`agent ${agent.className}`} style={{ animationDelay: `${index * 120}ms` }}>
      <div className="character-shell">
        <span className="character-shadow" aria-hidden="true" />
        <div className="body">
          <span className="shine" aria-hidden="true" />
          <span className="brow left" aria-hidden="true" />
          <span className="brow right" aria-hidden="true" />
          <span className="eye left" />
          <span className="eye right" />
          <span className="cheek left" aria-hidden="true" />
          <span className="cheek right" aria-hidden="true" />
          <span className="mouth" />
        </div>
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
