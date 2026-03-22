import { useEffect, useRef, useState } from "react";

const PALETTE = [
  "#e63946","#f4a261","#2a9d8f","#457b9d","#e9c46a",
  "#6a4c93","#1d3557","#a8dadc","#d4a5a5","#70c1b3",
  "#f1faee","#264653","#e76f51","#06d6a0","#118ab2",
  "#ffb703","#fb8500","#219ebc","#023047","#8ecae6",
];

function hslFromHex(hex) {
  let r = parseInt(hex.slice(1,3),16)/255;
  let g = parseInt(hex.slice(3,5),16)/255;
  let b = parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0}else{
    const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}
    h/=6;
  }
  return `hsl(${Math.round(h*360)},${Math.round(s*100)}%,${Math.round(l*100)}%)`;
}

export default function MosaicCanvas({ size = 400, interactive = true }) {
  const canvasRef = useRef(null);
  const tilesRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const [hovered, setHovered] = useState(null);
  const animRef = useRef(null);
  const COLS = 8, ROWS = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = size;
    const H = canvas.height = size;
    const tw = W / COLS, th = H / ROWS;

    // Init tiles
    tilesRef.current = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const baseColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        tilesRef.current.push({
          c, r,
          x: c * tw, y: r * th, w: tw, h: th,
          color: baseColor,
          targetColor: baseColor,
          scale: 1, targetScale: 1,
          alpha: 1,
          glow: 0, targetGlow: 0,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function lerp(a, b, t) { return a + (b - a) * t; }

    function draw(ts) {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      tilesRef.current.forEach(t => {
        t.pulse += 0.02;
        const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
        const dist = Math.hypot(mx - cx, my - cy);
        const radius = tw * 2.2;
        const near = dist < radius;

        t.targetScale = near ? 1 + 0.18 * (1 - dist / radius) : 1;
        t.targetGlow  = near ? (1 - dist / radius) : 0;
        t.scale = lerp(t.scale, t.targetScale, 0.12);
        t.glow  = lerp(t.glow, t.targetGlow, 0.1);

        // Subtle pulse brightness
        const bright = 1 + Math.sin(t.pulse) * 0.03;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(t.scale * bright, t.scale * bright);

        if (t.glow > 0.01) {
          ctx.shadowColor = t.color;
          ctx.shadowBlur = t.glow * 28;
        }

        // Draw tile with slight gap
        const gap = 2;
        ctx.fillStyle = t.color;
        ctx.beginPath();
        const rx = -t.w/2 + gap, ry = -t.h/2 + gap;
        const rw = t.w - gap*2, rh = t.h - gap*2;
        ctx.roundRect(rx, ry, rw, rh, 3);
        ctx.fill();

        // Highlight overlay for hovered
        if (t.glow > 0.01) {
          ctx.fillStyle = `rgba(255,255,255,${t.glow * 0.18})`;
          ctx.beginPath();
          ctx.roundRect(rx, ry, rw, rh, 3);
          ctx.fill();
        }

        ctx.restore();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  function handleMouseMove(e) {
    if (!interactive) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;
    mouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }
  function handleMouseLeave() { mouseRef.current = { x: -999, y: -999 }; }

  function handleClick(e) {
    if (!interactive) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    const tw = size / 8;
    const c = Math.floor(mx / tw), r = Math.floor(my / tw);
    const tile = tilesRef.current.find(t => t.c === c && t.r === r);
    if (tile) {
      tile.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      // ripple effect on neighbors
      tilesRef.current.forEach(t => {
        const d = Math.abs(t.c - c) + Math.abs(t.r - r);
        if (d <= 2 && d > 0) {
          setTimeout(() => {
            t.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
          }, d * 60);
        }
      });
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      title="Click any tile to paint it!"
      style={{
        width: "100%", maxWidth: size, height: "auto",
        display: "block",
        cursor: interactive ? "crosshair" : "default",
        borderRadius: "16px",
      }}
    />
  );
}
