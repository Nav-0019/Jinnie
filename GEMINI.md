# Project Memory & Architecture Guide (Jinnie Proposal / 18th Birthday)

This file serves as permanent memory for the Antigravity AI coding assistant. Whenever opening this repository, reference this memory immediately without re-scanning or re-reading the entire project.

---

## 1. Project Summary & Core Concept
* **Occasion**: 18th Birthday and romantic proposal for Jinnie.
* **Theme**: Cosmic universe journey spanning across space, time, and constellations into a personal birthday celebration and love declaration.
* **Target Viewport**: Mobile-first experience. On desktop/laptop, it enforces a centered iPhone-pro mobile frame (`#mobile-frame`, max-width 430px, max-height 94vh) so layouts never stretch or break.

---

## 2. Technology Stack & Build Pipeline
* **Engine**: Pure Vanilla HTML5, modern CSS3, and ES6 JavaScript consolidated in the root `index.html`.
* **Build Tool**: Vite (`vite` / `vite build`).
* **Dev Server**: `npm run dev` running on `http://localhost:5173/`.
* **Build Command**: `npm run build` (`vite build && node scripts/sync-build.js`).
* **Deploy Command**: `npm run deploy` (`npx gh-pages -d dist`) and GitHub Actions `.github/workflows/deploy.yml`.
* **Dual Hosting Targets**:
  - `dist/`: Clean production build folder (Git ignored).
  - `docs/`: Clean sync of `dist/` for GitHub Pages hosting (Git tracked).
  - Both must always have `.nojekyll` present.

---

## 3. Canonical Asset Locations (NO Duplicates Allowed)
* **Background Music**:
  - Exactly ONE copy at `public/audio/background-music.mp3` (referenced in `index.html` as `./audio/background-music.mp3`).
  - DO NOT reintroduce root `/assets`, root `/song`, `/public/song`, or `/public/assets`.
* **Photos & Media**:
  - Stored in `public/images/her photo/`.
  - Canonical filenames: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`, `photo5.jpg`, `photo6.jpg`, and `video1.mp4`.
  - DO NOT re-add raw WhatsApp duplicate filenames (`WhatsApp Image...`).
* **BTS Stickers & Chibi Badges**:
  - Served via direct Giphy animated stickers in `index.html`.
  - Section 1 features the 7 BTS members in the bottom crowd lineup.
  - Cards feature single cute companion sticker perched on the card's top-right corner.

---

## 4. Journey Progression (15 Discrete Steps)
Navigation uses discrete step-by-step progression via `goToStep(idx)`. Fractional/partial scroll momentum is disabled.
* **Step 0 (`earth`)**: Launchpad — "Look up at the night sky...".
* **Step 1 (`const`)**: Constellations — "Long ago, people drew lines between distant stars...".
* **Step 2 (`neb`)**: Nebulae — "Out there, giant clouds of gas and cosmic dust glow...".
* **Step 3 (`grb`)**: Gamma Ray Bursts — "A gamma-ray burst unleashes more energy in seconds...".
* **Step 4 (`bh`)**: Realistic Fading Black Hole — Gravitational lens and event horizon.
* **Step 5 (`dead`)**: Dead Stars — "Even when a star collapses into cold silence...".
* **Step 6 (`birth`)**: Stellar Nurseries — "Deep within silent dust, gravity pulls particles together...".
* **Step 7 (`gal`)**: Galaxies — "A galaxy holds hundreds of billions of suns...".
* **Step 8 (`msg`)**: Message Stars — 5 interactive message stars (`#arena`, `#sm`) with "Make a Wish on the Cake 🎂" button.
* **Step 9 (`cakesec`)**: Eighteen Candles in the Sky — Fully integrated birthday cake card:
  - Header: Title & instructions.
  - Interactive SVG cake with 18 candle positions.
  - Tap or drag from tray to place candles.
  - Lighting sequence -> Microphone / button hold blow phase.
  - Immediate celebratory fanfare and confetti, transitioning automatically at 2.0s to `#giftsec`.
* **Step 10 (`giftsec`)**: Surprise in the Stars — Pulsating 3D gift box with "Open the gift 🎁" button. Unwrapping launches fireworks and unlocks Step 11.
* **Step 11 (`memoriessec`)**: Memories in the Wind — Photos drift in folding from top-right like leaves on a cosmic breeze, showcase with captions, and blow away on tap. Cycles through all 6 photos before unlocking Step 12.
* **Step 12 (`decksec`)**: What I adore about your soul — 6 interactive swipe cards.
* **Step 13 (`lettersec`)**: The Love Letter — Typewritten letter ("I like you, Jinnie. Truly, honestly, more than a friend.").
* **Step 14 (`replysec`)**: The Answer & WhatsApp:
  - Three choices:
    1. "I feel the same way 💜" -> Triggers Diwali fireworks celebration and opens WhatsApp message to `7310347742`.
    2. "I need time to think 🌙"
    3. "I see you as a friend 🤝"

---

## 5. Coding & Modification Guidelines
1. **Never Re-read the Entire Project**: Use this file as ground truth. Only inspect targeted line ranges when making edits.
2. **Preserve Single-File Architecture**: Do NOT recreate deleted React folders or split into extraneous framework bundles unless explicitly requested.
3. **Maintain Audio Gate Flow**: Audio permissions must remain handled via `#audio-gate` on initial interaction so mobile browsers play audio smoothly without interruption.
4. **Always Build & Sync**: After any changes to `index.html` or `public/`, run `npm run build` to update `dist/` and `docs/`.
