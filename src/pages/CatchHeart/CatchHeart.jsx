import React, { useState, useEffect, useCallback, useRef } from "react";
import { Heart, Cake, Sparkles, Gift, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/CatchHeart.css";
import { playMusic } from "../../utils/musicPlayer";

const TARGET = 5;

// Small deterministic pseudo-random helper (seeded once at mount) to satisfy
// React 19 purity rules while still producing varied decor placement.
const seededRandom = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const buildDecor = () => {
  const rand = seededRandom(Date.now());
  const hearts = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    left: rand() * 100,
    delay: rand() * 8,
    duration: 9 + rand() * 8,
    size: 12 + rand() * 16,
    opacity: 0.3 + rand() * 0.5,
  }));
  return { hearts };
};

const CatchHeart = () => {
  const navigate = useNavigate();
  const [{ hearts: decorHearts }] = useState(buildDecor);

  const [caught, setCaught] = useState(0);
  const [pos, setPos] = useState({ top: 55, left: 25 });
  const [pop, setPop] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const areaRef = useRef(null);

  const moveHeart = useCallback(() => {
    // Random new position within the play area, keeping the heart fully inside.
    const nextLeft = 8 + Math.random() * 78; // 8% - 86%
    const nextTop = 15 + Math.random() * 65; // 15% - 80%
    setPos({ top: nextTop, left: nextLeft });
  }, []);

  // Auto move heart around every ~1.4s so it feels alive
  useEffect(() => {
    if (showReveal) return undefined;
    const id = setInterval(moveHeart, 1400);
    return () => clearInterval(id);
  }, [moveHeart, showReveal]);


  const handleCatch = (e) => {
    e.stopPropagation();
    if (showReveal) return;
    setPop(true);
    setTimeout(() => setPop(false), 220);
    setCaught((c) => {
      const next = c + 1;
      if (next >= TARGET) {
        // trigger reveal shortly after final catch
        setTimeout(() => setShowReveal(true), 350);
      }
      return Math.min(next, TARGET);
    });
    moveHeart();
  };

  const progressPct = Math.min((caught / TARGET) * 100, 100);

  return (
    <div className="catch-root">

      {/* Background decor hearts */}
      <div className="catch-decor" aria-hidden="true">
        {decorHearts.map((h) => (
          <span
            key={h.id}
            className="catch-decor-heart"
            style={{
              left: `${h.left}%`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
              opacity: h.opacity,
            }}
          >
            <Heart
              size={h.size}
              fill="#ff8fb1"
              color="#ff8fb1"
              strokeWidth={1.5}
            />
          </span>
        ))}
      </div>

      <div className="catch-card-wrapper">
        <div className={`catch-card ${showReveal ? "catch-card--reveal" : ""}`}>
          {!showReveal ? (
            <>
              <h1 className="catch-title">Not So Fast, Birthday Girl !😁🎂 First, catch my heart 🫣</h1>
              <p className="catch-subtitle">
                Click the floating heart {TARGET} times to unlock your
                birthday wish.
              </p>

              <div className="catch-counter">
                <span className="catch-counter-label">
                  Caught: {caught}/{TARGET}
                </span>
                <div className="catch-progress">
                  <div
                    className="catch-progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="catch-play-area" ref={areaRef}>
                <button
                  type="button"
                  className={`catch-heart-btn ${pop ? "catch-heart-btn--pop" : ""}`}
                  style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                  onClick={handleCatch}
                  aria-label="Catch the heart"
                >
                  <span className="catch-heart-emoji" role="img" aria-hidden="true">
                    <Heart size={26} fill="#ff4d7a" color="#ff4d7a" />
                    <Sparkles
                      size={12}
                      color="#ffd166"
                      className="catch-heart-spark"
                    />
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="catch-reveal">
              <div className="catch-reveal-icons">
                <Cake size={28} color="#ff4d7a" />
                <Sparkles size={26} color="#ffb703" />
                <Gift size={28} color="#c56cf0" />
              </div>
              <h1 className="catch-reveal-title">Happy Birthday Chunni </h1>
              <p className="catch-reveal-message">
                Looks like someone already knows how to play with my heart. 😒💖
                I knew it! You've been stealing my heart all along, and now you've got proof. 😤💕<br></br>
                Mission accomplished! You caught my heart 5 times. Now promise you'll handle it gently. 😏❤️
              </p>
              <p className="catch-reveal-signature">
                <PartyPopper size={16} color="#ff4d7a" />
                <span>I Love You My Mansi urff meri Radha</span>
                <Heart size={14} fill="#ff4d7a" color="#ff4d7a" />
              </p>
              <div className="catch-reveal-actions">
                <button
                  type="button"
                  className="catch-btn-primary"
                  onClick={() => {
                    setCaught(0);
                    setShowReveal(false);
                    moveHeart();
                  }}
                >
                  <Sparkles size={16} />
                  <span>Play again (Please Don't 🥲) </span>
                </button>
                <button
                  type="button"
                  className="catch-btn-ghost"
                  // onClick={() => navigate("/Cake")}
                  onClick={() => {
                    playMusic("/music/cracker.mp3");
                    navigate("/Cake");
                  }}
                >
                  Let's cut the cake baby 🎂
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showReveal && (
        <div className="catch-confetti" aria-hidden="true">
          {Array.from({ length: 40 }).map((_, i) => {
            const left = (i * 2.5) % 100;
            const delay = (i % 10) * 0.08;
            const duration = 2.4 + ((i * 37) % 20) / 10;
            const colors = [
              "#ff6f91",
              "#ffd166",
              "#ff8fb1",
              "#c56cf0",
              "#ffffff",
              "#ff9ec7",
            ];
            const bg = colors[i % colors.length];
            return (
              <span
                key={i}
                className="catch-confetti-piece"
                style={{
                  left: `${left}%`,
                  background: bg,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatchHeart;
