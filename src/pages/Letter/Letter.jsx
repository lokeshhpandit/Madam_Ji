import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Letter.css";

/**
 * Basic Letter.jsx — a placeholder love letter page.
 * You can expand this later with a proper letter, animations, music, etc.
 */
const Letter = () => {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  return (
    <div className="letter-page" data-testid="letter-page">
      <button
        className="letter-back-btn"
        onClick={() => navigate("/gift")}
        data-testid="letter-prev-btn"
      >
        ← Previous
      </button>

      <div
        className={`envelope ${opened ? "opened" : ""}`}
        onClick={() => !opened && setOpened(true)}
        data-testid="letter-envelope"
      >
        <div className="envelope-flap" />
        <div className="envelope-body">
          <div className="envelope-heart">♥</div>
        </div>

        <div className="letter-paper" data-testid="letter-paper">
          <h1 className="letter-title">To my love ♥</h1>
          <p className="letter-text">
            Every moment with you feels like the best gift I've ever received.
            You make ordinary days feel like little celebrations, and I can't
            imagine my world without your smile in it.
          </p>
          <p className="letter-text">
            Thank you for being you — kind, magical, and endlessly loved.
            Happy day, my forever ♥
          </p>
          <p className="letter-sign">— Yours, always</p>
        </div>
      </div>

      {!opened && (
        <p className="letter-hint" data-testid="letter-hint">
          Tap the envelope to open your letter
        </p>
      )}
    </div>
  );
};

export default Letter;
