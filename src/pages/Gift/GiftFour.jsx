import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./GiftFour.css";
import { playMusic } from "../../utils/musicPlayer";

// const PUZZLE_IMAGE =
//   "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&h=900&fit=crop";
const PUZZLE_IMAGE = "/images/giftFour/puzzle.jpg";

const GRID = 3;
const TOTAL = GRID * GRID;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const isSolved = (arr) => arr.every((v, i) => v === i);
const freshShuffle = () => {
  let s;
  do {
    s = shuffle(Array.from({ length: TOTAL }, (_, i) => i));
  } while (isSolved(s));
  return s;
};

/* ----------------- Sounds (Web Audio API) ----------------- */
const useSounds = () => {
  const ctxRef = useRef(null);
  const getCtx = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    return ctxRef.current;
  };
  const beep = useCallback((freq, start, duration = 0.15, type = "sine", gain = 0.15) => {
    const ctx = getCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }, []);
  const playPick = useCallback(() => beep(720, 0, 0.05, "sine", 0.06), [beep]);
  const playSwap = useCallback(() => beep(520, 0, 0.08, "triangle", 0.09), [beep]);
  const playWin = useCallback(() => {
    [[523.25, 0.0], [659.25, 0.12], [783.99, 0.24], [1046.5, 0.4]].forEach(
      ([f, t]) => beep(f, t, 0.35, "triangle", 0.18)
    );
    beep(1567.98, 0.55, 0.5, "sine", 0.1);
    beep(2093.0, 0.7, 0.7, "sine", 0.08);
  }, [beep]);
  const resume = useCallback(() => {
    const ctx = getCtx();
    if (ctx && ctx.state === "suspended") ctx.resume();
  }, []);
  return { playPick, playSwap, playWin, resume };
};

/* ----------------- Decorative layers ----------------- */
const FloatingHearts = () => {
  const items = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8,
        size: 14 + Math.random() * 22,
        opacity: 0.35 + Math.random() * 0.4,
      })),
    []
  );
  return (
    <div className="gf-hearts-layer" aria-hidden="true">
      {items.map((h) => (
        <span
          key={h.id}
          className="gf-heart"
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
  );
};

const Confetti = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2.5 + Math.random() * 3,
        color: ["#ff5c8a", "#ff8fb1", "#ffb3c8", "#ffd6e0", "#ff2d6d", "#ffe066"][i % 6],
        rotate: Math.random() * 360,
        isHeart: i % 3 === 0,
      })),
    []
  );
  return (
    <div className="gf-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`gf-confetti-piece ${p.isHeart ? "heart" : ""}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.isHeart ? "transparent" : p.color,
            color: p.color,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          {p.isHeart ? "♥" : ""}
        </span>
      ))}
    </div>
  );
};

