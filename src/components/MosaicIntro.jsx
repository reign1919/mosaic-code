import { useEffect, useRef, useState } from "react";

const COLORS = [
  "#e63946","#f4a261","#2a9d8f","#457b9d","#e9c46a",
  "#6a4c93","#1d3557","#a8dadc","#d4a5a5","#70c1b3",
  "#f1faee","#264653","#e76f51","#06d6a0","#118ab2",
];

const COLS = 14;
const ROWS = 10;

export default function MosaicIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState("build"); // build → hold → shatter → done
  const tiles = useRef([]);
  const animRef = useRef(null);
  const startTime = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initTiles();
    }

    function initTiles() {
      const W = canvas.width, H = canvas.height;
      const tw = W / COLS, th = H / ROWS;
      tiles.current = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          tiles.current.push({
            x: c * tw, y: r * th, w: tw, h: th,
            color: COLORS[idx % COLORS.length],
            alpha: 0,
            delay: (c + r) * 28,         // build delay
            scatterDelay: Math.random() * 400,
            vx: (Math.random() - 0.5) * 18,
            vy: (Math.random() - 0.4) * 16,
            rot: 0, rotV: (Math.random() - 0.5) * 0.25,
            scale: 1,
          });
        }
      }
    }

    resize();
    window.addEventListener("resize", resize);
    startTime.current = performance.now();

    let localPhase = "build";
    let holdStart = null;
    let scatterStart = null;

    function draw(ts) {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // ── BUILD PHASE ───────────────────────────────────
      if (localPhase === "build") {
        let allIn = true;
        tiles.current.forEach(t => {
          const elapsed = ts - startTime.current - t.delay;
          if (elapsed < 0) { allIn = false; return; }
          t.alpha = Math.min(1, elapsed / 180);
          if (t.alpha < 1) allIn = false;

          ctx.save();
          ctx.globalAlpha = t.alpha;
          ctx.fillStyle = t.color;
          ctx.fillRect(t.x + 1, t.y + 1, t.w - 2, t.h - 2);
          ctx.restore();
        });

        // Draw logo text on top once tiles are building
        const progress = Math.min(1, (ts - startTime.current) / 1400);
        if (progress > 0.5) {
          const tp = (progress - 0.5) / 0.5;
          ctx.save();
          ctx.globalAlpha = tp;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          // Title
          ctx.font = `bold ${Math.min(72, W * 0.09)}px 'Playfair Display', serif`;
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 20;
          ctx.fillText("The Mosaic Foundation", W / 2, H / 2 - 24);
          // Subtitle
          ctx.font = `${Math.min(18, W * 0.025)}px 'DM Sans', sans-serif`;
          ctx.letterSpacing = "0.12em";
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.shadowBlur = 10;
          ctx.fillText("BUILT BY YOUTH · DRIVEN BY PURPOSE", W / 2, H / 2 + 36);
          ctx.restore();
        }

        if (allIn) { localPhase = "hold"; holdStart = ts; setPhase("hold"); }
      }

      // ── HOLD PHASE ────────────────────────────────────
      else if (localPhase === "hold") {
        tiles.current.forEach(t => {
          ctx.save();
          ctx.fillStyle = t.color;
          ctx.fillRect(t.x + 1, t.y + 1, t.w - 2, t.h - 2);
          ctx.restore();
        });
        ctx.save();
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = `bold ${Math.min(72, W * 0.09)}px 'Playfair Display', serif`;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 20;
        ctx.fillText("The Mosaic Foundation", W / 2, H / 2 - 24);
        ctx.font = `${Math.min(18, W * 0.025)}px 'DM Sans', sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.shadowBlur = 10;
        ctx.fillText("BUILT BY YOUTH · DRIVEN BY PURPOSE", W / 2, H / 2 + 36);
        ctx.restore();

        if (ts - holdStart > 1200) { localPhase = "shatter"; scatterStart = ts; setPhase("shatter"); }
      }

      // ── SHATTER PHASE ─────────────────────────────────
      else if (localPhase === "shatter") {
        let allGone = true;
        tiles.current.forEach(t => {
          const el = ts - scatterStart - t.scatterDelay;
          if (el < 0) {
            ctx.save(); ctx.fillStyle = t.color;
            ctx.fillRect(t.x + 1, t.y + 1, t.w - 2, t.h - 2);
            ctx.restore(); allGone = false; return;
          }
          const prog = el / 600;
          if (prog >= 1) return;
          allGone = false;
          t.alpha = 1 - prog * prog;
          ctx.save();
          ctx.globalAlpha = t.alpha;
          const cx = t.x + t.w / 2 + t.vx * el * 0.06;
          const cy = t.y + t.h / 2 + t.vy * el * 0.06 + 0.0004 * el * el;
          t.rot += t.rotV;
          ctx.translate(cx, cy);
          ctx.rotate(t.rot);
          const s = 1 + prog * 0.3;
          ctx.scale(s, s);
          ctx.fillStyle = t.color;
          ctx.fillRect(-t.w / 2 + 1, -t.h / 2 + 1, t.w - 2, t.h - 2);
          ctx.restore();
        });

        if (allGone) { localPhase = "done"; setPhase("done"); onDone(); return; }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        pointerEvents: phase === "done" ? "none" : "all",
        opacity: phase === "done" ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}
    />
  );
}
