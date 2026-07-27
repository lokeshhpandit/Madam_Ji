import { useEffect } from "react";
import "../../styles/HeartCursorTrail.css";

/**
 * Drops floating hearts wherever the cursor moves.
 * Drop this ONCE at the top of your app (e.g. inside <App /> or your root layout)
 * so the effect works across every page.
 *
 * Props:
 *   density  – lower = more hearts (default 18px between spawns)
 *   colors   – array of heart colours
 *   lifespan – how long each heart lives in ms (default 1200)
 */
export default function HeartCursorTrail({
  density = 18,
  colors = ["#ff4d8f", "#ff6b9d", "#ff8fab", "#ffb3c6", "#ff5e94", "#e91e63"],
  lifespan = 1200,
}) {
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let firstMove = true;

    const HEARTS = ["♥", "❤", "💖", "💗", "💓"];

    const spawnHeart = (x, y) => {
      const heart = document.createElement("span");
      heart.className = "heart-trail";
      heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];

      // Random visual variation
      const size = 14 + Math.random() * 18;         // 14 – 32 px
      const drift = (Math.random() - 0.5) * 80;     // horizontal drift
      const rise = 40 + Math.random() * 60;         // upward travel
      const rot = (Math.random() - 0.5) * 60;       // rotation
      const color = colors[Math.floor(Math.random() * colors.length)];

      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.color = color;
      heart.style.fontSize = `${size}px`;
      heart.style.setProperty("--drift", `${drift}px`);
      heart.style.setProperty("--rise", `${-rise}px`);
      heart.style.setProperty("--rot", `${rot}deg`);
      heart.style.setProperty("--life", `${lifespan}ms`);

      document.body.appendChild(heart);

      // clean up after animation ends
      setTimeout(() => heart.remove(), lifespan + 50);
    };

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (firstMove) {
        lastX = x;
        lastY = y;
        firstMove = false;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);

      // Only spawn once cursor has moved enough — controls density
      if (dist >= density) {
        spawnHeart(x, y);
        lastX = x;
        lastY = y;
      }
    };

    // Touch support (mobile) – hearts follow finger
    const onTouch = (e) => {
      if (!e.touches.length) return;
      const t = e.touches[0];
      onMove({ clientX: t.clientX, clientY: t.clientY });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      // remove any lingering hearts on unmount
      document.querySelectorAll(".heart-trail").forEach((el) => el.remove());
    };
  }, [density, colors, lifespan]);

  return null;
}
