import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
} from "lucide-react";

/**
 * GiftThree — Aesthetic split-screen birthday page
 * Palette: Deep burgundy + champagne
 * Left: video message inside ornate gilded frame
 * Right: large image with entrance + hover animations
 */

// -----------------------------
// Palette (deep burgundy + champagne)
// -----------------------------
const PALETTE = {
  bgFrom: "#1a0509",
  bgVia: "#2a0a12",
  bgTo: "#0d0306",
  burgundy: "#5a1024",
  burgundyDeep: "#3a0812",
  champagne: "#f4d9a8",
  champagneSoft: "#e8c98a",
  gold: "#c9a35a",
  goldLight: "#f0d99a",
  ink: "#f8ecd4",
};

// Placeholder fallbacks (used only if the local asset fails to load)
const IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop";
const POSTER_FALLBACK =
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1600&auto=format&fit=crop";

// -----------------------------
// Floating sparkle particles
// -----------------------------
const Sparkle = ({ delay = 0, x = "50%", y = "50%", size = 6, hue }) => (
  <motion.span
    aria-hidden
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0.4, 1.2, 0.4],
      y: ["0%", "-40%", "-80%"],
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: "9999px",
      background: hue || PALETTE.champagne,
      boxShadow: `0 0 ${size * 3}px ${hue || PALETTE.gold}`,
      pointerEvents: "none",
    }}
  />
);

const SparkleField = ({ count = 18, seed = 0 }) => {
  const items = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `${seed}-${i}`,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: 3 + Math.random() * 6,
        delay: Math.random() * 5,
        hue: Math.random() > 0.5 ? PALETTE.champagne : PALETTE.gold,
      })),
    [count, seed],
  );
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {items.map((s) => (
        <Sparkle key={s.id} {...s} />
      ))}
    </div>
  );
};

// -----------------------------
// Ornate SVG corner (baroque flourish)
// -----------------------------
const OrnateCorner = ({ className = "", flip = "" }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ transform: flip }}
    aria-hidden
  >
    <defs>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={PALETTE.goldLight} />
        <stop offset="50%" stopColor={PALETTE.gold} />
        <stop offset="100%" stopColor="#8a6a2a" />
      </linearGradient>
    </defs>
    <path
      d="M4 4 L36 4 C 22 4, 18 8, 14 14 C 8 20, 4 24, 4 38 Z"
      fill="url(#goldGrad)"
      opacity="0.95"
    />
    <path
      d="M10 10 C 24 10, 30 16, 30 30"
      stroke="url(#goldGrad)"
      strokeWidth="1.2"
      fill="none"
    />
    <circle cx="30" cy="30" r="2.2" fill={PALETTE.goldLight} />
    <path
      d="M4 42 C 10 42, 14 46, 16 52 C 18 58, 22 62, 28 62"
      stroke="url(#goldGrad)"
      strokeWidth="1"
      fill="none"
      opacity="0.7"
    />
  </svg>
);

