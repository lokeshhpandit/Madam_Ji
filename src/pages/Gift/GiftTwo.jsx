import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const chapters = [
  {
    id: 1,
    hindi: "TUM AANKHON SE BATANA",
    title: ["The", "Glance"],
    caption: "a love told without words",
    image:
      "/images/giftTwo/1.png",
    position: "top-left",
  },
  {
    id: 2,
    hindi: "TUM HALKI SI SHARMANA",
    title: ["The", "Blush"],
    caption: "and I'm yours",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=80",
    position: "top-left",
  },
  {
    id: 3,
    hindi: "HUM RAAT TAARE GINTE",
    title: ["The", "Wait"],
    caption: "hoping for a sign",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1800&q=80",
    position: "top-right",
  },
  {
    id: 4,
    hindi: "TU BAADAL BANKAR AANA",
    title: ["A", "Sign"],
    caption: "she answers",
    image:
      "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?auto=format&fit=crop&w=1800&q=80",
    position: "bottom-right",
  },
  {
    id: 5,
    hindi: "TUM HAATH THAAM LENA",
    title: ["Your", "Hand"],
    caption: "and I'm complete",
    image:
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=1800&q=80",
    position: "bottom-left",
  },
  {
    id: 6,
    hindi: "HUM EK HO JAAYENGE",
    title: ["As", "One"],
    caption: "and I'll be yours",
    image:
      "https://images.unsplash.com/photo-1517816428104-797678c7cf0d?auto=format&fit=crop&w=1800&q=80",
    position: "top-right",
  },
  {
    id: 7,
    hindi: "NIGAAHON KI BAAT SUNNA",
    title: ["The", "Café"],
    caption: "eyes do the talking",
    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1800&q=80",
    position: "bottom-left",
  },
  {
    id: 8,
    hindi: "KHAMOSHI KO PADH LENA",
    title: ["The", "Silence"],
    caption: "I'll read it all",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1800&q=80",
    position: "bottom-right",
  },
];

const positionClasses = {
  "top-left": "top-10 left-8 md:top-16 md:left-16 items-start text-left",
  "top-right": "top-10 right-8 md:top-16 md:right-16 items-end text-right",
  "bottom-left":
    "bottom-16 left-8 md:bottom-20 md:left-16 items-start text-left",
  "bottom-right":
    "bottom-16 right-8 md:bottom-20 md:right-16 items-end text-right",
};

const Chapter = ({ data, isFirst, onPrev }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.55, once: false });

  return (
    <section
      ref={ref}
      data-testid={`gift-two-section-${data.id}`}
      className="relative flex h-screen w-full snap-start snap-always items-center justify-center overflow-hidden bg-black"
    >
      {/* Background image with slow Ken-Burns while in view */}
      <motion.img
        src={data.image}
        alt={data.title.join(" ")}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.08 }}
        animate={{ scale: inView ? 1.16 : 1.08 }}
        transition={{ duration: 8, ease: "linear" }}
        data-testid={`gift-two-image-${data.id}`}
      />

      {/* Cinematic vignette + subtle depth on the text side */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      <div
        className={`pointer-events-none absolute inset-0 ${
          data.position.includes("left")
            ? "bg-gradient-to-r from-black/70 via-black/25 to-transparent"
            : "bg-gradient-to-l from-black/70 via-black/25 to-transparent"
        }`}
      />

      {/* Text block, positioned per chapter */}
      <motion.div
        className={`absolute z-10 flex max-w-[85%] flex-col md:max-w-[46%] ${
          positionClasses[data.position]
        }`}
        initial={{ opacity: 0, y: 24 }}
        animate={
          inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
        }
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <div
          data-testid={`gift-two-hindi-${data.id}`}
          className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/85 md:text-xs"
          style={{ fontFamily: '"Poppins", "Inter", sans-serif' }}
        >
          {data.hindi}
        </div>

        <h1
          data-testid={`gift-two-title-${data.id}`}
          className="leading-[0.9] tracking-tight text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.75)]"
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
            fontWeight: 600,
            fontSize: "clamp(3.5rem, 9vw, 8rem)",
          }}
        >
          <span className="block">{data.title[0]}</span>
          <span className="block">{data.title[1]}</span>
        </h1>

        <p
          data-testid={`gift-two-caption-${data.id}`}
          className="mt-4 max-w-xs italic text-white/90"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "clamp(1rem, 1.6vw, 1.5rem)",
          }}
        >
          {data.caption}
        </p>
      </motion.div>

      {/* Chapter number – opposite corner from the text (subtle) */}
      <div
        className={`absolute z-10 text-[10px] tracking-[0.5em] text-white/50 ${
          data.position.includes("right")
            ? "bottom-8 left-8"
            : "bottom-8 right-8"
        }`}
      >
        {String(data.id).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
      </div>

      {/* Previous button – ONLY on first chapter, bottom-left */}
      {isFirst && (
        <button
          data-testid="gift-two-prev-page-btn"
          onClick={onPrev}
          className="group absolute bottom-8 left-8 z-20 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Previous</span>
        </button>
      )}

      {/* Scroll hint (only on first section) */}
      {isFirst && (
        <div
          data-testid="gift-two-scroll-hint"
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.5em] text-white/60"
        >
          <div>Scroll</div>
          <motion.div
            className="mx-auto mt-2 h-6 w-[1px] bg-white/60"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </div>
      )}
    </section>
  );
};

const GiftTwo = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  // Autoplay music with fade-in; browsers require a user gesture, so we also
  // start it on first pointer/scroll/key event.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;

    const fadeIn = () => {
      const target = 0.35;
      const step = 0.02;
      const id = setInterval(() => {
        if (!audioRef.current) return clearInterval(id);
        if (audioRef.current.volume >= target - step) {
          audioRef.current.volume = target;
          clearInterval(id);
        } else {
          audioRef.current.volume = Math.min(1, audioRef.current.volume + step);
        }
      }, 90);
    };

    const tryPlay = () => {
      a.play()
        .then(() => fadeIn())
        .catch(() => {});
    };

    tryPlay();

    const onInteract = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("wheel", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };
    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("keydown", onInteract);
    window.addEventListener("wheel", onInteract, { passive: true });
    window.addEventListener("touchstart", onInteract, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("wheel", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };
  }, []);

  return (
    <div
      data-testid="gift-two-page"
      className="relative h-screen w-full overflow-y-scroll bg-black text-white"
      style={{
        scrollSnapType: "y mandatory",
        fontFamily:
          '"Cormorant Garamond", "Playfair Display", Georgia, ui-serif, serif',
      }}
    >
      {/* Looping background music — drop your file at this exact path */}
      <audio
        ref={audioRef}
        src="/music/giftFour/gifttFour.mp3"
        loop
        preload="auto"
        data-testid="gift-two-audio"
      />

      {chapters.map((c, i) => (
        <Chapter
          key={c.id}
          data={c}
          isFirst={i === 0}
          onPrev={() => navigate("/gift")}
        />
      ))}
    </div>
  );
};

export default GiftTwo;
