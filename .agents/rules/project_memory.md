# Repository Architecture & State Memory

## Key Rules
- Single Source of Truth: All application logic, styling, and markup reside in `/index.html`.
- Mobile Frame Constraints: Enforces mobile viewport (`#mobile-frame`, max 430px) on laptop/desktop view.
- Media Paths:
  - Music: `/audio/background-music.mp3` (under `public/audio/`).
  - Photos: `/images/her photo/photo[1-6].jpg` and `video1.mp4` (under `public/images/her photo/`).
  - Do NOT create duplicate audio or image directories.
- Build & Deploy Workflow:
  - Run `npm run build` to build `dist/` and sync `docs/`.
  - Push to `main` and deploy to `gh-pages` with `npm run deploy`.
- Steps: 15 discrete sections navigated via `goToStep(idx)`.
