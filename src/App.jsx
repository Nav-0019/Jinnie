import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CosmicUniverse } from './scene/CosmicUniverse';
import { storyContent } from './content/storyContent';
import { AudioController } from './components/AudioController';
import { ConstellationNav } from './components/ConstellationNav';
import { StoryOverlays } from './components/StoryOverlays';
import { SongConsentModal } from './components/SongConsentModal';

const CAKE_LOCK_PROGRESS = 0.72;

export default function App() {
  const canvasContainerRef = useRef(null);
  const universeRef = useRef(null);

  const [currentProgress, setCurrentProgress] = useState(0);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);
  const [startUnmuted, setStartUnmuted] = useState(true);

  // Cake blowing state & scroll lock
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showCakeLockedNotice, setShowCakeLockedNotice] = useState(false);
  const candlesBlownRef = useRef(false);
  const noticeTimerRef = useRef(null);

  const triggerCakeLockedNotice = useCallback(() => {
    setShowCakeLockedNotice(true);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => {
      setShowCakeLockedNotice(false);
    }, 2800);
  }, []);

  const handleCandlesBlown = useCallback(() => {
    candlesBlownRef.current = true;
    setCandlesBlown(true);
    setShowCakeLockedNotice(false);
    if (universeRef.current) {
      universeRef.current.extinguishCandles();
    }
  }, []);

  // Initialize Three.js Universe once
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const universe = new CosmicUniverse(canvasContainerRef.current);
    universeRef.current = universe;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        let progress = Math.max(0, Math.min(1, window.scrollY / totalScroll));

        // MANDATORY SCROLL LOCK: Prevent scrolling past the 18th Birthday Cake until candles are blown
        if (!candlesBlownRef.current && progress > CAKE_LOCK_PROGRESS) {
          progress = CAKE_LOCK_PROGRESS;
          window.scrollTo({ top: totalScroll * CAKE_LOCK_PROGRESS, behavior: 'instant' });
          triggerCakeLockedNotice();
        }

        setCurrentProgress(progress);
        universe.setScrollProgress(progress);
      }
    };

    // Intercept downward wheel, touch and key scrolls when at the cake
    const handleWheel = (e) => {
      if (!candlesBlownRef.current) {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const prog = window.scrollY / (totalScroll || 1);
        if (prog >= CAKE_LOCK_PROGRESS - 0.008 && e.deltaY > 0) {
          e.preventDefault();
          triggerCakeLockedNotice();
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!candlesBlownRef.current) {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const prog = window.scrollY / (totalScroll || 1);
        const deltaY = touchStartY - e.touches[0].clientY; // upward drag = scrolling down
        if (prog >= CAKE_LOCK_PROGRESS - 0.008 && deltaY > 0) {
          e.preventDefault();
          triggerCakeLockedNotice();
        }
      }
    };

    const handleKeyDown = (e) => {
      if (!candlesBlownRef.current) {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const prog = window.scrollY / (totalScroll || 1);
        if (
          prog >= CAKE_LOCK_PROGRESS - 0.008 &&
          ['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)
        ) {
          e.preventDefault();
          triggerCakeLockedNotice();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Initial sync
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      universe.destroy();
    };
  }, [triggerCakeLockedNotice]);

  // Enter the Universe clicked: show Song Consent Modal first
  const handleStartJourney = () => {
    setIsSongModalOpen(true);
  };

  // Agree to listen to his song
  const handleAgreeAndPlaySong = () => {
    setStartUnmuted(true);
    setShouldPlayAudio(true);
    setIsSongModalOpen(false);

    // Smoothly scroll to Milestone 2 (progress ~ 0.12)
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = totalScroll * 0.12;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // Decline or choose silent mode
  const handleDeclineSilence = () => {
    setShouldPlayAudio(false);
    setIsSongModalOpen(false);

    // Smoothly scroll to Milestone 2
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = totalScroll * 0.12;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // Jump to specific milestone progress
  const handleScrollToProgress = (targetProgress) => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    // If attempting to jump past cake while locked, clamp to cake
    let safeProgress = targetProgress;
    if (!candlesBlownRef.current && targetProgress > CAKE_LOCK_PROGRESS) {
      safeProgress = CAKE_LOCK_PROGRESS;
      triggerCakeLockedNotice();
    }
    const targetY = totalScroll * safeProgress;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // Replay experience: resets camera, interactions, and scrolls to top
  const handleReplay = () => {
    candlesBlownRef.current = false;
    setCandlesBlown(false);
    setShowCakeLockedNotice(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (universeRef.current) {
      universeRef.current.resetCandles();
      universeRef.current.resetGiftBox();
      universeRef.current.setRoomLighting(false);
      universeRef.current.setScrollProgress(0);
    }
    setCurrentProgress(0);
  };

  return (
    <div className="cosmic-app-wrapper">
      {/* Three.js Persistent 3D WebGL Canvas */}
      <div ref={canvasContainerRef} className="cosmic-canvas-container" />

      {/* Background Audio Controller (unmuted by default when agreed) */}
      <AudioController
        shouldPlay={shouldPlayAudio}
        startUnmuted={startUnmuted}
      />

      {/* Subtle Constellation Progress Indicator */}
      <ConstellationNav
        milestones={storyContent.milestones}
        currentProgress={currentProgress}
        onSelectMilestone={handleScrollToProgress}
      />

      {/* Virtual Scroll Height to drive the 4–6 minute continuous journey */}
      <div className="virtual-scroll-track" />

      {/* Story Overlays, Interactions, Birthday Cake, Switch & Confession */}
      <StoryOverlays
        milestones={storyContent.milestones}
        currentProgress={currentProgress}
        onStartJourney={handleStartJourney}
        universeRef={universeRef}
        photos={storyContent.photos}
        girlNickname={storyContent.personalization.girlNickname}
        boyNickname={storyContent.personalization.boyNickname}
        recipientPhone={storyContent.personalization.recipientPhone}
        candlesBlown={candlesBlown}
        onCandlesBlown={handleCandlesBlown}
        showCakeLockedNotice={showCakeLockedNotice}
        onReplay={handleReplay}
        onScrollToProgress={handleScrollToProgress}
      />

      {/* Song Consent Modal: Asks her to agree to play the song made to impress her */}
      <SongConsentModal
        isOpen={isSongModalOpen}
        girlNickname={storyContent.personalization.girlNickname}
        boyNickname={storyContent.personalization.boyNickname}
        onAgreeAndPlay={handleAgreeAndPlaySong}
        onDeclineSilence={handleDeclineSilence}
      />
    </div>
  );
}
