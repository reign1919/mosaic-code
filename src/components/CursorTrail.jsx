import { useEffect, useRef } from "react";
import "./CursorTrail.css";

const COLORS = [
  "#e63946","#f4a261","#2a9d8f","#457b9d","#e9c46a",
  "#6a4c93","#a8dadc","#d4a5a5","#70c1b3","#f1faee",
];
const TRAIL_LEN = 12;

export default function CursorTrail() {
  const cursorRef = useRef(null);
  const posRef    = useRef({ x: -300, y: -300 });
  const smoothRef = useRef({ x: -300, y: -300 });
  const frameRef  = useRef(null);
  const onLinkRef = useRef(false);

  useEffect(() => {
    /* ── Trail container ── */
    const container = document.createElement("div");
    container.className = "cursor-trail-container";
    document.body.appendChild(container);

    /* ── Trail tiles ── */
    const tiles = Array.from({ length: TRAIL_LEN }, (_, i) => {
      const el = document.createElement("div");
      el.className = "cursor-tile";
      el.style.setProperty("--col", COLORS[i % COLORS.length]);
      container.appendChild(el);
      return { el, x: -300, y: -300 };
    });

    /* ── Sparkle burst on click ── */
    function spawnBurst(cx, cy) {
      const count = 10;
      for (let i = 0; i < count; i++) {
        const s = document.createElement("div");
        s.className = "cursor-spark";
        const angle = (i / count) * Math.PI * 2;
        const dist  = 28 + Math.random() * 28;
        s.style.setProperty("--col", COLORS[Math.floor(Math.random() * COLORS.length)]);
        s.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
        s.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
        s.style.left = cx + "px";
        s.style.top  = cy + "px";
        container.appendChild(s);
        setTimeout(() => s.remove(), 600);
      }
    }

    /* ── Event handlers ── */
    function onMove(e) {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      }
    }
    function onDown(e) {
      cursorRef.current?.classList.add("pressed");
      spawnBurst(e.clientX, e.clientY);
    }
    function onUp()  { cursorRef.current?.classList.remove("pressed"); }
    function onOver(e) {
      if (e.target.closest("a,button,input,textarea,select,canvas,[role=button]")) {
        cursorRef.current?.classList.add("on-link");
        onLinkRef.current = true;
      }
    }
    function onOut(e) {
      if (e.target.closest("a,button,input,textarea,select,canvas,[role=button]")) {
        cursorRef.current?.classList.remove("on-link");
        onLinkRef.current = false;
      }
    }

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseup",    onUp);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);

    /* ── RAF loop ── */
    function animate() {
      smoothRef.current.x += (posRef.current.x - smoothRef.current.x) * 0.16;
      smoothRef.current.y += (posRef.current.y - smoothRef.current.y) * 0.16;

      tiles.forEach((tile, i) => {
        const target = i === 0 ? smoothRef.current : tiles[i - 1];
        const lag = 0.18 - i * 0.012;
        tile.x += (target.x - tile.x) * lag;
        tile.y += (target.y - tile.y) * lag;
        const scale = Math.max(0.1, 1 - i / TRAIL_LEN);
        const alpha = Math.max(0, (1 - i / TRAIL_LEN) * 0.7);
        const rot   = i * 15;
        tile.el.style.transform = `translate(${tile.x}px,${tile.y}px) scale(${scale}) rotate(${rot}deg)`;
        tile.el.style.opacity   = alpha;
      });

      frameRef.current = requestAnimationFrame(animate);
    }
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup",   onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      cancelAnimationFrame(frameRef.current);
      document.body.removeChild(container);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor">
      <div className="cursor-ring" />
      <div className="cursor-dot"  />
    </div>
  );
}
