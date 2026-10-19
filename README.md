# A Little World Made for You 🌹

An interactive, cinematic digital storybook and 18th birthday celebration website built with React, Vite, and tailored animations.

## 🌟 The 8 Chapters Journey

1. **Chapter 01 — The Beginning**: Vintage storybook opening with gold corners, romantic quote, and animated cover opening.
2. **Chapter 02 — Our Unexpected Beginning**: Interactive timeline illustrating the online connection via a classmate's sister, first chat banter, day 5 clash (with haptic/visual shake), the boy's apology, clash round 2, her apology, and 5 months of late-night conversations.
3. **Chapter 03 — Her 18th Birthday**: Tiered birthday cake with 18 individually placeable candles (counter 0 to 18), "Light the Candles" flame animations, "Make a Wish" secret prompt, and "Blow Out the Candles" with realistic breath whoosh sound and confetti burst.
4. **Chapter 04 — Cake-Cutting Game**: Six interactive numbered slices (01–06), wish & dare inputs, real-time message preview card, and one-click WhatsApp sharing / clipboard copy.
5. **Chapter 05 — The Mysterious Gift**: 3D floating burgundy gift box with interactive hover/touch tilt, animated lid pop, radiant light burst, and smooth descent into the next scene.
6. **Chapter 06 — Her Secret Room**: Dark room with discoverable vintage wall switch; clicking turns on fairy lights, reveals the floor carpeted in red roses and petals, and displays 6 framed memory portraits with full-screen lightbox modal previews.
7. **Chapter 07 — The Confession**: Heartfelt, honest confession acknowledging your online connection with 3 respectful, non-coercive choices (*"Yes, let's see where this goes"*, *"I need some time"*, *"I see you as a friend"*), each providing a warm, sincere response.
8. **Chapter 08 — Her Chapter & Outro**: Interactive journal where she can write her own memories, thoughts, and hopes for the next chapter, ending with an animated storybook closing: *"To be continued..."*

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview

# 5. Check linting
npm run lint
```

---

## 🎨 How to Personalize the Story

### Option A: Directly in the Browser (Easiest)
Click the **Gear (⚙️) icon** at the top right of the navigation bar while the site is running to update:
- Her Nickname / Name (e.g., replace *"Drama Queen"* with her name)
- Your Nickname / Name (e.g., replace *"Persistent Boy"* with your name)
- Recipient WhatsApp Number (e.g., `919876543210`)

### Option B: In the Codebase (`src/content/storyContent.js`)
All story text, chat bubbles, prompts, and confession letters are centralized in:
[`src/content/storyContent.js`](file:///d:/Github/proposal/src/content/storyContent.js).

---

## 📸 Replacing Memory Photos & Background

To use your own real photos, simply place your files into:
- `public/images/room/secret_room.jpg` — Background photo of the secret room.
- `public/images/memories/` — Memory wall images:
  - `memory1_beginning.jpg`
  - `memory2_apology.jpg`
  - `memory3_conversations.jpg`
  - `memory4_eighteen.jpg`
  - `memory5_sky.jpg`
  - `memory6_journal.jpg`

---

## 🌐 Deploying to Vercel or Netlify

1. Push your repository to GitHub.
2. Import into **[Vercel](https://vercel.com)** or **[Netlify](https://netlify.com)**.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Test the URL on your mobile phone and send it to her on her birthday! 🎁
