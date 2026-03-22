import { useEffect, useRef } from "react";
import "./PageLoader.css";

/*
  Carefully hand-crafted cursive "Mosaic" signature paths.
  ViewBox: 0 0 320 100
  Each letter is a separate <path> so we can stagger-animate them.
  They connect at the baseline (y≈72).

  M  — classic cursive capital M: tall, two humps, descends
  o  — small oval, connected
  s  — flowing S
  a  — open bowl + right upstroke
  i  — single stroke + dot
  c  — open leftward C
*/

const LETTERS = [
  // M  — starts at (12,72), rises to shoulder, two peaks, comes back down
  {
    d: "M 12,72 C 12,72 14,40 18,32 C 20,27 22,27 24,32 C 27,40 28,55 30,60 C 32,48 35,32 38,27 C 40,22 43,23 44,30 C 46,40 46,62 46,72",
    len: 180,
  },
  // o  — small oval, baseline sits at 72, top at ~52
  {
    d: "M 46,72 C 46,72 50,76 56,74 C 66,70 70,58 68,50 C 66,42 58,40 52,44 C 46,48 44,58 46,66 C 48,74 54,76 60,73 C 66,70 70,62 68,54",
    len: 160,
  },
  // s  — flows from o's exit, dips then rises
  {
    d: "M 72,56 C 78,46 86,46 87,52 C 88,58 80,62 78,67 C 76,72 80,78 86,76 C 90,74 93,70 92,66",
    len: 120,
  },
  // a  — open bowl with tail, then rises right
  {
    d: "M 106,46 C 100,40 92,44 91,54 C 90,64 96,74 104,73 C 110,72 112,65 111,58 C 110,50 106,46 106,46 L 112,72 C 112,72 112,60 116,54 C 118,50 120,52 120,56 L 120,72",
    len: 190,
  },
  // i — single clean stroke, dot added separately via circle
  {
    d: "M 125,52 C 124,60 124,68 125,72 C 126,76 128,76 128,72",
    len: 70,
    dot: [127, 42],
  },
  // c — open leftward arc
  {
    d: "M 150,50 C 144,44 134,46 131,54 C 128,62 130,72 137,76 C 143,79 150,76 153,70",
    len: 130,
  },
];

const COLORS = ["#e63946", "#f4a261", "#2a9d8f", "#e9c46a", "#6a4c93", "#70c1b3"];
const TOTAL_DURATION = 1100; // ms total draw time
const STAGGER = 120; // ms between letter starts

export default function PageLoader({ show }) {
  const pathRefs = useRef([]);
  const dotRef   = useRef(null);

  useEffect(() => {
    if (!show) return;

    pathRefs.current.forEach((path, i) => {
      if (!path) return;
      const len = path.getTotalLength();
      path.style.transition = "none";
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;

      const delay = i * STAGGER;
      const dur   = 350 + i * 30;

      setTimeout(() => {
        path.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.4,0,0.2,1)`;
        path.style.strokeDashoffset = "0";
      }, delay);
    });

    // Dot for "i"
    if (dotRef.current) {
      dotRef.current.style.transition = "none";
      dotRef.current.style.opacity = "0";
      dotRef.current.style.transform = "scale(0)";
      setTimeout(() => {
        dotRef.current.style.transition = "all 0.25s cubic-bezier(0.34,1.56,0.64,1)";
        dotRef.current.style.opacity = "1";
        dotRef.current.style.transform = "scale(1)";
      }, 4 * STAGGER + 200);
    }
  }, [show]);

  // Reset when hidden
  useEffect(() => {
    if (show) return;
    pathRefs.current.forEach(path => {
      if (!path) return;
      const len = path.getTotalLength();
      path.style.transition = "none";
      path.style.strokeDashoffset = len;
    });
    if (dotRef.current) {
      dotRef.current.style.transition = "none";
      dotRef.current.style.opacity = "0";
    }
  }, [show]);

  return (
    <div className={`page-loader ${show ? "show" : ""}`}>
      {/* Mosaic tile grid background */}
      <div className="loader-bg-grid">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="lbg-tile" style={{
            "--col": COLORS[i % COLORS.length],
            "--i": i,
          }} />
        ))}
      </div>

      <div className="loader-inner">
        {/* The signature SVG */}
        <div className="loader-sig-wrap">
          <svg
            viewBox="0 0 165 100"
            className="loader-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {LETTERS.map((_, i) => (
                <linearGradient key={i} id={`lg${i}`} x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor={COLORS[i]} />
                  <stop offset="100%" stopColor={COLORS[(i+1) % COLORS.length]} />
                </linearGradient>
              ))}
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Ghost baseline */}
            <line x1="8" y1="74" x2="158" y2="74" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>

            {/* Ghost letters (very faint guide) */}
            {LETTERS.map((l, i) => (
              <path key={`ghost-${i}`} d={l.d}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}

            {/* Animated letters */}
            {LETTERS.map((l, i) => (
              <path
                key={`letter-${i}`}
                ref={el => pathRefs.current[i] = el}
                d={l.d}
                stroke={`url(#lg${i})`}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#glow)"
                style={{ strokeDashoffset: 9999 }}
              />
            ))}

            {/* i dot */}
            {LETTERS[4].dot && (
              <circle
                ref={dotRef}
                cx={LETTERS[4].dot[0]}
                cy={LETTERS[4].dot[1]}
                r="3"
                fill={COLORS[4]}
                filter="url(#glow)"
                style={{ opacity: 0, transformOrigin: `${LETTERS[4].dot[0]}px ${LETTERS[4].dot[1]}px` }}
              />
            )}
          </svg>

          {/* Underline flourish */}
          <div className="loader-underline" />
        </div>

        {/* Bouncing tiles row */}
        <div className="loader-tiles">
          {COLORS.map((col, i) => (
            <span key={i} className="ltile" style={{ "--i": i, "--col": col }} />
          ))}
        </div>
      </div>
    </div>
  );
}