/* ----------------- Main component ----------------- */
const GiftFour = () => {
  const navigate = useNavigate();
  const boardRef = useRef(null);
  const [tiles, setTiles] = useState(() => freshShuffle());
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [drag, setDrag] = useState(null); // { index, startX, startY, dx, dy, hoverIndex }
  const { playPick, playSwap, playWin, resume } = useSounds();

  /* ---- Drag logic (pointer events: mouse + touch) ---- */
  const onPointerDown = (index) => (e) => {
    if (solved) return;
    resume();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({
      index,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
      hoverIndex: index,
    });
    playPick();
  };

  const onPointerMove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    let hoverIndex = drag.index;
    const board = boardRef.current;
    if (board) {
      const rect = board.getBoundingClientRect();
      const cellW = rect.width / GRID;
      const cellH = rect.height / GRID;
      const col = Math.floor((e.clientX - rect.left) / cellW);
      const row = Math.floor((e.clientY - rect.top) / cellH);
      if (col >= 0 && col < GRID && row >= 0 && row < GRID) {
        hoverIndex = row * GRID + col;
      }
    }
    setDrag({ ...drag, dx, dy, hoverIndex });
  };

  const onPointerUp = () => {
    if (!drag) return;
    const { index, hoverIndex } = drag;
    if (hoverIndex !== index) {
      setTiles((prev) => {
        const next = [...prev];
        [next[index], next[hoverIndex]] = [next[hoverIndex], next[index]];
        return next;
      });
      setMoves((m) => m + 1);
      playSwap();
    }
    setDrag(null);
  };

  // Detect solve
  useEffect(() => {
    if (!solved && moves > 0 && isSolved(tiles)) {
      setSolved(true);
      playWin();
      setTimeout(() => setShowCelebration(true), 900);
    }
  }, [tiles, moves, solved, playWin]);

  const handleShuffle = () => {
    setTiles(freshShuffle());
    setMoves(0);
    setSolved(false);
    setShowCelebration(false);
  };

  const goToLetter = () => {
    playMusic("/music/letter-song.mp3");
    navigate("/letter")
  };
  const goBack = () => navigate("/gift");

  /* ---------- Celebration screen (replaces puzzle) ---------- */
  if (showCelebration) {
    return (
      <div className="gf-page gf-celebration-page" data-testid="gift-four-page">
        <FloatingHearts />
        <Confetti />
        <div className="gf-celebration" data-testid="gift-four-celebration">
          <div className="gf-celebration-hearts">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
          </div>
          <h1 className="gf-celebration-title" data-testid="gift-four-congrats-text">
            Congratulations !!
          </h1>
          <p className="gf-celebration-love">
            You solved it <span className="gf-inline-heart">♥</span> just like
            you solve every problem of my life. 🥹
          </p>
          <p className="gf-celebration-msg" data-testid="gift-four-last-text">
            Last but not the least!! Wanna see your last surprise? Click the
            button and have a look love
          </p>
          <button
            className="gf-btn gf-btn-primary gf-next-btn"
            onClick={goToLetter}
            data-testid="gift-four-next-btn"
          >
            See your last surprise <span className="gf-arrow-r">→</span>
          </button>
          <button
            className="gf-btn gf-btn-ghost gf-play-again"
            onClick={handleShuffle}
            data-testid="gift-four-play-again-btn"
          >
            ⟲ Play again
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Puzzle screen ---------- */
  return (
    <div className="gf-page" data-testid="gift-four-page">
      <FloatingHearts />

      <div className="gf-topbar">
        <button
          className="gf-btn gf-btn-ghost"
          onClick={goBack}
          data-testid="gift-four-prev-btn"
        >
          <span className="gf-arrow">←</span> Previous
        </button>

        <div className="gf-stats" data-testid="gift-four-stats">
          <div className="gf-stat">
            <span className="gf-stat-label">Moves</span>
            <span className="gf-stat-value" data-testid="gift-four-moves">
              {moves}
            </span>
          </div>
          <div className="gf-stat">
            <span className="gf-stat-label">Grid</span>
            <span className="gf-stat-value">
              {GRID}×{GRID}
            </span>
          </div>
        </div>
      </div>

      <header className="gf-header">
        <h1 className="gf-title" data-testid="gift-four-title">
          Slide the pieces, my love <span className="gf-title-heart">♥</span>
        </h1>
        <p className="gf-subtitle">
          Drag pieces to swap, or tap and drag onto another tile
        </p>
      </header>

      <main className="gf-main">
        <div
          className="gf-board"
          ref={boardRef}
          data-testid="gift-four-board"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {tiles.map((tile, index) => {
            const row = Math.floor(tile / GRID);
            const col = tile % GRID;
            const posRow = Math.floor(index / GRID);
            const posCol = index % GRID;
            const bgPosX = (col / (GRID - 1)) * 100;
            const bgPosY = (row / (GRID - 1)) * 100;
            const isDragging = drag && drag.index === index;
            const isHovered =
              drag && drag.hoverIndex === index && drag.index !== index;
            const transform = isDragging
              ? `translate(calc(${posCol * 100}% + ${drag.dx}px), calc(${posRow * 100}% + ${drag.dy}px)) scale(1.06)`
              : `translate(${posCol * 100}%, ${posRow * 100}%)`;
            return (
              <button
                key={tile}
                className={`gf-tile ${isDragging ? "dragging" : ""} ${
                  isHovered ? "hovered" : ""
                }`}
                onPointerDown={onPointerDown(index)}
                data-testid={`gift-four-tile-${tile}`}
                style={{
                  backgroundImage: `url(${PUZZLE_IMAGE})`,
                  backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                  backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                  transform,
                }}
                aria-label={`Puzzle piece ${tile + 1}`}
              />
            );
          })}
        </div>

        <aside className="gf-side">
          <div className="gf-preview-card">
            <div className="gf-preview-title">GOAL</div>
            <div
              className="gf-preview-img"
              style={{ backgroundImage: `url(${PUZZLE_IMAGE})` }}
            />
            <div className="gf-preview-hint">Match this picture ♥</div>
          </div>

          <button
            className="gf-btn gf-btn-soft"
            onClick={handleShuffle}
            data-testid="gift-four-shuffle-btn"
          >
            ⟲ Shuffle
          </button>

          <div className="gf-tip">
            <strong>Tip:</strong> Drag any piece onto another to swap them.
          </div>
        </aside>
      </main>
    </div>
  );
};

export default GiftFour;
