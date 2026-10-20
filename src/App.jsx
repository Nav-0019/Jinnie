import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UniverseCanvas } from './scene/UniverseCanvas';
import { BTS_MEMBERS } from './utils/btsGifs';
import {
  BTSCrowd,
  PeekMember,
  CosmicWhale,
  ScrollRunners,
} from './components/BTSCrew';
import { CakeGame } from './components/CakeGame';
import { MessageStars } from './components/MessageStars';
import { GiftSection } from './components/GiftSection';
import { SwipeDeck } from './components/SwipeDeck';
import { ConfessionCard } from './components/ConfessionCard';
import {
  pop,
  toggleAmbientSound,
  rainEmojis,
} from './utils/audioSynth';
import { storyContent } from './content/storyContent';

const CAKE_PROGRESS_LOCK = 0.82; // Milestone 9: Cake must be completed to unlock Gift & beyond

export default function App() {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [collectedMembers, setCollectedMembers] = useState([]);
  const [showWhale, setShowWhale] = useState(false);
  const [isScrollingFast, setIsScrollingFast] = useState(false);
  const [scrollDir, setScrollDir] = useState(1);
  const [toastText, setToastText] = useState(null);

  // Milestone unlock states
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [deckCompleted, setDeckCompleted] = useState(false);

  const candlesBlownRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const fastScrollTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText(null);
    }, 3200);
  }, []);

  // Collect member logic
  const handleCollectMember = useCallback(
    (name) => {
      setCollectedMembers((prev) => {
        if (prev.includes(name)) return prev;
        const updated = [...prev, name];
        if (updated.length === 7) {
          showToast('All seven found! ARMY + crew forever 💜');
          setShowWhale(true);
          rainEmojis(['💜', '✨', '🐋', '💖'], 40);
        } else {
          showToast(`You found ${name}! (${updated.length} of 7) 💜`);
        }
        return updated;
      });
    },
    [showToast]
  );

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = toggleAmbientSound();
    setIsSoundOn(nextState);
    pop(nextState ? 750 : 420);
    showToast(nextState ? 'Sound on 🎶' : 'Sound off 🔇');
  };

  // Scroll listener: Calculates progress & enforces cake lock
  useEffect(() => {
    lastScrollTimeRef.current = performance.now();

    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const now = performance.now();
      const currentY = window.scrollY;
      const dy = currentY - lastScrollYRef.current;
      const dt = Math.max(10, now - lastScrollTimeRef.current);
      const vel = (dy / dt) * 16;

      lastScrollYRef.current = currentY;
      lastScrollTimeRef.current = now;

      setScrollVelocity(vel);
      if (Math.abs(dy) > 40) {
        setScrollDir(dy > 0 ? 1 : -1);
        setIsScrollingFast(true);
        if (fastScrollTimerRef.current) clearTimeout(fastScrollTimerRef.current);
        fastScrollTimerRef.current = setTimeout(() => {
          setIsScrollingFast(false);
        }, 1200);
      }

      let prog = Math.max(0, Math.min(1, currentY / totalScroll));

      // MANDATORY CAKE LOCK: Prevent scrolling past Birthday Cake until 18 candles are blown
      if (!candlesBlownRef.current && prog > CAKE_PROGRESS_LOCK) {
        prog = CAKE_PROGRESS_LOCK;
        window.scrollTo({
          top: totalScroll * CAKE_PROGRESS_LOCK,
          behavior: 'instant',
        });
        showToast('Blow out all 18 candles to unlock your surprise! 🎂');
      }

      setCurrentProgress(prog);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (fastScrollTimerRef.current) clearTimeout(fastScrollTimerRef.current);
    };
  }, [showToast]);

  // Jump to specific milestone progress
  const scrollToProgress = (targetProg) => {
    const totalScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    let safeProg = targetProg;
    if (!candlesBlownRef.current && targetProg > CAKE_PROGRESS_LOCK) {
      safeProg = CAKE_PROGRESS_LOCK;
      showToast('Blow out all 18 candles first 🎂');
    }
    pop(600);
    window.scrollTo({ top: totalScroll * safeProg, behavior: 'smooth' });
  };

  const handleBeginJourney = () => {
    pop(650);
    scrollToProgress(0.12);
  };

  const handleCandlesFinished = () => {
    candlesBlownRef.current = true;
    setCandlesBlown(true);
    showToast('Wish accepted! Surprise gift unlocked 🎁');
  };

  const handleGiftOpened = () => {
    setGiftOpened(true);
    showToast('Gift opened ✨ Swipe cards unlocked!');
    setTimeout(() => {
      scrollToProgress(0.94);
    }, 800);
  };

  const handleDeckFinished = () => {
    setDeckCompleted(true);
    showToast('Letter unlocked 💌');
    setTimeout(() => {
      scrollToProgress(0.99);
    }, 1000);
  };

  // Milestone Definitions for navigation dots
  const MILESTONES_NAV = [
    { title: 'The Beginning', prog: 0.02 },
    { title: 'Six Months', prog: 0.12 },
    { title: 'Day 5 Clash', prog: 0.21 },
    { title: 'Explosion', prog: 0.30 },
    { title: 'The Silence', prog: 0.39 },
    { title: 'Dead Planet', prog: 0.48 },
    { title: 'Magic Shop', prog: 0.57 },
    { title: 'Five Months', prog: 0.66 },
    { title: 'Message Stars', prog: 0.74 },
    { title: 'Birthday Cake', prog: 0.82 },
    { title: 'The Gift', prog: 0.89 },
    { title: 'Soul Cards', prog: 0.94 },
    { title: 'Confession', prog: 0.99 },
  ];

  const lightYears = Math.round(currentProgress * 8400 * 9.46);

  return (
    <div className="universe-app-wrapper">
      {/* 1. Procedural 2D Universe Canvas Background */}
      <UniverseCanvas
        scrollProgress={currentProgress}
        scrollVelocity={scrollVelocity}
      />

      {/* 2. Fixed HUD at Top */}
      <header className="hud">
        <div className="hud-left">
          <span className="hud-item">
            🚀 <b>{lightYears.toLocaleString()}</b> light-years from home
          </span>
          <span className="hud-item">
            💜 <b>{collectedMembers.length}</b>/7 ARMY crew
          </span>
        </div>
        <div className="hud-right">
          <button className="hud-btn" onClick={handleToggleSound}>
            {isSoundOn ? '♪ Sound on' : '♪ Sound off'}
          </button>
        </div>
      </header>

      {/* 3. Constellation Navigation Dots */}
      <nav
        className="milestone-constellation-nav"
        aria-label="Story chapters navigation"
      >
        {MILESTONES_NAV.map((m, idx) => {
          const isActive =
            Math.abs(currentProgress - m.prog) < 0.045 ||
            (idx === 0 && currentProgress < 0.06);
          return (
            <button
              key={idx}
              className={`milestone-dot ${isActive ? 'active' : ''}`}
              onClick={() => scrollToProgress(m.prog)}
              title={m.title}
            />
          );
        })}
      </nav>

      {/* 4. Runners sprint on scroll */}
      <ScrollRunners isScrolling={isScrollingFast} direction={scrollDir} />

      {/* 5. Cosmic Whale animation */}
      {showWhale && <CosmicWhale onComplete={() => setShowWhale(false)} />}

      {/* 6. Virtual Scroll Track to drive native smooth scrolling */}
      <div className="virtual-scroll-track" />

      {/* 7. FIXED CENTRAL NARRATIVE OVERLAY (FADES WITHOUT GOING DOWN) */}
      <main className="narrative-overlay-layer">
        {/* MILESTONE 0: Opening Proem */}
        <section
          className={`overlay-card ${
            currentProgress < 0.07 ? 'visible' : 'faded'
          }`}
        >
          <h1>A Universe Made for You.</h1>
          <p>
            Some stars enter quietly. And somehow, you found your way back into
            our sky.
          </p>
          <p>Turn up your sound, take a slow breath… and scroll. ✦</p>
          <button className="btn-begin" onClick={handleBeginJourney}>
            Begin ↓
          </button>

          <BTSCrowd
            onCollect={handleCollectMember}
            collected={collectedMembers}
          />
        </section>

        {/* MILESTONE 1: Across 6 Months of Distance */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.07 && currentProgress < 0.16
              ? 'visible'
              : 'faded'
          }`}
        >
          <h2>Across six months of distance</h2>
          <p>We met online, through my classmate’s sister.</p>
          <p>Never face to face. Only glowing screens, late into the night.</p>
          <p>And you: nonchalant, a little dramatic, impossible to ignore. ✦</p>

          <PeekMember
            memberIndex={0}
            position="r"
            hint="Psst… he built a whole universe for you 👀"
            onCollect={handleCollectMember}
            isCollected={collectedMembers.includes(BTS_MEMBERS[0].name)}
          />
        </section>

        {/* MILESTONE 2: Day 5 - Collision */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.16 && currentProgress < 0.25
              ? 'visible'
              : 'faded'
          }`}
        >
          <h2>Day 5: our collision</h2>
          <p>No fairy-tale beginning.</p>
          <p>
            Five days in, we crashed like two clouds of gas. You were rude. I was
            blunt.
          </p>
          <p>Then, a cold silence. ❄️</p>

          <PeekMember
            memberIndex={1}
            position="l"
            hint="Ooh, this part again? 🤭"
            onCollect={handleCollectMember}
            isCollected={collectedMembers.includes(BTS_MEMBERS[1].name)}
          />
        </section>

        {/* MILESTONE 3: When Words Went Too Far */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.25 && currentProgress < 0.34
              ? 'visible'
              : 'faded'
          }`}
        >
          <h2>When words went too far</h2>
          <p>A gamma-ray burst is the brightest explosion in the universe.</p>
          <p>That argument felt like one.</p>
          <p>You were hurt, and neither of us was innocent. 🥀</p>

          <PeekMember
            memberIndex={2}
            position="r"
            hint="Scroll slower, we’re reading too! 📖"
            onCollect={handleCollectMember}
            isCollected={collectedMembers.includes(BTS_MEMBERS[2].name)}
          />
        </section>

        {/* MILESTONE 4: And Then, The Dark */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.34 && currentProgress < 0.43
              ? 'visible'
              : 'faded'
          }`}
        >
          <h2>And then, the dark</h2>
          <p>You blocked me.</p>
          <p>Not even light escapes a black hole.</p>
          <p>That’s how that silence felt.</p>

          <PeekMember
            memberIndex={3}
            position="l"
            hint="We saw that smile 😏"
            onCollect={handleCollectMember}
            isCollected={collectedMembers.includes(BTS_MEMBERS[3].name)}
          />
        </section>

        {/* MILESTONE 5: A Planet Where Nothing Speaks */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.43 && currentProgress < 0.52
              ? 'visible'
              : 'faded'
          }`}
        >
          <h2>A planet where nothing speaks</h2>
          <p>Cold. Quiet. Still.</p>
          <p>A world with no one left to answer.</p>

          <PeekMember
            memberIndex={4}
            position="r"
            hint="Tap me. I dare you 💜"
            onCollect={handleCollectMember}
            isCollected={collectedMembers.includes(BTS_MEMBERS[4].name)}
          />
        </section>

        {/* MILESTONE 6: Finding Your Way Back */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.52 && currentProgress < 0.61
              ? 'visible'
              : 'faded'
          }`}
        >
          <h2>Finding your way back</h2>
          <p>When two stars drift apart, they usually never cross paths again.</p>
          <p>But you unblocked me. You came back.</p>
          <p>
            Not a movie scene, just a second chance. To me, your Bewakuf, it
            meant the world. 💜
          </p>
          <div className="note">
            ✦ our doorway: the Magic Shop, where warm hearts find comfort
          </div>

          <PeekMember
            memberIndex={5}
            position="l"
            hint="This is the good part… 🌙"
            onCollect={handleCollectMember}
            isCollected={collectedMembers.includes(BTS_MEMBERS[5].name)}
          />
        </section>

        {/* MILESTONE 7: The Conversations That Stayed */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.61 && currentProgress < 0.70
              ? 'visible'
              : 'faded'
          }`}
        >
          <h2>The conversations that stayed</h2>
          <p>
            Five months of quietly becoming the best part of my ordinary days.
          </p>
          <p>Your dramatic reactions. Our inside jokes. 3 a.m. thoughts.</p>
          <p>I’ve genuinely fallen for your vibe. 🥹</p>

          <PeekMember
            memberIndex={6}
            position="r"
            hint="Shhh, don’t tell her he’s blushing 🤫"
            onCollect={handleCollectMember}
            isCollected={collectedMembers.includes(BTS_MEMBERS[6].name)}
          />
        </section>

        {/* MILESTONE 8: Message Stars */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.70 && currentProgress < 0.78
              ? 'visible'
              : 'faded'
          }`}
        >
          <MessageStars />
        </section>

        {/* MILESTONE 9: 18th Birthday Cake (Lock active until candles blown) */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.78 && currentProgress < 0.86
              ? 'visible'
              : 'faded'
          }`}
        >
          <CakeGame
            isCompleted={candlesBlown}
            onComplete={handleCandlesFinished}
          />
        </section>

        {/* MILESTONE 10: The Mysterious Gift */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.86 && currentProgress < 0.92
              ? 'visible'
              : 'faded'
          }`}
        >
          <GiftSection isOpened={giftOpened} onOpen={handleGiftOpened} />
        </section>

        {/* MILESTONE 11: Swipe Deck ("What I adore about your soul") */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.92 && currentProgress < 0.97
              ? 'visible'
              : 'faded'
          }`}
        >
          <SwipeDeck
            isUnlocked={deckCompleted}
            onComplete={handleDeckFinished}
          />
        </section>

        {/* MILESTONE 12: The Confession Letter & 3 Choices */}
        <section
          className={`overlay-card ${
            currentProgress >= 0.97 ? 'visible' : 'faded'
          }`}
        >
          <ConfessionCard
            girlNickname={storyContent.personalization.girlNickname}
            boyNickname={storyContent.personalization.boyNickname}
            recipientPhone={storyContent.personalization.recipientPhone}
          />
        </section>
      </main>

      {/* Floating Toast notification */}
      {toastText && <div className="toast">{toastText}</div>}
    </div>
  );
}
