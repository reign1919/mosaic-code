import { useEffect, useRef, useState } from "react";

const COLORS = [
  "#ff2d7b","#ff6b35","#b8ff00","#6c2bd9","#ffe14d",
  "#00d4ff","#1a0536","#ff9ee7","#7bffb2","#ff4444",
  "#f0e8ff","#2a1a4a","#ff6b35","#00d4ff","#b8ff00",
];

const COLS = 12;
const ROWS = 8;

export default function MosaicIntro({ onDone }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState("build");
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
            delay: Math.random() * 600,        // Random sticker-slap timing
            scatterDelay: Math.random() * 300,
            vx: (Math.random() - 0.5) * 22,
            vy: (Math.random() - 0.4) * 20,
            rot: 0, rotV: (Math.random() - 0.5) * 0.3,
            targetRot: (Math.random() - 0.5) * 0.15, // slight permanent rotation
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

      // Dark violet background
      ctx.fillStyle = "#0a0418";
      ctx.fillRect(0, 0, W, H);

      // ── BUILD PHASE — stop-motion sticker slaps ──
      if (localPhase === "build") {
        let allIn = true;
        tiles.current.forEach(t => {
          const elapsed = ts - startTime.current - t.delay;
          if (elapsed < 0) { allIn = false; return; }

          // Snap in like a sticker (no smooth fade — jump frames)
          const frame = Math.floor(elapsed / 30);
          if (frame < 1) { allIn = false; return; }
          if (frame < 2) {
            t.alpha = 0.5;
            t.scale = 1.3;
          } else if (frame < 3) {
            t.alpha = 0.9;
            t.scale = 1.1;
          } else {
            t.alpha = 1;
            t.scale = 1;
          }
          if (frame < 4) allIn = false;

          ctx.save();
          ctx.globalAlpha = t.alpha;
          const cx = t.x + t.w / 2;
          const cy = t.y + t.h / 2;
          ctx.translate(cx, cy);
          ctx.rotate(t.targetRot);
          ctx.scale(t.scale, t.scale);
          ctx.fillStyle = t.color;
          // Sticker border
          ctx.fillRect(-t.w / 2 + 2, -t.h / 2 + 2, t.w - 4, t.h - 4);
          ctx.strokeStyle = "rgba(0,0,0,0.15)";
          ctx.lineWidth = 2;
          ctx.strokeRect(-t.w / 2 + 2, -t.h / 2 + 2, t.w - 4, t.h - 4);
          ctx.restore();
        });

        // Logo text with sticker shadow
        const progress = Math.min(1, (ts - startTime.current) / 1000);
        if (progress > 0.4) {
          const tp = Math.min(1, (progress - 0.4) / 0.3);
          ctx.save();
          ctx.globalAlpha = tp;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Hard shadow (brutalist)
          ctx.font = `${Math.min(72, W * 0.08)}px 'Titan One', cursive`;
          ctx.fillStyle = "rgba(0,0,0,0.4)";
          ctx.fillText("THE MOSAIC", W / 2 + 4, H / 2 - 20 + 4);
          ctx.fillStyle = "#ffffff";
          ctx.fillText("THE MOSAIC", W / 2, H / 2 - 20);

          // Subtitle in handwriting
          ctx.font = `${Math.min(20, W * 0.028)}px 'Kalam', cursive`;
          ctx.fillStyle = "rgba(184,255,0,0.9)";
          ctx.fillText("FOUNDATION ✦ BUILT BY YOUTH", W / 2, H / 2 + 36);
          ctx.restore();
        }

        if (allIn) { localPhase = "hold"; holdStart = ts; setPhase("hold"); }
      }

      // ── HOLD PHASE ──
      else if (localPhase === "hold") {
        tiles.current.forEach(t => {
          ctx.save();
          const cx = t.x + t.w / 2;
          const cy = t.y + t.h / 2;
          ctx.translate(cx, cy);
          ctx.rotate(t.targetRot);
          ctx.fillStyle = t.color;
          ctx.fillRect(-t.w / 2 + 2, -t.h / 2 + 2, t.w - 4, t.h - 4);
          ctx.strokeStyle = "rgba(0,0,0,0.15)";
          ctx.lineWidth = 2;
          ctx.strokeRect(-t.w / 2 + 2, -t.h / 2 + 2, t.w - 4, t.h - 4);
          ctx.restore();
        });
        ctx.save();
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = `${Math.min(72, W * 0.08)}px 'Titan One', cursive`;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillText("THE MOSAIC", W / 2 + 4, H / 2 - 20 + 4);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("THE MOSAIC", W / 2, H / 2 - 20);
        ctx.font = `${Math.min(20, W * 0.028)}px 'Kalam', cursive`;
        ctx.fillStyle = "rgba(184,255,0,0.9)";
        ctx.fillText("FOUNDATION ✦ BUILT BY YOUTH", W / 2, H / 2 + 36);
        ctx.restore();

        if (ts - holdStart > 1000) { localPhase = "shatter"; scatterStart = ts; setPhase("shatter"); }
      }

      // ── SHATTER PHASE — tiles fling away like stickers peeling ──
      else if (localPhase === "shatter") {
        let allGone = true;
        tiles.current.forEach(t => {
          const el = ts - scatterStart - t.scatterDelay;
          if (el < 0) {
            ctx.save();
            const cx = t.x + t.w / 2;
            const cy = t.y + t.h / 2;
            ctx.translate(cx, cy);
            ctx.rotate(t.targetRot);
            ctx.fillStyle = t.color;
            ctx.fillRect(-t.w / 2 + 2, -t.h / 2 + 2, t.w - 4, t.h - 4);
            ctx.restore(); allGone = false; return;
          }
          const prog = el / 500;
          if (prog >= 1) return;
          allGone = false;
          t.alpha = 1 - prog * prog;
          ctx.save();
          ctx.globalAlpha = t.alpha;
          const cx = t.x + t.w / 2 + t.vx * el * 0.08;
          const cy = t.y + t.h / 2 + t.vy * el * 0.08 + 0.0005 * el * el;
          t.rot += t.rotV;
          ctx.translate(cx, cy);
          ctx.rotate(t.rot);
          const s = 1 + prog * 0.4;
          ctx.scale(s, s);
          ctx.fillStyle = t.color;
          ctx.fillRect(-t.w / 2 + 2, -t.h / 2 + 2, t.w - 4, t.h - 4);
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
        transition: "opacity 0.3s ease",
      }}
    />
  );
}
