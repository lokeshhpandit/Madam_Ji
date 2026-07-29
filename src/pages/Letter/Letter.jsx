import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playMusic, stopMusic } from "../../utils/audioManager";
import {
  ArrowLeft,
  Heart,
  Mail,
  RotateCcw,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import "./Letter.css";

/**
 * Letter — Aesthetic love-letter page
 * Verses appear one at a time: rise in from below, hold, drift up and fade,
 * next verse takes its place — looping softly like a whispered message.
 * Previous button → /gift
 */

// -----------------------------
// The letter, split verse-by-verse
// -----------------------------
const VERSES = [
  {
    type: "line",
    text: (
      <>
        Dear <span className="accent">Love</span>,
      </>
    ),
  },
  {
    type: "line",
    text: (
      <>
        Happy Birthday to someone truly special to my heart... <br></br>
        Meri Radha <br></br>
        My Little Girl <br></br>
        My Dear Wife <br></br>
        My Chunni <br></br>
        Ullu <br></br>

        {/* <span className="heart">
          <Heart size={22} fill="currentColor" />
        </span> */}
      </>
    ),
  },
  {
    type: "line",
    text: (
      <>
        You are <span className="accent">sweet</span>,{" "}
        <span className="accent">lovable</span>, inspiring — and I&apos;m so grateful
        to have you in my life.
      </>
    ),
  },
  {
    type: "line",
    text: (
      <>
        You bring so much warmth and sunshine into every ordinary day.
        Every moment with you is precious.
      </>
    ),
  },
  {
    type: "line",
    text: (
      <>
        On your special day, I wish may Krishna 🕉 bless you with all the happiness ✨, my love 💞, health, success 👩🏻‍⚕️, joy
        you deserve — and every dream your heart silently prays for. May this year bring countless beautiful moments to most beautiful wifey.❤️
      </>
    ),
  },
  {
    type: "line",
    text: (
      <>
        Thank you for always being my biggest supporter,
        <br />
        my safe place, my favourite person and my bestest friend. I am so lucky to have you. 🥹
      </>
    ),
  },
  {
    type: "signature",
    text: (
      <>
        No matter what, I will always be here..supporting you , believing in you and wishing you nothing but the best. Yours, Always & Forever
        <div className="letter-verse__signature">— With all my heart</div>
      </>
    ),
  },
];

const VERSE_DURATION_MS = 4200;

// -----------------------------
// Floating hearts
// -----------------------------
const FloatingHearts = ({ count = 14 }) => {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 12 + Math.random() * 18,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 12,
        tint: Math.random() > 0.5 ? "#d98a86" : "#c99a5b",
      })),
    [count],
  );
  return (
    <div className="letter-hearts" aria-hidden>
      {items.map((h) => (
        <span
          key={h.id}
          className="letter-heart"
          style={{
            left: h.left,
            bottom: "-40px",
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            color: h.tint,
          }}
        >
          <Heart size={h.size} fill="currentColor" strokeWidth={0} />
        </span>
      ))}
    </div>
  );
};

