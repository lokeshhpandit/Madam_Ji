import React, { useState, useEffect, useMemo } from "react";
import { Heart, Cake, Sparkles, Gift, PartyPopper, X } from "lucide-react";
import "../../styles/Surprise.css";

const Surprise = () => {
  const [opened, setOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Pre-compute floating decoration positions so they don't re-randomize on every render
  const hearts = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8,
        size: 12 + Math.random() * 18,
        opacity: 0.35 + Math.random() * 0.55,
      })),
    []
  );

  const balloons = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        left: 5 + i * 16 + Math.random() * 4,
        delay: Math.random() * 5,
        duration: 12 + Math.random() * 6,
        color: ["#ff8fb1", "#ffd166", "#ff6f91", "#c56cf0", "#ffb3c1", "#f78fb3"][i % 6],
      })),
    []
  );

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2 + Math.random() * 2.5,
        rotate: Math.random() * 360,
        color: ["#ff6f91", "#ffd166", "#ff8fb1", "#c56cf0", "#ffffff", "#ff9ec7"][
          i % 6
        ],
        size: 6 + Math.random() * 8,
      })),
    []
  );

  const handleOpen = () => {
    setOpened(true);
    setShowConfetti(true);
    // stop confetti generation after animation completes (pieces will fall off)
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleClose = () => {
    setOpened(false);
  };

  // Keep confetti active while surprise is open by re-triggering on mount changes
  useEffect(() => {
    if (opened) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(t);
    }
  }, [opened]);

  return (
    <div className="surprise-root">
      {/* Floating hearts */}
      <div className="decor-layer" aria-hidden="true">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="floating-heart"
            style={{
              left: `${h.left}%`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
              opacity: h.opacity,
            }}
          >
            <Heart
              size={h.size}
              fill="#ff6f91"
              color="#ff6f91"
              strokeWidth={1.5}
            />
          </span>
        ))}

        {/* Balloons */}
        {balloons.map((b) => (
          <span
            key={`b-${b.id}`}
            className="floating-balloon"
            style={{
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          >
            <span
              className="balloon-body"
              style={{ background: b.color }}
            />
            <span className="balloon-string" />
          </span>
        ))}
      </div>

      {/* Main card */}
      <div className="card-wrapper">
        <div className={`surprise-card ${opened ? "card-opened" : ""}`}>
          {!opened ? (
            <div className="card-inner">
              <h1 className="card-title">Hey Beautiful</h1>
              <p className="card-message">
                Today is not just another day. It is the day my favorite
                person came into this world.
              </p>
              <button
                type="button"
                onClick={handleOpen}
                className="open-btn"
              >
                <span>Open Your Surprise</span>
                <Heart size={16} fill="#ff4d7a" color="#ff4d7a" />
              </button>
            </div>
          ) : (
            <div className="card-inner surprise-reveal">
              <button
                type="button"
                onClick={handleClose}
                className="close-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="gift-icons">
                <Cake size={28} color="#ff4d7a" />
                <Sparkles size={26} color="#ffb703" />
                <Gift size={28} color="#c56cf0" />
              </div>

              <h1 className="reveal-title">Happy Birthday!</h1>
              <p className="reveal-message">
                On your special day, I want you to know how much light you
                bring into this world. May your year ahead be filled with
                laughter, love, and every little thing that makes you smile.
              </p>
              <p className="reveal-signature">
                <PartyPopper size={16} color="#ff4d7a" />
                <span>Made with love, just for you</span>
                <Heart size={14} fill="#ff4d7a" color="#ff4d7a" />
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowConfetti(false);
                  // restart confetti
                  setTimeout(() => setShowConfetti(true), 30);
                }}
                className="celebrate-btn"
              >
                <Sparkles size={16} />
                <span>Celebrate again</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confetti burst */}
      {showConfetti && (
        <div className="confetti-layer" aria-hidden="true">
          {confettiPieces.map((c) => (
            <span
              key={c.id}
              className="confetti-piece"
              style={{
                left: `${c.left}%`,
                background: c.color,
                width: `${c.size}px`,
                height: `${c.size * 0.4}px`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                transform: `rotate(${c.rotate}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Surprise;
