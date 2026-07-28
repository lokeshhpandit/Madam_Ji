import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Gifts.css";
import HeartCursorTrail from "../../components/HeartCursorTrail/HeartCursorTrail";

const GIFTS = [
  { id: 1, path: "/gift/1",   color: "#ff6b9d", ribbon: "#fff1c1", emoji: "💖" },
  { id: 2, path: "/gift/3",   color: "#7ec8e3", ribbon: "#ffd6e0", emoji: "🌟" },
  { id: 3, path: "/gift/2", color: "#c8a2ff", ribbon: "#fff1c1", emoji: "🎂" },
  { id: 4, path: "/gift/4",  color: "#ffb347", ribbon: "#ffe0f0", emoji: "🎈" },
];

// Message split into lines, then lines split into words for staggered drop-in
const MESSAGE_LINES = [
  "Inside these gifts is my love & my prayers....🐥🐥",
  " Wrapped with love, tied with care ",
  "A little surprise I'd love to share",
  "May this gift bring joy to you, Happy Birthday my Love",
  "I really hope — all your dreams come true 💫",
  "",
];


const openedGifts = new Set();

function GiftBox({ gift, opened, onOpen }) {

  return (
    
    <button
      type="button"
      className={`gift ${opened ? "gift--opened" : ""}`}
      style={{ "--gift-color": gift.color, "--gift-ribbon": gift.ribbon }}
      onClick={() => onOpen(gift)}
      data-testid={`gift-box-${gift.id}`}
      aria-label={`Open gift ${gift.id}`}
    >
      <div className="gift__lid" data-testid={`gift-lid-${gift.id}`}>
        <div className="gift__ribbon-h" />
        <div className="gift__bow">
          <span className="gift__bow-left" />
          <span className="gift__bow-right" />
          <span className="gift__bow-knot" />
        </div>
      </div>
      <div className="gift__box">
        <div className="gift__ribbon-v" />
        <div className="gift__peek" aria-hidden="true">
          <span className="gift__emoji">{gift.emoji}</span>
        </div>
      </div>
      <div className="gift__shadow" />
    </button>
  );
}

/* Word-by-word drop-in message */
function DropInMessage() {
  let wordIndex = 0;
  return (
    <div className="gifts-message" data-testid="gifts-message">
      {MESSAGE_LINES.map((line, lineIdx) => (
        <p className="gifts-message__line" key={lineIdx}>
          {line.split(" ").map((word, i) => {
            const delay = wordIndex * 0.09 + 0.2;
            wordIndex += 1;
            return (
              <span
                className="gifts-message__word"
                style={{ animationDelay: `${delay}s` }}
                key={`${lineIdx}-${i}`}
              >
                {word}
                {i < line.split(" ").length - 1 ? "\u00A0" : ""}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

export default function Gifts() {
  const navigate = useNavigate();

  // Seed React state from the module-level Set so any previously-opened
  // boxes appear opened when the user comes back to this page.
  const [openedIds, setOpenedIds] = useState(() => new Set(openedGifts));

  const handleOpen = (gift) => {
    // 1) Persist the opened state
    openedGifts.add(gift.id);
    // 2) Trigger a re-render so the lid animates open
    setOpenedIds(new Set(openedGifts));
    // 3) After the lid animation plays, navigate to that gift's page
    setTimeout(() => navigate(gift.path), 500);
  };

  return (
    <div className="gifts-page" data-testid="gifts-page">
       <HeartCursorTrail />
      <div className="gifts-page__confetti" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${(i * 97) % 100}%`,
              animationDelay: `${(i % 10) * 0.4}s`,
              backgroundColor: [
                "#ff6b9d",
                "#7ec8e3",
                "#c8a2ff",
                "#ffb347",
                "#8ed6a1",
                "#fff1c1",
              ][i % 6],
            }}
          />
        ))}
      </div>

      <header className="gifts-header">
        <button
          type="button"
          className="gifts-back"
          onClick={() => navigate("/cake")}
          data-testid="gifts-back-button"
        >
          ← Back to the cake
        </button>
        <h1 className="gifts-title" data-testid="gifts-title">
          Your 24th Birthday Gifts 🐣
        </h1>
        <p className="gifts-subtitle" data-testid="gifts-subtitle">
          From your Chuza  🐣✨
        </p>
      </header>

      <main className="gifts-grid gifts-grid--four" data-testid="gifts-grid">
        {GIFTS.map((gift) => (
          <GiftBox
            key={gift.id}
            gift={gift}
            opened={openedIds.has(gift.id)}
            onOpen={handleOpen}
          />
        ))}
      </main>

      <DropInMessage />
    </div>
  );
}
