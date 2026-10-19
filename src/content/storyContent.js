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
      title: "A Universe Made for Her",
      subtitle: "Some stars enter our universe quietly. Some collide with us. And somehow, some find their way back into our sky.",
      caption: "Turn on your sound, take a slow breath, and begin scrolling through the stars.",
      buttonText: "Enter the Universe",
    },
    {
      id: "milestone-2",
      progress: 0.12,
      tag: "Part I · The Online Spark",
      title: "Across Six Months of Distance",
      body: [
        "It started around six months ago, with a girl who happened to be my classmate's sister.",
        "We've never met face-to-face. Just two people talking through illuminated screens late into the night.",
        "From the very start, you were unapologetically you — nonchalant, a little too dramatic at times, and impossible to ignore."
      ],
      easterEggHint: "✨ Look closely at the stars nearby — a 7-star constellation watches over this sky.",
    },
    {
      id: "milestone-3",
      progress: 0.24,
      tag: "Part II · The First Clash",
      title: "Day 5: The Collision",
      body: [
        "We didn't have a soft, fairy-tale beginning.",
        "Only about five days after we started talking, our personalities collided. I felt you were being too rude to be talking to me, and I was blunt enough to tell you that.",
        "It was early, we barely knew each other, and the silence that followed felt sharp."
      ],
      cosmicEffect: "tense-reddish-purple",
    },
    {
      id: "milestone-4",
      progress: 0.38,
      tag: "Part III · Distance & The Block",
      title: "When Words Went Too Far",
      body: [
        "Later, another disagreement flared up. I stood up to defend my best friend's actions, and the argument crossed the line.",
        "You felt genuinely hurt. You blocked me, and the conversation went completely dark.",
        "Neither of us was entirely innocent, and the distance between our worlds felt very real."
      ],
      cosmicEffect: "deep-quiet-space",
    },
    {
      id: "milestone-5",
      progress: 0.50,
      tag: "Part IV · The Return",
      title: "Finding Your Way Back",
      body: [
        "In a vast sky, when stars drift apart, they usually never cross paths again.",
        "But afterwards, you unblocked me. You came back and started talking to me again.",
        "It wasn't an invented movie apology — it was simply the two of us getting another chance to understand each other. And that meant the world to me."
      ],
      easterEggDoorway: "🚪 Cosmic Doorway — inspired by the Magic Shop, where warm hearts always find comfort.",
    },
    {
      id: "milestone-6",
      progress: 0.62,
      tag: "Part V · Five Months of Talking",
      title: "The Conversations That Stayed",
      body: [
        "For the past five months, talking to you has quietly become the best part of my ordinary days.",
        "Your dramatic reactions, the shared jokes, the random thoughts exchanged across screens — I've genuinely come to appreciate your vibe.",
        "We're still two people who have only known each other online, but what I feel is honest and real."
      ],
    },
    {
      id: "milestone-7",
      progress: 0.74,
      tag: "Part VI · 18th Birthday Celebration",
      title: "Eighteen Candles in the Sky",
      body: [
        "Enough about our chaos. Today, the entire universe pauses to celebrate you.",
        "Eighteen candles for eighteen years of your light in this world.",
        "Make a wish in your heart. You can blow into your microphone or tap the button to extinguish the flames."
      ],
      cakePrompt: "18 Candles for Jinnie's 18th Birthday",
    },
    {
      id: "milestone-8",
      progress: 0.84,
      tag: "Part VII · The Gift",
      title: "A Surprise in the Stars",
      body: [
        "Before this journey ends, there is one last thing waiting in the quiet of space.",
        "Click or tap the floating gift box to untie the ribbon and see where it leads."
      ],
      giftHint: "Tap the floating gift box to open the portal",
    },
    {
      id: "milestone-9",
      progress: 0.92,
      tag: "Part VIII · Her Secret Room",
      title: "A Room of Roses & Memories",
      body: [
        "It's dark in here... Reach for the switch on the wall to illuminate the room.",
        "Warm golden light reveals fresh red roses across the floor and the memories that matter most."
      ],
      switchPrompt: "Turn on the wall switch",
    },
    {
      id: "milestone-10",
      progress: 1.0,
      tag: "Part IX · The Confession",
      title: "Something I've Kept in My Heart",
      confession: {
        salutation: `Hey, ${defaultGirlNickname}. ❤️`,
        paragraphs: [
          "Six months ago, I didn't know that an unexpected online hello would introduce me to someone I look forward to hearing from every single day.",
          "We've had our clashes, our pride, the moments we disagreed, and the time we stopped talking. We are not two people who pretended to be perfect for each other.",
          "And yet, after all the disagreements and distance, we found our way back to another conversation. You're nonchalant, delightfully dramatic, and wonderfully yourself.",
          "I don't know what the future holds, and I don't want to pretend that five months of online conversations mean I know everything about you. Nor do I assume that you feel what I feel.",
          "But on your eighteenth birthday, I wanted to tell you what has been quietly growing in my heart:",
          "I like you. Truly, honestly, more than just a friend.",
          "I wanted you to know how I feel, with zero pressure, zero expectations, and absolutely no wrong answer.",
          `Happy 18th birthday, ${defaultGirlNickname}. I am genuinely so grateful that our stars crossed.`
        ],
        choices: [
          {
            id: "same",
            label: "I feel the same way 💜",
            responseTitle: "💜 My heart just skipped a beat.",
            responseText: "Hearing that means more to me than words can say. Let's take things slowly, honestly, and explore this chapter together at a pace that feels right for both of us.",
          },
          {
            id: "time",
            label: "I need time to think",
            responseTitle: "⏳ Take all the time you need.",
            responseText: "There is zero rush, ever. Your feelings and your comfort come first. I'm just grateful I could be honest with you today.",
          },
          {
            id: "friend",
            label: "I see you as a friend",
            responseTitle: "🤍 Thank you for your honesty.",
            responseText: "Thank you for being sincere with me. Your friendship and our conversations mean the world to me, your 18th birthday gift is completely yours, and I wish you the happiest year ahead.",
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
      title: "Radiant Smile",
      caption: "The charm and warmth that light up every conversation."
    },
    {
      id: "photo-2",
      src: getAssetUrl("/assets/images/photo2.jpg"),
      title: "A Glimpse of You",
      caption: "Delightfully dramatic, effortlessly herself."
    },
    {
      id: "photo-3",
      src: getAssetUrl("/assets/images/photo3.jpg"),
      title: "Grace & Light",
      caption: "A presence that stayed in my mind across miles of distance."
    },
    {
      id: "photo-4",
      src: getAssetUrl("/assets/images/photo4.jpg"),
      title: "The Quiet Moments",
      caption: "Behind the banter and jokes, a soft and genuine soul."
    },
    {
      id: "photo-5",
      src: getAssetUrl("/assets/images/photo5.jpg"),
      title: "Turning Eighteen",
      caption: "A brand new year, infinite possibilities, and reasons to smile."
    },
    {
      id: "photo-6",
      src: getAssetUrl("/assets/images/photo6.jpg"),
      title: "In Our Universe",
      caption: "The girl who found her way back into my sky."
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
