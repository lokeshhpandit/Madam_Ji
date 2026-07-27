import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Cake.css";
import "../../styles/firework.css";

// Helper: load a script once
const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.dataset.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });

/* ------------------------------------------------------------
   Phase 1: Candle Animation (pure CSS)
   ------------------------------------------------------------ */
function CandleScene() {
  return (
    <div className="candle-scene" data-testid="candle-scene">
      <div className="wrapper">
        <div className="candles">
          <div className="light__wave"></div>
          <div className="candle1">
            <div className="candle1__body">
              <div className="candle1__eyes">
                <span className="candle1__eyes-one"></span>
                <span className="candle1__eyes-two"></span>
              </div>
              <div className="candle1__mouth"></div>
            </div>
            <div className="candle1__stick"></div>
          </div>
          <div className="candle2">
            <div className="candle2__body">
              <div className="candle2__eyes">
                <div className="candle2__eyes-one"></div>
                <div className="candle2__eyes-two"></div>
              </div>
            </div>
            <div className="candle2__stick"></div>
          </div>
          <div className="candle2__fire"></div>
          <div className="sparkles-one"></div>
          <div className="sparkles-two"></div>
          <div className="candle__smoke-one"></div>
          <div className="candle__smoke-two"></div>
        </div>
        <div className="floor"></div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Phase 2a: Firework Background (canvas + external scripts)
   ------------------------------------------------------------ */
function FireworkBackground() {
  const initedRef = useRef(false);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const loadAll = async () => {
      try {
        await loadScript(
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/fscreen%401.0.1.js"
        );
        await loadScript(
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/Stage%400.1.4.js"
        );
        await loadScript(
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/MyMath.js"
        );
        await loadScript("/vendor/fireworks-app.js");
      } catch (e) {
        console.error("Firework load error:", e);
      }
    };
    loadAll();
  }, []);

  return (
    <div className="firework-scene" data-testid="firework-scene">
      <div className="container">
        <div className="stage-container">
          <div className="canvas-container">
            <canvas id="trails-canvas"></canvas>
            <canvas id="main-canvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Phase 2b: Cake Animation (foreground)
   ------------------------------------------------------------ */
function CakeAnimation() {
  const containerRef = useRef(null);
  const initedRef = useRef(false);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const run = async () => {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.6/gsap.min.js"
        );
        await loadScript(
          "https://unpkg.com/splitting/dist/splitting.min.js"
        );
        await loadScript(
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/MorphSVGPlugin3.min.js"
        );

        // small delay so plugins register
        await new Promise((r) => setTimeout(r, 50));

        const { gsap, Splitting } = window;
        if (!gsap || !Splitting) return;
        const { to, timeline, set, delayedCall } = gsap;

        Splitting();

        const scope = containerRef.current;
        const q = (sel) => scope.querySelector(sel);
        const qa = (sel) => scope.querySelectorAll(sel);

        const BTN = q(".birthday-button__button");
        const EYES = q(".cake__eyes");
        const bodyEl = scope;

        const BLINK = (eyes) => {
          gsap.set(eyes, { scaleY: 1 });
          if (eyes.BLINK_TL) eyes.BLINK_TL.kill();
          eyes.BLINK_TL = new gsap.timeline({
            delay: Math.floor(Math.random() * 4) + 1,
            onComplete: () => BLINK(eyes),
          });
          eyes.BLINK_TL.to(eyes, {
            duration: 0.05,
            transformOrigin: "50% 50%",
            scaleY: 0,
            yoyo: true,
            repeat: 1,
          });
        };
        if (EYES) BLINK(EYES);

        const FROSTING_TL = () =>
          timeline()
            .to(q("#frosting"), { scaleX: 1.015, duration: 0.25 }, 0)
            .to(q("#frosting"), { scaleY: 1, duration: 1 }, 0)
            .to(
              q("#frosting"),
              { duration: 1, morphSVG: q(".cake__frosting--end") },
              0
            );

        const SPRINKLES_TL = () =>
          timeline().to(qa(".cake__sprinkle"), {
            scale: 1,
            duration: 0.06,
            stagger: 0.02,
          });

        const SPIN_TL = () =>
          timeline()
            .set(qa(".cake__frosting-patch"), { display: "block" })
            .to(
              [
                ...qa(".cake__frosting--duplicate"),
                ...qa(".cake__sprinkles--duplicate"),
              ],
              { x: 0, duration: 1 },
              0
            )
            .to(
              [
                ...qa(".cake__frosting--start"),
                ...qa(".cake__sprinkles--initial"),
              ],
              { x: 65, duration: 1 },
              0
            )
            .to(qa(".cake__face"), { duration: 1, x: -48.82 }, 0);

        const flickerSpeed = 0.1;
        const FLICKER_TL = timeline()
          .to(qa(".candle__flame-outer"), {
            duration: flickerSpeed,
            repeat: -1,
            yoyo: true,
            morphSVG: q("#flame-outer"),
          })
          .to(
            qa(".candle__flame-inner"),
            {
              duration: flickerSpeed,
              repeat: -1,
              yoyo: true,
              morphSVG: q("#flame-inner"),
            },
            0
          );

        const SHAKE_TL = () =>
          timeline({ delay: 0.5 })
            .set(qa(".cake__face"), { display: "none" })
            .set(qa(".cake__face--straining"), { display: "block" })
            .to(
              q(".birthday-button"),
              {
                onComplete: () => {
                  set(qa(".cake__face--straining"), { display: "none" });
                  set(qa(".cake__face"), { display: "block" });
                },
                x: 1,
                y: 1,
                repeat: 13,
                duration: 0.1,
              },
              0
            )
            .to(
              qa(".cake__candle"),
              {
                onComplete: () => FLICKER_TL.play(),
                ease: "Elastic.easeOut",
                duration: 0.2,
                stagger: 0.2,
                scaleY: 1,
              },
              0.2
            );

        const FLAME_TL = () =>
          timeline({})
            .to(qa(".cake__candle"), {
              "--flame": 1,
              stagger: 0.2,
              duration: 0.1,
            })
            .to(bodyEl, {
              "--flame": 1,
              "--lightness": 5,
              duration: 0.2,
              delay: 0.2,
            });

        const LIGHTS_OUT = () =>
          timeline().to(bodyEl, {
            delay: 0.5,
            "--lightness": 0,
            duration: 0.1,
            "--glow-saturation": 0,
            "--glow-lightness": 0,
            "--glow-alpha": 1,
            "--transparency-alpha": 1,
          });

        const RESET = () => {
          set(qa(".char"), {
            "--hue": () => Math.random() * 360,
            "--char-sat": 0,
            "--char-light": 0,
            x: 0,
            y: 0,
            opacity: 1,
          });
          set(bodyEl, {
            "--frosting-hue": Math.random() * 360,
            "--glow-saturation": 50,
            "--glow-lightness": 35,
            "--glow-alpha": 0.4,
            "--transparency-alpha": 0,
            "--flame": 0,
          });
          set(qa(".cake__candle"), { "--flame": 0 });
          to(bodyEl, { "--lightness": 50, duration: 0.25 });
          set(qa(".cake__frosting--end"), { opacity: 0 });
          set(q("#frosting"), {
            transformOrigin: "50% 10%",
            scaleX: 0,
            scaleY: 0,
          });
          set(qa(".cake__frosting-patch"), { display: "none" });
          set(
            [
              ...qa(".cake__frosting--duplicate"),
              ...qa(".cake__sprinkles--duplicate"),
            ],
            { x: -65 }
          );
          set(qa(".cake__face"), { x: -110 });
          set(qa(".cake__face--straining"), { display: "none" });
          set(qa(".cake__sprinkle"), {
            "--sprinkle-hue": () => Math.random() * 360,
            scale: 0,
            transformOrigin: "50% 50%",
          });
          set(q(".birthday-button"), { scale: 0.9, x: 0, y: 0 });
          set(q(".birthday-button__cake"), { display: "none" });
          set(qa(".cake__candle"), {
            scaleY: 0,
            transformOrigin: "50% 100%",
          });
        };
        RESET();

        const MASTER_TL = timeline({
          onComplete: () => {
            delayedCall(2, () => {
              RESET();
              MASTER_TL.restart();
            });
            if (BTN) BTN.removeAttribute("disabled");
          },
          paused: true,
        })
          .set(q(".birthday-button__cake"), { display: "block" })
          .to(q(".birthday-button"), { scale: 1.1, duration: 0.2 })
          .to(qa(".char"), { "--char-sat": 70, "--char-light": 65, duration: 0.2 }, 0)
          .to(qa(".char"), {
            delay: 0.75,
            y: () => gsap.utils.random(-100, -200),
            x: () => gsap.utils.random(-50, 50),
            duration: () => gsap.utils.random(0.5, 1),
          })
          .to(qa(".char"), { opacity: 0, duration: 0.25 }, ">-0.5")
          .add(FROSTING_TL())
          .add(SPRINKLES_TL())
          .add(SPIN_TL())
          .add(SHAKE_TL())
          .add(FLAME_TL())
          .add(LIGHTS_OUT());

        MASTER_TL.play();
      } catch (e) {
        console.error("Cake animation error:", e);
      }
    };

    run();
  }, []);

  return (
    <div className="cake-scene" ref={containerRef} data-testid="cake-scene">
      <div className="birthday-button">
        <button
          className="birthday-button__button"
          data-testid="birthday-button"
        >
          <svg
            className="birthday-button__cake"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 76.609 47.643"
          >
            <defs>
              <g id="candle" transform="translate(-48.82 -137.74)">
                <rect
                  ry=".567"
                  y="147.888"
                  x="72.548"
                  height="12.001"
                  width="4.252"
                  fill="#ececec"
                ></rect>
                <g className="candle__flame">
                  <path
                    className="candle__flame-outer"
                    d="M75.672 145.92c.608 1.207.086 2.224-.749 2.224s-1.512-.037-1.512-1.388.558-3.566 1.98-3.973c1.007-.288-.855.884.281 3.138z"
                    fill="#f60"
                  ></path>
                  <path
                    className="candle__flame-inner"
                    d="M75.081 146.449c.41.51.266 1.043-.13 1.128-.394.084-.682-.228-.822-.866 0 0-.13-1.382.502-1.719.447-.238-.315.505.45 1.457z"
                    fill="#ff0"
                  ></path>
                </g>
                <g style={{ display: "none" }}>
                  <path
                    id="flame-outer"
                    d="M73.676 145.92c-.609 1.207-.086 2.224.749 2.224s1.511-.037 1.511-1.388-.557-3.566-1.98-3.973c-1.006-.288.856.884-.28 3.138z"
                    fill="#f60"
                  ></path>
                  <path
                    id="flame-inner"
                    d="M74.267 146.449c-.41.51-.266 1.043.129 1.128.395.084.683-.228.823-.866 0 0 .13-1.382-.502-1.719-.447-.238.315.505-.45 1.457z"
                    fill="#ff0"
                  ></path>
                </g>
              </g>
              <clipPath id="face-clip">
                <rect
                  transform="translate(-48.82 -138.799)"
                  width="63.5"
                  height="26.458"
                  x="55.374"
                  y="159.984"
                  ry="3.402"
                ></rect>
              </clipPath>
              <clipPath id="sprinkle-clip">
                <rect
                  width="63.5"
                  height="26.458"
                  x="55.374"
                  y="159.984"
                  ry="3.402"
                ></rect>
              </clipPath>
              <clipPath id="frosting-clip">
                <path d="m 58.311339,159.19367 c -1.915439,0 -3.331523,2.04311 -3.986711,3.74446 -0.778328,2.02111 -0.761971,4.73695 0.529167,6.47582 0.861406,1.16012 2.614079,1.3182 4.033715,1.5875 1.321013,0.25059 2.689143,0 4.033714,0 1.344572,0 2.689143,0 4.033715,0 1.344572,0 2.689143,0 4.033715,0 1.344572,0 2.689143,0 4.033714,0 1.344572,0 2.689143,0 4.033715,0 1.344572,0 2.689143,0 4.033715,0 1.344572,0 2.689143,0 4.033715,0 1.344571,0 2.689143,0 4.033714,0 1.344572,0 2.689143,0 4.033715,0 1.344572,0 2.689143,0 4.033715,0 1.344573,0 2.689143,0 4.033713,0 1.34457,0 2.68915,0 4.03372,0 1.34457,0 2.68914,0 4.03371,0 1.34457,0 2.71271,0.25059 4.03372,0 1.41963,-0.2693 3.17231,-0.42738 4.03371,-1.5875 1.29114,-1.73887 1.3075,-4.45471 0.52917,-6.47582 -0.65519,-1.70135 -2.07128,-3.74446 -3.98672,-3.74446 z"></path>
              </clipPath>
              <g id="sprinkles" transform="translate(63.93)">
                {[
                  ["rotate(-44.064)", "167.592", "-91.837"],
                  ["rotate(127.01)", "165.35", "76.642"],
                  ["rotate(85.232)", "3.842", "182.37"],
                  ["rotate(136.794)", "-137.013", "122.349"],
                  ["rotate(-28.569)", "160.466", "-90.997"],
                  ["rotate(-134.37)", "-124.272", "-138.396"],
                  ["rotate(-37.152)", "155.28", "-101.107"],
                  ["rotate(-72.723)", "77.322", "-169.664"],
                  ["rotate(36.566)", "135.065", "124.338"],
                  ["rotate(-45)", "150.009", "-111.692"],
                  ["rotate(30)", "141.701", "119.879"],
                  ["rotate(-55.914)", "139.024", "-129.555"],
                  ["rotate(-30)", "178.671", "-60.133"],
                  ["rotate(45)", "95.647", "162.293"],
                  ["rotate(45)", "133.647", "124.293"],
                ].map(([t, y, x], i) => (
                  <rect
                    key={i}
                    className="cake__sprinkle"
                    transform={t}
                    ry=".567"
                    y={y}
                    x={x}
                    height="1.228"
                    width="3.307"
                  ></rect>
                ))}
              </g>
              <path
                id="frosting"
                d="M58.311 159.194c-1.915 0-3.283-.087-3.986 1.098-.392.661-.073 1.766.529 2.243 1.054.834 2.689 0 4.034 0H115.36c1.344 0 2.979.834 4.033 0 .602-.477.921-1.582.53-2.243-.703-1.185-2.072-1.098-3.987-1.098z"
              ></path>
              <path
                className="cake__frosting cake__frosting--end"
                d="M58.311 159.194c-1.915 0-3.354 2.034-3.986 3.744-.57 1.537-.953 4.189.529 4.888 1.454.687 2.425-2.645 4.034-2.645 1.608 0 2.425 2.645 4.033 2.645 1.608 0 2.426-2.645 4.034-2.645 1.608 0 2.426 2.645 4.034 2.645 1.608 0 2.425-2.645 4.033-2.645 1.608 0 2.426 2.645 4.034 2.645 1.608 0 2.426-2.645 4.034-2.645 1.608 0 2.426 2.645 4.034 2.645 1.608 0 2.425-2.645 4.033-2.645 1.608 0 2.426 2.645 4.034 2.645 1.608 0 2.436-2.83 4.034-2.645 1.936.222 2.084 4.233 4.033 4.233 1.95 0 2.098-4.01 4.034-4.233 1.598-.184 2.426 2.645 4.034 2.645 1.608 0 2.426-2.645 4.034-2.645 1.608 0 2.58 3.332 4.033 2.645 1.482-.7 1.098-3.35.53-4.888-.633-1.71-2.072-3.744-3.987-3.744z"
              ></path>
            </defs>
            <g className="cake-decoration" transform="translate(-48.82 -138.799)">
              <g className="cake__frosting-group" clipPath="url(#frosting-clip)">
                <g className="cake__frosting cake__frosting--start">
                  <use xlinkHref="#frosting"></use>
                </g>
                <g className="cake__frosting cake__frosting--duplicate">
                  <rect className="cake__frosting-patch" width="20" height="5" x="110" y="159.25"></rect>
                  <use xlinkHref="#frosting"></use>
                </g>
              </g>
              <g className="cake__sprinkles-group" clipPath="url(#sprinkle-clip)">
                <g className="cake__sprinkles cake__sprinkles--initial">
                  <use xlinkHref="#sprinkles"></use>
                </g>
                <g className="cake__sprinkles cake__sprinkles--duplicate">
                  <use xlinkHref="#sprinkles"></use>
                </g>
              </g>
            </g>
            <g clipPath="url(#face-clip)">
              <g className="cake__face" transform="translate(-48.82 -138.799)">
                <g className="cake__eyes">
                  <g className="cake__eye" transform="matrix(1.38031 0 0 1.38031 34.723 -33.58)">
                    <circle className="cake__eye-body" cx="29.86" cy="149.022" r="2.457"></circle>
                    <circle className="cake__eye-pupil" cx="28.773" cy="148.162" r=".756"></circle>
                  </g>
                  <g className="cake__eye" transform="matrix(1.38031 0 0 1.38031 57.092 -33.58)">
                    <circle className="cake__eye-body" r="2.457" cy="149.022" cx="29.86"></circle>
                    <circle className="cake__eye-pupil" r=".756" cy="148.162" cx="28.773"></circle>
                  </g>
                </g>
                <g className="cake__mouth">
                  <path
                    className="cake__mouth-opening"
                    d="M83.607 174.436a3.652 3.652 0 003.518 2.674 3.652 3.652 0 003.515-2.674z"
                    strokeWidth="1.18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    className="cake__tongue"
                    d="M88.836 175.492a3.113 2.329 0 00-2.869 1.425 3.652 3.652 0 001.158.192 3.652 3.652 0 002.899-1.44 3.113 2.329 0 00-1.188-.177z"
                  ></path>
                </g>
              </g>
              <g className="cake__face--straining" transform="translate(-48.82 -138.799)">
                <path
                  d="M100.673 173.886l-5.248-2.073 5.713-1.466M73.574 173.886l5.248-2.073-5.713-1.466"
                  fill="none"
                  stroke="#000"
                  strokeWidth="1.016"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M85.016 175.773h4.216"
                  fill="none"
                  stroke="#000"
                  strokeWidth=".867"
                  strokeLinecap="round"
                ></path>
              </g>
            </g>
            <g className="cake__candles">
              <g className="cake__candle">
                <use xlinkHref="#candle"></use>
              </g>
              <g className="cake__candle">
                <use xlinkHref="#candle" transform="translate(25 0)"></use>
              </g>
              <g className="cake__candle">
                <use xlinkHref="#candle" transform="translate(12 0.5)"></use>
              </g>
            </g>
          </svg>
          <span className="birthday-button__text" data-splitting="">
            Happy Birthday!
          </span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   NEW: Gift Prompt Box (below the cake)
   ------------------------------------------------------------ */
function GiftPrompt() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay the appearance so it shows AFTER the cake animation kicks in
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    // small fade-out before navigation
    setVisible(false);
    setTimeout(() => navigate("/gift"), 600);
  };

  return (
    <div className={`gift-prompt ${visible ? "gift-prompt--visible" : ""}`}>
      <p className="gift-prompt__text">It&apos;s gift time now love. Wanna see it ?</p>
      <button
        className="gift-prompt__button"
        onClick={handleClick}
        data-testid="open-surprises-btn"
      >
        <span className="gift-prompt__button-text">click me to open surprises</span>
        <span className="gift-prompt__sparkle">✨</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------
   Main Cake page
   ------------------------------------------------------------ */
export default function Cake() {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setPhase(2), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="cake-page" data-testid="cake-page">
      {phase === 1 && <CandleScene />}
      {phase === 2 && (
        <>
          <FireworkBackground />
          <CakeAnimation />
          <GiftPrompt />
        </>
      )}
    </div>
  );
}
