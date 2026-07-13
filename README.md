# Trust Lab

Trust Lab is a browser-based interactive educational game about calibrated trust
across people, groups, reputation systems, feeds, AI tools and institutions.

This first playable version includes:

- an animated white-canvas campaign with nine scenes;
- hand-drawn CSS characters for Scout, Patch, Wall, Velvet, Echo, Drift,
  Ledger, Mask, Lens, Spark, Oracle, Compass and Architect;
- interactive decisions with visible consequences and calibration metrics;
- optional browser voice narration, captions, sound effects and reduced-motion
  controls;
- a sandbox with sliders for future interaction, mistake rate, reputation
  quality and AI calibration;
- render tests that verify the product page is no longer the starter skeleton.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/`.

## Validate

```bash
npm run build
npm test
npm run lint
```

## Product Direction

The game follows the product requirement: trust is not maximized or minimized;
it is calibrated. Player feedback reports trade-offs such as false trust,
missed cooperation, repair quality, information integrity and AI reliance
without labeling the player as good, bad or trustworthy.
