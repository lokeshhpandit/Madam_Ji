import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/intro.css";

// TODO: swap this placeholder with your own photo
const PHOTO_SRC = "/images/intro-photo.jpg";

const TARGET_DATE = new Date("2026-07-30T00:00:00").getTime();
const PASSCODE = "1730";

const pad = (n) => String(n).padStart(2, "0");

const getRemaining = () => {
  const diff = TARGET_DATE - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, ended: false };
};

const HEART_COUNT = 18;

export default function IntroPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(getRemaining);
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);
  const [toast, setToast] = useState("");
  const [emojiBurst, setEmojiBurst] = useState(false);
  const musicRef = useRef(null);
  const crackerRef = useRef(null);
  const unmutedRef = useRef(false);

  // Countdown ticker
  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  // Attempt autoplay on mount (browsers only allow autoplay while MUTED).
  // Music silently starts playing so the first user gesture just unmutes.
  useEffect(() => {
    const el = musicRef.current;
    if (!el) return;
    el.muted = true;
    el.volume = 0.55;
    const p = el.play();
    if (p && typeof p.then === "function") {
      p.catch(() => {
        /* autoplay blocked — will retry on first interaction */
      });
    }
  }, []);

  // Play cracker sound & pause music once countdown ends
  useEffect(() => {
    if (time.ended && crackerRef.current) {
      try {
        crackerRef.current.currentTime = 0;
        crackerRef.current.play().catch(() => {});
      } catch (_) {
        /* noop */
      }
      if (musicRef.current) {
        musicRef.current.pause();
      }
    }
  }, [time.ended]);

  // Stop music on unmount (navigating away)
  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }
    };
  }, []);

  // Unmute (or start) music on first user interaction anywhere on the page
  const activateMusic = useCallback(() => {
    if (unmutedRef.current) return;
    if (time.ended) return;
    const el = musicRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 0.55;
    // If autoplay was blocked earlier, this play() will now succeed due to gesture
    const p = el.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        unmutedRef.current = true;
      }).catch(() => {
        /* still blocked, try again on next gesture */
      });
    } else {
      unmutedRef.current = true;
    }
  }, [time.ended]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const handleKey = useCallback(
    (digit) => {
      activateMusic();
      if (code.length >= 4) return;
      const next = code + digit;
      setCode(next);
      if (next.length === 4) {
        setTimeout(() => {
          const isCorrect = next === PASSCODE;
          const isRevealed = Date.now() >= TARGET_DATE;

          if (isCorrect && isRevealed) {
            if (musicRef.current) musicRef.current.pause();
            navigate("/birthday");
            return;
          }

          if (isCorrect && !isRevealed) {
            // Correct code but the day hasn't arrived — gently gate the door
            showToast("Right code, wrong time 💝 Wait for July 30, 2026");
            setTimeout(() => setCode(""), 900);
            return;
          }

          // Wrong code
          setWrong(true);
          setEmojiBurst(true);
          showToast("Oops! Wrong code, try again 💔");
          setTimeout(() => {
            setWrong(false);
            setCode("");
            setEmojiBurst(false);
          }, 900);
        }, 180);
      }
    },
    [code, navigate, activateMusic]
  );

  const handleClear = () => {
    activateMusic();
    setCode("");
  };

  const handleBackspace = () => {
    activateMusic();
    setCode((c) => c.slice(0, -1));
  };

  const hearts = useMemo(
    () =>
      Array.from({ length: HEART_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 10,
        size: 14 + Math.random() * 22,
        opacity: 0.35 + Math.random() * 0.5,
      })),
    []
  );

  const crackers = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        top: Math.random() * 80 + 5,
        left: Math.random() * 90 + 5,
        delay: Math.random() * 2.5,
        hue: Math.floor(Math.random() * 360),
      })),
    [time.ended]
  );

  return (
    <div
      className="intro-root"
      data-testid="intro-page"
      onClick={activateMusic}
      onTouchStart={activateMusic}
    >
      {/* Background music — placed by you at public/birthday-song.mp3 */}
      <audio ref={musicRef} src="/birthday-song.mp3" loop preload="auto" playsInline />
      <audio ref={crackerRef} src="/cracker.mp3" preload="auto" playsInline />

      {/* Floating hearts layer */}
      <div className="hearts-layer" aria-hidden="true">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="heart"
            style={{
              left: `${h.left}%`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
              fontSize: `${h.size}px`,
              opacity: h.opacity,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Crackers layer (only after countdown ends) */}
      {time.ended && (
        <div className="crackers-layer" aria-hidden="true" data-testid="crackers-layer">
          {crackers.map((c) => (
            <div
              key={c.id}
              className="cracker"
              style={{
                top: `${c.top}%`,
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className="spark"
                  style={{
                    "--rot": `${i * 30}deg`,
                    background: `hsl(${(c.hue + i * 20) % 360} 90% 60%)`,
                    color: `hsl(${(c.hue + i * 20) % 360} 90% 60%)`,
                    animationDelay: `${c.delay}s`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Photo card centered top */}
      <div className="photo-wrap">
        <div className="photo-card" data-testid="photo-card">
          <div className="photo-inner">
            <img src={PHOTO_SRC} alt="Special someone" />
          </div>
          <div className="photo-caption">Forever Mine ❤️</div>
        </div>
      </div>

      {/* Main split content */}
      <div className="content-grid">
        {/* Left panel */}
        <div className="left-panel">
          {!time.ended ? (
            <div className="countdown-block" data-testid="countdown-block">
              <div className="countdown-title">Counting down to your day</div>
              <div className="countdown-pills">
                {[
                  { label: "Days", value: time.days },
                  { label: "Hours", value: pad(time.hours) },
                  { label: "Minutes", value: pad(time.minutes) },
                  { label: "Seconds", value: pad(time.seconds) },
                ].map((p) => (
                  <div key={p.label} className="pill">
                    <div className="pill-value" data-testid={`countdown-${p.label.toLowerCase()}`}>
                      {p.value}
                    </div>
                    <div className="pill-label">{p.label}</div>
                  </div>
                ))}
              </div>
              <div className="countdown-sub">July 30, 2026 · 12:00 AM</div>
            </div>
          ) : (
            <div className="birthday-block" data-testid="birthday-message">
              <div className="hb-eyebrow">✦ It&apos;s finally here ✦</div>
              <h1 className="hb-title">
                <span>Happy</span>
                <span>Birthday</span>
                <span className="hb-cake">🎂</span>
              </h1>
              <p className="hb-sub">
                A whole universe made just for you — unlock the surprise on the right.
              </p>
              <div className="sparkles">
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
              </div>
            </div>
          )}
        </div>

        {/* Right panel: keypad */}
        <div className="right-panel">
          <div
            className={`keypad-card ${wrong ? "shake" : ""}`}
            data-testid="keypad-card"
          >
            <div className="keypad-header">
              <div className="keypad-title">Enter the secret code</div>
              <div className="keypad-hint">4 digits · made with love</div>
            </div>

            <div className="slots" data-testid="passcode-slots">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`slot ${code.length > i ? "filled" : ""} ${
                    wrong ? "slot-wrong" : ""
                  }`}
                  data-testid={`slot-${i}`}
                >
                  <span>{code[i] ? "●" : ""}</span>
                </div>
              ))}
            </div>

            {emojiBurst && (
              <div className="emoji-burst" data-testid="emoji-burst">
                <span>❌</span>
                <span>💔</span>
                <span>😢</span>
              </div>
            )}

            <div className="keys">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  className="key"
                  data-testid={`key-${n}`}
                  onClick={() => handleKey(String(n))}
                  type="button"
                >
                  {n}
                </button>
              ))}
              <button
                className="key key-secondary"
                data-testid="key-clear"
                onClick={handleClear}
                type="button"
              >
                C
              </button>
              <button
                className="key"
                data-testid="key-0"
                onClick={() => handleKey("0")}
                type="button"
              >
                0
              </button>
              <button
                className="key key-secondary"
                data-testid="key-back"
                onClick={handleBackspace}
                type="button"
              >
                ⌫
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast" data-testid="toast-error" role="alert">
          {toast}
        </div>
      )}
    </div>
  );
}