// -----------------------------
// Ornate video frame
// -----------------------------
const OrnateVideoFrame = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    className="relative w-full max-w-[460px]"
    data-testid="gift-three-video-frame"
  >
    {/* Floating idle animation wrapper */}
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {/* Outer glow */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[28px] blur-2xl opacity-70"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${PALETTE.gold}55, transparent 65%)`,
        }}
      />

      {/* Frame body */}
      <div
        className="relative rounded-[22px] p-[14px]"
        style={{
          background: `linear-gradient(145deg, ${PALETTE.goldLight}, ${PALETTE.gold} 45%, #7a5a1e 100%)`,
          boxShadow: `0 30px 80px -20px ${PALETTE.burgundyDeep}, 0 0 0 1px ${PALETTE.gold}66, inset 0 0 0 2px ${PALETTE.goldLight}55`,
        }}
      >
        {/* Inner burgundy bezel */}
        <div
          className="relative rounded-[14px] p-[6px]"
          style={{
            background: `linear-gradient(160deg, ${PALETTE.burgundy}, ${PALETTE.burgundyDeep})`,
            boxShadow: `inset 0 0 0 1px ${PALETTE.gold}88`,
          }}
        >
          {/* Content (video) */}
          <div
            className="relative overflow-hidden rounded-[10px]"
            style={{ boxShadow: `inset 0 0 0 1px ${PALETTE.goldLight}33` }}
          >
            {children}
          </div>
        </div>

        {/* Ornate corners */}
        <OrnateCorner className="absolute -top-1 -left-1 h-14 w-14" />
        <OrnateCorner
          className="absolute -top-1 -right-1 h-14 w-14"
          flip="scaleX(-1)"
        />
        <OrnateCorner
          className="absolute -bottom-1 -left-1 h-14 w-14"
          flip="scaleY(-1)"
        />
        <OrnateCorner
          className="absolute -bottom-1 -right-1 h-14 w-14"
          flip="scale(-1,-1)"
        />

        {/* Top medallion */}
        <div
          aria-hidden
          className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: "9999px",
            background: `radial-gradient(circle at 30% 30%, ${PALETTE.goldLight}, ${PALETTE.gold} 60%, #6a4a12 100%)`,
            boxShadow: `0 6px 18px ${PALETTE.burgundyDeep}, inset 0 0 0 2px ${PALETTE.goldLight}88`,
          }}
        >
          <Heart
            size={18}
            fill={PALETTE.burgundyDeep}
            color={PALETTE.burgundyDeep}
          />
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// -----------------------------
// Custom video controls
// -----------------------------
const VideoControls = ({ playing, muted, onToggle, onMute }) => (
  <div
    className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-5 py-4 md:px-6 md:py-5"
    style={{
      background:
        "linear-gradient(to top, rgba(10,3,6,0.95), rgba(10,3,6,0.35) 60%, transparent)",
    }}
  >
    <button
      type="button"
      onClick={onToggle}
      data-testid="gift-three-video-play-toggle"
      className="group relative flex items-center gap-2.5 rounded-full pl-3 pr-5 py-2.5 text-sm md:text-base font-semibold transition-all duration-300 hover:gap-3.5 hover:pr-6 active:scale-95"
      style={{
        color: PALETTE.champagne,
        background: `linear-gradient(135deg, ${PALETTE.burgundy}, ${PALETTE.burgundyDeep})`,
        border: `1.5px solid ${PALETTE.gold}`,
        boxShadow: `0 8px 24px ${PALETTE.burgundyDeep}, 0 0 0 3px ${PALETTE.gold}22, inset 0 1px 0 ${PALETTE.goldLight}55`,
      }}
      aria-label={playing ? "Pause video" : "Play video"}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${PALETTE.goldLight}, ${PALETTE.gold} 70%)`,
          color: PALETTE.burgundyDeep,
          boxShadow: `inset 0 0 0 1px ${PALETTE.goldLight}, 0 2px 8px rgba(0,0,0,0.4)`,
        }}
      >
        {playing ? (
          <Pause size={16} fill={PALETTE.burgundyDeep} />
        ) : (
          <Play size={16} fill={PALETTE.burgundyDeep} className="ml-0.5" />
        )}
      </span>
      <span className="cinzel uppercase tracking-[0.25em] text-xs md:text-sm">
        {playing ? "Pause" : "Play"}
      </span>
    </button>

    <button
      type="button"
      onClick={onMute}
      data-testid="gift-three-video-mute-toggle"
      className="group relative flex items-center gap-2.5 rounded-full pl-5 pr-3 py-2.5 text-sm md:text-base font-semibold transition-all duration-300 hover:gap-3.5 hover:pl-6 active:scale-95"
      style={{
        color: PALETTE.burgundyDeep,
        background: `linear-gradient(135deg, ${PALETTE.champagne}, ${PALETTE.champagneSoft})`,
        border: `1.5px solid ${PALETTE.gold}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.45), 0 0 0 3px ${PALETTE.gold}22, inset 0 1px 0 #fff8`,
      }}
      aria-label={muted ? "Unmute video" : "Mute video"}
    >
      <span className="cinzel uppercase tracking-[0.25em] text-xs md:text-sm">
        {muted ? "Unmute" : "Mute"}
      </span>
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${PALETTE.burgundy}, ${PALETTE.burgundyDeep} 75%)`,
          color: PALETTE.champagne,
          boxShadow: `inset 0 0 0 1px ${PALETTE.gold}, 0 2px 8px rgba(0,0,0,0.4)`,
        }}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </span>
    </button>
  </div>
);

// -----------------------------
// Main page
// -----------------------------
export default function GiftThree({ recipientName = "My Love" }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState("/images/giftThree/giftThree.png");
  const [videoErrored, setVideoErrored] = useState(false);

  // Try attempt autoplay on mount
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.catch(() => setPlaying(false));
    }
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div
      data-testid="gift-three-page"
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: `radial-gradient(1200px 800px at 15% 10%, ${PALETTE.burgundy}55, transparent 60%),
                     radial-gradient(900px 700px at 90% 90%, ${PALETTE.gold}22, transparent 55%),
                     linear-gradient(180deg, ${PALETTE.bgFrom}, ${PALETTE.bgVia} 55%, ${PALETTE.bgTo})`,
        fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
        color: PALETTE.ink,
      }}
    >
      {/* Google font import (self-contained) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        .cinzel { font-family: 'Cinzel', 'Cormorant Garamond', serif; letter-spacing: 0.08em; }
        .grain::before {
          content: "";
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0 0.6  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.35'/></svg>");
          mix-blend-mode: overlay;
          opacity: 0.12;
          pointer-events: none;
        }
      `}</style>

      {/* Grain overlay */}
      <div className="absolute inset-0 grain" aria-hidden />

      {/* Sparkle field */}
      <SparkleField count={22} seed={1} />

      {/* Header: back button + title */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <Link
          to="/gift"
          data-testid="gift-three-prev-button"
          className="group relative inline-flex items-center gap-3 rounded-full pl-3 pr-6 py-2.5 md:py-3 text-sm transition-all duration-300 hover:gap-4 hover:pr-7 active:scale-95"
          style={{
            color: PALETTE.champagne,
            background: `linear-gradient(135deg, ${PALETTE.burgundy}, ${PALETTE.burgundyDeep})`,
            border: `1.5px solid ${PALETTE.gold}`,
            boxShadow: `0 10px 28px ${PALETTE.burgundyDeep}, 0 0 0 4px ${PALETTE.gold}22, inset 0 1px 0 ${PALETTE.goldLight}55`,
            backdropFilter: "blur(10px)",
          }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:scale-110"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${PALETTE.goldLight}, ${PALETTE.gold} 70%)`,
              color: PALETTE.burgundyDeep,
              boxShadow: `inset 0 0 0 1px ${PALETTE.goldLight}, 0 2px 8px rgba(0,0,0,0.35)`,
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </span>
          <span className="cinzel uppercase text-[11px] md:text-xs tracking-[0.3em]">
            Previous
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-2 text-xs md:text-sm cinzel uppercase"
          style={{ color: PALETTE.champagneSoft, letterSpacing: "0.35em" }}
        >
          <Sparkles size={14} style={{ color: PALETTE.gold }} />
          <span>Gift · Three</span>
          <Sparkles size={14} style={{ color: PALETTE.gold }} />
        </motion.div>
      </header>

      {/* Main split-screen */}
      <main className="relative z-10 mx-auto flex h-[calc(100vh-88px)] w-full max-w-[1500px] flex-col items-stretch gap-4 px-6 pb-4 pt-0 md:px-10 lg:flex-row lg:items-center lg:gap-10 lg:pt-0">
        {/* LEFT — Video */}
        <section
          className="relative flex w-full items-center justify-center lg:w-1/2"
          data-testid="gift-three-left-panel"
        >
          <div className="w-full flex flex-col items-center">
            {/* Caption above video */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="cinzel uppercase mb-8 md:mb-10 text-sm md:text-base tracking-[0.4em] md:tracking-[0.5em] text-center"
              style={{ color: PALETTE.gold }}
            >
              A little message <span style={{ color: PALETTE.champagneSoft, margin: "0 0.4em" }}>·</span> Just for you
            </motion.p>

            <OrnateVideoFrame>
              <div className="relative aspect-video w-full bg-black">
                {!videoErrored ? (
                  <video
                    ref={videoRef}
                    data-testid="gift-three-video"
                    className="h-full w-full object-cover"
                    src="/videos/giftThree/video wish 2.mp4"
                    poster="/images/giftThree/giftThree.png"
                    playsInline
                    loop
                    autoPlay
                    muted={muted}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onError={() => setVideoErrored(true)}
                  />
                ) : (
                  <div
                    className="relative h-full w-full"
                    data-testid="gift-three-video-fallback"
                    style={{
                      background: `linear-gradient(135deg, ${PALETTE.burgundy}, ${PALETTE.burgundyDeep})`,
                    }}
                  >
                    <img
                      src={POSTER_FALLBACK}
                      alt="Birthday message poster"
                      className="h-full w-full object-cover opacity-70"
                    />
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
                      style={{ background: "rgba(10,3,6,0.5)" }}
                    >
                      <Heart
                        size={36}
                        style={{ color: PALETTE.champagne }}
                        fill={PALETTE.champagne}
                      />
                      <p
                        className="cinzel uppercase text-xs"
                        style={{ color: PALETTE.champagne, letterSpacing: "0.3em" }}
                      >
                        Drop your video at
                      </p>
                      <code
                        className="text-xs md:text-sm"
                        style={{ color: PALETTE.goldLight }}
                      >
                        /public/videos/giftThree/giftThree.mp4
                      </code>
                    </div>
                  </div>
                )}

                <VideoControls
                  playing={playing}
                  muted={muted}
                  onToggle={togglePlay}
                  onMute={toggleMute}
                />
              </div>
            </OrnateVideoFrame>
          </div>
        </section>

        {/* RIGHT — Image */}
        <section
          className="relative flex w-full items-center justify-center lg:w-1/2"
          data-testid="gift-three-right-panel"
        >
          {/* Decorative background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(600px 500px at 60% 50%, ${PALETTE.burgundy}55, transparent 65%)`,
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.4,
            }}
            className="relative w-[60%] max-w-[380px]"
            data-testid="gift-three-image-wrap"
          >
            {/* Floating idle */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="group relative"
            >
              {/* Glow */}
              <div
                aria-hidden
                className="absolute -inset-8 rounded-[32px] blur-3xl opacity-60 transition-opacity duration-700 group-hover:opacity-90"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${PALETTE.champagne}55, ${PALETTE.gold}22 45%, transparent 70%)`,
                }}
              />

              {/* Champagne frame */}
              <div
                className="relative overflow-hidden rounded-[22px] p-[6px] transition-transform duration-700 ease-out group-hover:-rotate-1"
                style={{
                  background: `linear-gradient(145deg, ${PALETTE.champagne}, ${PALETTE.gold} 60%, #8a6a2a)`,
                  boxShadow: `0 40px 100px -20px ${PALETTE.burgundyDeep}, 0 0 0 1px ${PALETTE.gold}55`,
                }}
              >
                <div
                  className="relative overflow-hidden rounded-[18px]"
                  style={{
                    aspectRatio: "4/5",
                    background: PALETTE.burgundyDeep,
                  }}
                >
                  <AnimatePresence>
                    {!imgLoaded && (
                      <motion.div
                        key="skeleton"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${PALETTE.burgundy}, ${PALETTE.burgundyDeep})`,
                        }}
                      >
                        <Heart
                          size={40}
                          style={{ color: PALETTE.champagneSoft }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.img
                    src={imgSrc}
                    alt={`A special picture for ${recipientName}`}
                    data-testid="gift-three-image"
                    onLoad={() => setImgLoaded(true)}
                    onError={() => {
                      setImgSrc(IMAGE_FALLBACK);
                    }}
                    initial={{ scale: 1.08 }}
                    animate={{ scale: imgLoaded ? 1 : 1.08 }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.06 }}
                    className="h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
                    style={{
                      opacity: imgLoaded ? 1 : 0,
                      transition: "opacity 0.8s ease",
                    }}
                  />

                  {/* Inner vignette */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      boxShadow: `inset 0 0 80px ${PALETTE.burgundyDeep}aa`,
                    }}
                  />
                </div>

                {/* Ornate corners on image frame */}
                <OrnateCorner className="absolute -top-1 -left-1 h-12 w-12 opacity-90" />
                <OrnateCorner
                  className="absolute -top-1 -right-1 h-12 w-12 opacity-90"
                  flip="scaleX(-1)"
                />
                <OrnateCorner
                  className="absolute -bottom-1 -left-1 h-12 w-12 opacity-90"
                  flip="scaleY(-1)"
                />
                <OrnateCorner
                  className="absolute -bottom-1 -right-1 h-12 w-12 opacity-90"
                  flip="scale(-1,-1)"
                />
              </div>

              {/* Floating heart accent */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.7 }}
                className="absolute -bottom-6 -right-6 flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${PALETTE.goldLight}, ${PALETTE.gold} 70%)`,
                  boxShadow: `0 12px 40px ${PALETTE.burgundyDeep}`,
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                >
                  <Heart
                    size={26}
                    fill={PALETTE.burgundyDeep}
                    color={PALETTE.burgundyDeep}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Signature caption */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 1.0 }}
              className="mt-6 text-center lg:text-left"
            >
              <p
                className="cinzel uppercase text-[10px] md:text-xs"
                style={{
                  color: PALETTE.gold,
                  letterSpacing: "0.5em",
                }}
              >
                Happy Birthday
              </p>
              <h1
                data-testid="gift-three-recipient-name"
                className="mt-1.5 text-3xl italic sm:text-4xl lg:text-5xl"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 500,
                  color: PALETTE.champagne,
                  textShadow: `0 4px 30px ${PALETTE.burgundyDeep}`,
                }}
              >
                {recipientName}
              </h1>
              <div
                className="mx-auto mt-3 h-px w-20 lg:mx-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${PALETTE.gold}, transparent)`,
                }}
              />
              <p
                className="mt-2.5 max-w-sm text-xs md:text-sm leading-relaxed mx-auto lg:mx-0"
                style={{ color: `${PALETTE.ink}cc` }}
              >
                Another year, another candle — and every one of them makes the
                world a little warmer because you&apos;re in it.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer flourish */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background: `linear-gradient(to top, ${PALETTE.bgTo}, transparent)`,
        }}
      />
    </div>
  );
}

