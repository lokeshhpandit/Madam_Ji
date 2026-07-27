import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Gifts.css";

const GIFTS = [
  { id: 1, color: "#ff6b9d", ribbon: "#fff1c1", emoji: "💖", message: "You are loved beyond measure." },
  { id: 2, color: "#7ec8e3", ribbon: "#ffd6e0", emoji: "🌟", message: "May all your wishes come true this year!" },
  { id: 3, color: "#c8a2ff", ribbon: "#fff1c1", emoji: "🎂", message: "A slice of joy, just for you." },
  { id: 4, color: "#ffb347", ribbon: "#ffe0f0", emoji: "🎈", message: "Sending you a bouquet of happy moments." },
  { id: 5, color: "#8ed6a1", ribbon: "#ffd6e0", emoji: "🦄", message: "Keep sparkling like the magical soul you are." },
  { id: 6, color: "#ff8fab", ribbon: "#fff1c1", emoji: "🍰", message: "Life is short — eat cake first!" },
];

function GiftBox({ gift, opened, onOpen }) {
  return (
    <button
      type="button"
      className={`gift ${opened ? "gift--opened" : ""}`}
      style={{ "--gift-color": gift.color, "--gift-ribbon": gift.ribbon }}
      onClick={() => onOpen(gift.id)}
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
        <div
          className="gift__reveal"
          data-testid={`gift-reveal-${gift.id}`}
        >
          <span className="gift__emoji" aria-hidden="true">{gift.emoji}</span>
          <span className="gift__message">{gift.message}</span>
        </div>
      </div>
      <div className="gift__shadow" />
    </button>
  );
}

export default function Gifts() {
  const navigate = useNavigate();
  const [openedIds, setOpenedIds] = useState(() => new Set());

  const handleOpen = (id) => {
    setOpenedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openedCount = openedIds.size;
  const allOpened = openedCount === GIFTS.length;

  return (
    <div className="gifts-page" data-testid="gifts-page">
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
          onClick={() => navigate("/")}
          data-testid="gifts-back-button"
        >
          ← Back to the cake
        </button>
        <h1 className="gifts-title" data-testid="gifts-title">
          Your Birthday Gifts
        </h1>
        <p className="gifts-subtitle" data-testid="gifts-subtitle">
          Tap a box to unwrap {allOpened ? "— you opened them all! 🎉" : `(${openedCount}/${GIFTS.length} opened)`}
        </p>
      </header>

      <main className="gifts-grid" data-testid="gifts-grid">
        {GIFTS.map((gift) => (
          <GiftBox
            key={gift.id}
            gift={gift}
            opened={openedIds.has(gift.id)}
            onOpen={handleOpen}
          />
        ))}
      </main>

      {allOpened && (
        <div className="gifts-finale" data-testid="gifts-finale">
          <p>Every gift is a wish, every wish a hug. Happy Birthday! 🎂</p>
        </div>
      )}
    </div>
  );
}
