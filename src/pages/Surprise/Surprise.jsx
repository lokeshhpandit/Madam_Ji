import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/Surprise.css";
import { playMusic, stopMusic } from "../../utils/musicPlayer";

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
  const hearts = Array.from({ length: 22 }).map((_, i) => ({
    id: i,
    left: rand() * 100,
    delay: rand() * 8,
    duration: 8 + rand() * 8,
    size: 12 + rand() * 18,
    opacity: 0.35 + rand() * 0.55,
  }));

  const palette = ["#ff8fb1", "#ffd166", "#ff6f91", "#c56cf0", "#ffb3c1", "#f78fb3"];
  const balloons = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    left: 5 + i * 16 + rand() * 4,
    delay: rand() * 5,
    duration: 12 + rand() * 6,
    color: palette[i % palette.length],
  }));

  return { hearts, balloons };
};

const Surprise = () => {
  const navigate = useNavigate();

  // Lazy initializers -> pure during render (only runs once at mount).
  const [{ hearts, balloons }] = useState(buildDecor);
  useEffect(() => {
    playMusic("/music/lover.mp3", {
      loop: true,
      volume: 0.6,
    });

    return () => {
      stopMusic();
    };
  }, []);

  // const handleOpen = () => {
  //   navigate("/catch-heart");
  // };
  const handleOpen = () => {
    playMusic("/music/Catch-heart.mp3");
    navigate("/catch-heart");
  };

  return (
    <div className="surprise-root"> 

      {/* Floating hearts + balloons */}
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
            <span className="balloon-body" style={{ background: b.color }} />
            <span className="balloon-string" />
          </span>
        ))}
      </div>

      {/* Main card */}
      <div className="card-wrapper">
        <div className="surprise-card">
          <div className="card-inner">
            <h1 className="card-title">Hey Beautiful</h1>
            <p className="card-message">
              Every birthday tells a story,<br />
              Yours is my favorite chapter yet.<br />
              This surprise is only a small reminder,<br />
              Of a heart that will never forget. 💖<br />
            </p>
            <button
              type="button"
              onClick={handleOpen}
              className="open-btn"
            >
              <span>Open Your Surprise Love</span>
              <Heart size={16} fill="#ff4d7a" color="#ff4d7a" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surprise;