// -----------------------------
// Sparkles
// -----------------------------
const Sparkles2 = ({ count = 16 }) => {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 2.5 + Math.random() * 3,
        delay: Math.random() * 5,
        size: 3 + Math.random() * 5,
      })),
    [count],
  );
  return (
    <div className="letter-sparkles" aria-hidden>
      {items.map((s) => (
        <span
          key={s.id}
          className="letter-sparkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// -----------------------------
// Ornate corner (reused from GiftThree style)
// -----------------------------
const OrnateCorner = ({ className = "" }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <defs>
      <linearGradient id="letterGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e8c78b" />
        <stop offset="60%" stopColor="#c99a5b" />
        <stop offset="100%" stopColor="#8a6a2a" />
      </linearGradient>
    </defs>
    <path
      d="M4 4 L34 4 C 22 4, 18 8, 14 14 C 8 20, 4 24, 4 36 Z"
      fill="url(#letterGold)"
      opacity="0.9"
    />
    <path
      d="M10 10 C 22 10, 28 16, 28 28"
      stroke="url(#letterGold)"
      strokeWidth="1.1"
      fill="none"
    />
    <circle cx="28" cy="28" r="2" fill="#e8c78b" />
    <path
      d="M4 42 C 10 42, 14 46, 16 52 C 18 58, 22 62, 28 62"
      stroke="url(#letterGold)"
      strokeWidth="0.9"
      fill="none"
      opacity="0.7"
    />
  </svg>
);

// -----------------------------
// Main
// -----------------------------
export default function Letter() {
  const [opened, setOpened] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    playMusic("/music/letter-song.mp3", {
      loop: true,
      volume: 0.35,
    });

    return () => {
      stopMusic();
    };
  }, []);

  // Auto-open envelope after a short beat
  useEffect(() => {
    const t = setTimeout(() => setOpened(true), 700);
    return () => clearTimeout(t);
  }, []);

  // Cycle verses
  useEffect(() => {
    if (!opened || paused || done) return;
    const t = setTimeout(() => {
      setIndex((i) => {
        if (i + 1 >= VERSES.length) {
          setDone(true);
          return i;
        }
        return i + 1;
      });
    }, VERSE_DURATION_MS);
    return () => clearTimeout(t);
  }, [opened, index, paused, done]);

  const replay = () => {
    setIndex(0);
    setDone(false);
    setPaused(false);
  };

  const current = VERSES[index];

  return (
    <div className="letter-page" data-testid="letter-page">
      {/* Floating decorations */}
      <FloatingHearts count={16} />
      <Sparkles2 count={22} />

      {/* Header */}
      <header className="letter-header">
        <Link
          to="/gift"
          data-testid="letter-prev-button"
          className="letter-back-btn"
        >
          <span className="letter-back-btn__icon">
            <ArrowLeft size={16} strokeWidth={2.5} />
          </span>
          <span className="letter-back-btn__text">Previous</span>
        </Link>

        <div className="letter-header-title cinzel">
          <Sparkles size={14} />
          <span>A Letter</span>
          <Sparkles size={14} />
        </div>
      </header>

      {/* Stage */}
      <main className="letter-stage" data-testid="letter-stage">
        {/* Title */}
        <motion.div
          className="letter-title-wrap"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="letter-eyebrow cinzel">Just for you</div>
          <h1 className="letter-title" data-testid="letter-title">
            A Message From My Heart
          </h1>
          <div className="letter-title-divider">
            <span className="line" />
            <Heart size={14} fill="currentColor" />
            <span className="line" />
          </div>
        </motion.div>

        {/* Envelope reveal */}
        <AnimatePresence>
          {!opened && (
            <motion.div
              key="envelope"
              className="letter-envelope-wrap"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={`letter-envelope ${opened ? "is-open" : ""}`}
                data-testid="letter-envelope"
                onClick={() => setOpened(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setOpened(true)
                }
              >
                <div className="letter-envelope__body">Open me…</div>
                <div className="letter-envelope__flap" />
                <div className="letter-envelope__seal">
                  <Heart size={20} fill="currentColor" />
                </div>
              </div>
              <div className="letter-envelope__hint cinzel">
                Tap to open
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paper + verses */}
        <AnimatePresence>
          {opened && (
            <motion.div
              key="paper"
              className="letter-paper"
              data-testid="letter-paper"
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <OrnateCorner className="letter-paper__corner tl" />
              <OrnateCorner className="letter-paper__corner tr" />
              <OrnateCorner className="letter-paper__corner bl" />
              <OrnateCorner className="letter-paper__corner br" />

              {/* Verse stage — one at a time, rises in / floats up out */}
              <div
                className="letter-verse-stage"
                data-testid="letter-verse-stage"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    className="letter-verse"
                    initial={{ opacity: 0, y: 60, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -70, filter: "blur(6px)" }}
                    transition={{
                      duration: 1.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div
                      className={
                        current.type === "signature"
                          ? "letter-verse__text script"
                          : "letter-verse__text"
                      }
                      data-testid={`letter-verse-${index}`}
                    >
                      {current.text}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress dots */}
              <div
                className="letter-progress"
                data-testid="letter-progress"
                role="tablist"
                aria-label="Letter progress"
              >
                {VERSES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`letter-progress__dot ${i === index ? "is-active" : ""}`}
                    onClick={() => {
                      setIndex(i);
                      setDone(false);
                    }}
                    aria-label={`Go to verse ${i + 1}`}
                    data-testid={`letter-dot-${i}`}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="letter-controls">
                {!done ? (
                  <button
                    type="button"
                    className="letter-btn"
                    onClick={() => setPaused((p) => !p)}
                    data-testid="letter-pause-toggle"
                  >
                    {paused ? <Play size={14} /> : <Pause size={14} />}
                    <span>{paused ? "Resume" : "Pause"}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="letter-btn letter-btn--primary"
                    onClick={replay}
                    data-testid="letter-replay"
                  >
                    <RotateCcw size={14} />
                    <span>Read Again</span>
                  </button>
                )}
                <a
                  href="/gift"
                  className="letter-btn"
                  data-testid="letter-close"
                >
                  <Mail size={14} />
                  <span>Close Letter</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
