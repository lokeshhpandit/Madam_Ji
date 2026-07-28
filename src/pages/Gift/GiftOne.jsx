import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./GiftOne.css";

/**
 * GiftOne — "Sweet Moments"
 * Drop your 6 media files into: public/images/giftOne/
 *   1.jpg  2.jpg  3.jpg  4.mp4  5.jpg  6.mp4
 * - Images auto-advance after 8s. Videos advance on end. Loops forever. Click a card to jump.
 */

const MEDIA = [
  { id: 1, type: "image", src: "/images/giftOne/1.jpg", title: "My Safe Place",    caption: "Moment One"   },
  { id: 2, type: "image", src: "/images/giftOne/2.jpg", title: "Forever Home",    caption: "Moment Two"   },
  { id: 3, type: "image", src: "/images/giftOne/3.jpg", title: "Us Against Everything", caption: "Moment Three" },
  { id: 4, type: "video", src: "/images/giftOne/4.mp4", title: "First Evening Together",      caption: "Moment Four"  },
  { id: 5, type: "image", src: "/images/giftOne/5.jpg", title: "Do Ghante ❌, Do Saal ✅",      caption: "Moment Five"  },
  { id: 6, type: "video", src: "/images/giftOne/6.mp4", title: "Ladaku Jodi",       caption: "Moment Six"   },
];

const IMAGE_DURATION_MS = 8000;

// --- inline icons (no external icon library needed) ---
const ChevronLeftIcon = (props) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round"
       strokeLinejoin="round" {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = (props) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round"
       strokeLinejoin="round" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const HeartIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 21s-7.5-4.6-9.7-9.2C.9 8.2 2.6 4.8 5.9 4.1c2-.4 3.9.5 5 2 .1.1.2.1.3 0 1.1-1.5 3-2.4 5-2 3.3.7 5 4.1 3.6 7.7C19.5 16.4 12 21 12 21z" />
  </svg>
);

export default function GiftOne() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const imageTimerRef = useRef(null);
  const progressRafRef = useRef(null);
  const progressStartRef = useRef(0);
  const videoRef = useRef(null);

  const total = MEDIA.length;
  const current = MEDIA[active];

  const goTo = useCallback(
    (index) => {
      const nextIndex = ((index % total) + total) % total; // circular
      setActive(nextIndex);
    },
    [total]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Auto-advance + progress
  useEffect(() => {
    if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    setProgress(0);

    if (current.type === "image") {
      progressStartRef.current = performance.now();
      const tick = (now) => {
        const elapsed = now - progressStartRef.current;
        const ratio = Math.min(1, elapsed / IMAGE_DURATION_MS);
        setProgress(ratio);
        if (ratio < 1) progressRafRef.current = requestAnimationFrame(tick);
      };
      progressRafRef.current = requestAnimationFrame(tick);

      imageTimerRef.current = setTimeout(() => next(), IMAGE_DURATION_MS);
    }
    return () => {
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    };
  }, [active, current.type, next]);

  const handleVideoTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    setProgress(Math.min(1, v.currentTime / v.duration));
  };
  const handleVideoEnded = () => {
    setProgress(1);
    next();
  };

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const previews = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push({ ...MEDIA[(active + i) % total], _offset: i });
    }
    return arr;
  }, [active, total]);

  const [muted, setMuted] = useState(false);

  return (
    <div className="giftone-root">
      {/* Background stage */}
      <div className="giftone-stage" key={current.id}>
        {current.type === "image" ? (
          <img src={current.src} alt={current.title} className="giftone-stage-media" />
        ) : (
          <video
            ref={videoRef}
            src={current.src}
            className="giftone-stage-media"
            autoPlay
            playsInline
            muted={muted}
            onLoadedData={async () => {
              const v = videoRef.current;
              if (!v) return;
              try {
              v.muted = muted;
              await v.play();
            } catch {
            // Browser blocked autoplay-with-sound → fall back to muted
            v.muted = true;
            setMuted(true);
            try { await v.play(); } catch {}
            }
          }}
          onTimeUpdate={handleVideoTimeUpdate}
          onEnded={handleVideoEnded}
          />
        )}
        <div className="giftone-stage-overlay" />
      </div>

      {/* Top-left brand */}
      <header className="giftone-header">
        <div className="giftone-brand">
          <HeartIcon className="giftone-brand-icon" />
          <span className="giftone-brand-text">Sweet Moments</span>
        </div>
      </header>

      {/* Left content: just caption + title (no big heading) */}
      <section className="giftone-content">
        <span className="giftone-accent-line" aria-hidden />
        <p className="giftone-eyebrow">{current.caption}</p>
        <p className="giftone-subtitle">{current.title}</p>
      </section>

      {/* Preview cards */}
      <div className="giftone-cards">
        {previews.map((item, i) => (
          <button
            key={`${item.id}-${i}`}
            type="button"
            className="giftone-card"
            style={{ "--i": String(i) }}
            onClick={() => goTo(active + item._offset)}
            aria-label={`Jump to ${item.title}`}
          >
            {item.type === "image" ? (
              <img src={item.src} alt={item.title} className="giftone-card-media" />
            ) : (
              <video
                src={item.src}
                className="giftone-card-media"
                muted
                playsInline
                preload="metadata"
              />
            )}
            <span className="giftone-card-accent" aria-hidden />
            <div className="giftone-card-info">
              <span className="giftone-card-caption">{item.caption}</span>
              <span className="giftone-card-title">{item.title}</span>
            </div>
            {item.type === "video" && <span className="giftone-card-badge" aria-hidden>▶</span>}
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="giftone-footer">
        <div className="giftone-controls">
          <button type="button" className="giftone-nav-btn" onClick={prev} aria-label="Previous">
            <ChevronLeftIcon />
          </button>
          <button type="button" className="giftone-nav-btn" onClick={next} aria-label="Next">
            <ChevronRightIcon />
          </button>
        </div>

        <button
          type="button"
          className="giftone-mute-btn"
          onClick={() => {
            const v = videoRef.current;
            const nextMuted = !muted;
            setMuted(nextMuted);
            if (v) {
              v.muted = nextMuted;
              if (!nextMuted) v.play().catch(() => {});
            }
          }}
          aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? (
              /* muted icon (speaker with X) */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9"  x2="17" y2="15" />
                <line x1="17" y1="9"  x2="23" y2="15" />
              </svg>
            ) : (
              /* sound-on icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>

        <div className="giftone-progress">
          <div className="giftone-progress-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="giftone-counter">
          <span className="giftone-counter-current">{String(active + 1).padStart(2, "0")}</span>
          <span className="giftone-counter-sep">/</span>
          <span className="giftone-counter-total">{String(total).padStart(2, "0")}</span>
        </div>
      </footer>
    </div>
  );
}
