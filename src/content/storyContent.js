/**
 * A Universe Made for Her — Story Content & Configuration
 * Accurate, sincere, BTS-inspired cosmic narrative for Jinnie's 18th Birthday.
 */

import { getAssetUrl } from '../utils/assetPath';

const defaultGirlNickname = import.meta.env?.VITE_GIRL_NICKNAME || "Jinnie";
const defaultBoyNickname = import.meta.env?.VITE_BOY_NICKNAME || "Bewakuf";
const defaultPhone = import.meta.env?.VITE_DEFAULT_PHONE_NUMBER || "+91 7310347742";

export const storyContent = {
  personalization: {
    girlNickname: defaultGirlNickname,
    boyNickname: defaultBoyNickname,
    recipientPhone: defaultPhone,
    birthdayDate: "18th Birthday",
  },

  // Audio track configuration
  audio: {
    src: getAssetUrl("/assets/audio/background-music.mp3"),
    title: "Background Music",
  },

  // The 10 Narrative Milestones along the cosmic scroll path
  milestones: [
    {
      id: "milestone-1",
      progress: 0.0,
      tag: "Proem",
      title: "A Universe Made for You",
      subtitle: "Some stars enter our universe quietly. Some collide with us. And somehow, you found your way back into my sky.",
      caption: "Turn on your sound, take a slow breath, and let me take you on a journey through the stars.",
      buttonText: "Step Into Our Universe",
    },
    {
      id: "milestone-2",
      progress: 0.12,
      tag: "Part I · The Online Spark",
      title: "Across Six Months of Distance",
      body: [
        "It started around six months ago, when I first met you online as my classmate's sister.",
        "We've never met face-to-face. It's always just been the two of us talking through illuminated screens late into the night.",
        "From the very first day, you were unapologetically you — nonchalant, a little too dramatic at times, and impossible for me to ignore."
      ],
      easterEggHint: "✨ Look closely at the stars nearby — a 7-star constellation watches over our sky.",
    },
    {
      id: "milestone-3",
      progress: 0.24,
      tag: "Part II · The First Clash",
      title: "Day 5: Our Collision",
      body: [
        "We didn't have some soft, cliché fairy-tale beginning.",
        "Barely five days after we started talking, our personalities collided. I felt you were being too rude to be talking to me, and I was blunt enough to tell you that straight to your face.",
        "It was early, we barely knew each other, and the cold silence that followed felt sharp."
      ],
      cosmicEffect: "tense-reddish-purple",
    },
    {
      id: "milestone-4",
      progress: 0.38,
      tag: "Part III · Distance & The Block",
      title: "When Words Went Too Far",
      body: [
        "Later, another disagreement flared up between us. I stood up to defend my best friend's actions, and our argument crossed the line.",
        "You felt genuinely hurt by my words. You blocked me, and our conversation went completely dark.",
        "Neither of us was entirely innocent, and that silence between us felt painfully real."
      ],
      cosmicEffect: "deep-quiet-space",
    },
    {
      id: "milestone-5",
      progress: 0.50,
      tag: "Part IV · The Return",
      title: "Finding Your Way Back",
      body: [
        "In a vast sky, when two stars drift apart, they usually never cross paths again.",
        "But then, you unblocked me. You came back and started talking to me again.",
        "It wasn't some dramatic movie scene — it was simply the two of us getting another chance to understand each other. And to me, your Bewakuf, that meant the world."
      ],
      easterEggDoorway: "🚪 Our Cosmic Doorway — inspired by the Magic Shop, where warm hearts always find comfort.",
    },
    {
      id: "milestone-6",
      progress: 0.62,
      tag: "Part V · Five Months of Talking",
      title: "The Conversations That Stayed",
      body: [
        "For the past five months, talking to you has quietly become the absolute best part of my ordinary days.",
        "Your dramatic reactions, our inside jokes, the late-night random thoughts exchanged across screens — I've genuinely fallen in love with your vibe.",
        "We're still two people who have only known each other online, but what I feel for you is completely honest and real."
      ],
    },
    {
      id: "milestone-7",
      progress: 0.74,
      tag: "Part VI · 18th Birthday Celebration",
      title: "Eighteen Candles in the Sky",
      body: [
        "Enough about our past chaos. Today, my entire universe pauses to celebrate you.",
        "I placed eighteen candles in the sky for eighteen years of your light in this world.",
        "Make a wish in your heart, Jinnie. You can blow into your microphone or tap the button to extinguish the flames."
      ],
      cakePrompt: "18 Candles for Jinnie's 18th Birthday",
    },
    {
      id: "milestone-8",
      progress: 0.84,
      tag: "Part VII · The Gift",
      title: "A Surprise in the Stars",
      body: [
        "Before this journey ends, I have one last thing waiting for you in the quiet of space.",
        "Click or tap the floating gift box to untie the ribbon and see what I built inside for you."
      ],
      giftHint: "Tap the floating gift box to open the portal",
    },
    {
      id: "milestone-9",
      progress: 0.92,
      tag: "Part VIII · Her Secret Room",
      title: "A Room of Roses & Memories",
      body: [
        "It's dark in here... Reach for the switch on the wall to illuminate the room I made for you.",
        "I filled the floor with fresh red roses and hung up the moments and pictures of you that mean the most to me."
      ],
      switchPrompt: "Turn on the wall switch",
    },
    {
      id: "milestone-10",
      progress: 1.0,
      tag: "Part IX · The Confession",
      title: "Something I've Kept in My Heart",
      confession: {
        salutation: `Hey, ${defaultGirlNickname}. ❤️ From your ${defaultBoyNickname}`,
        paragraphs: [
          "Six months ago, I had no idea that an unexpected online hello would introduce me to someone I look forward to hearing from every single day.",
          "We've had our clashes, our stubborn pride, the moments we disagreed, and that time we stopped talking. We never pretended to be perfect for each other.",
          "And yet, after all the disagreements and distance, we found our way back to each other. You are nonchalant, delightfully dramatic, and wonderfully, genuinely yourself.",
          "I don't know what the future holds, and I won't pretend that five months of online conversations mean I know every single thing about you. Nor do I assume that you feel the exact same way.",
          "But on your eighteenth birthday, I wanted to tell you what has been quietly growing in my heart, without hiding behind any jokes anymore:",
          "I like you, Jinnie. Truly, honestly, more than just a friend.",
          "I wanted you to know how I feel, with zero pressure, zero expectations, and absolutely no wrong answer.",
          `Happy 18th birthday, ${defaultGirlNickname}. I am genuinely so grateful that your star crossed into mine.`
        ],
        choices: [
          {
            id: "same",
            label: "I feel the same way 💜",
            responseTitle: "💜 My heart just skipped a beat.",
            responseText: "Hearing that means more to me than words can ever say. Let's take things slowly, honestly, and explore this chapter together at whatever pace feels comfortable for us.",
          },
          {
            id: "time",
            label: "I need time to think",
            responseTitle: "⏳ Take all the time you need.",
            responseText: "There is zero rush, ever. Your comfort and feelings come first. I'm just so glad I could finally be honest with you today.",
          },
          {
            id: "friend",
            label: "I see you as a friend",
            responseTitle: "🤍 Thank you for your honesty.",
            responseText: "Thank you for being sincere with me. Your friendship and our bond mean the world to me, your 18th birthday gift is completely yours, and I will always wish you the happiest year ahead.",
          }
        ]
      }
    }
  ],

  // Photographs of Jinnie to display in the 3D room frames
  photos: [
    {
      id: "photo-1",
      src: getAssetUrl("/assets/images/photo1.jpg"),
      title: "Your Radiant Smile",
      caption: "The charm and warmth in your smile that light up every conversation we have."
    },
    {
      id: "photo-2",
      src: getAssetUrl("/assets/images/photo2.jpg"),
      title: "My Favorite Glimpse of You",
      caption: "Delightfully dramatic, effortlessly yourself — exactly the way I like you."
    },
    {
      id: "photo-3",
      src: getAssetUrl("/assets/images/photo3.jpg"),
      title: "Grace & Light",
      caption: "A presence that stayed on my mind across all these miles of distance."
    },
    {
      id: "photo-4",
      src: getAssetUrl("/assets/images/photo4.jpg"),
      title: "The Quiet Moments",
      caption: "Behind your banter and sarcasm, I see such a soft, genuine, caring soul."
    },
    {
      id: "photo-5",
      src: getAssetUrl("/assets/images/photo5.jpg"),
      title: "Turning Eighteen",
      caption: "A brand new year, infinite possibilities, and endless reasons for me to make you smile."
    },
    {
      id: "photo-6",
      src: getAssetUrl("/assets/images/photo6.jpg"),
      title: "In Our Universe",
      caption: "The girl who found her way back into my sky, and stayed in my heart."
    }
  ],

  // Easter eggs details
  easterEggs: {
    sevenStars: {
      name: "The 7-Star Constellation",
      description: "Seven bright stars glowing in harmony — a subtle nod to seven voices that bring comfort, hope, and light to millions.",
    },
    magicShop: {
      name: "The Cosmic Doorway",
      description: "Inspired by the Magic Shop — a warm celestial refuge where honest hearts find reassurance and smiles.",
    },
    mikrokosmos: {
      name: "Mikrokosmos Stars",
      description: "‘You got me, I dream while looking at you... We shine each in our own way.’",
    }
  }
};
