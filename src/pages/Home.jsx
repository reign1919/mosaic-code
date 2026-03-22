import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles, Users, Globe, Heart } from "lucide-react";
import MosaicCanvas from "../components/MosaicCanvas";
import { useScrollReveal, useStaggerReveal } from "../hooks/useScrollReveal";
import "./Home.css";

const STATS = [
  { n: "2,400+", label: "Lives Touched",   col: "#e63946" },
  { n: "18",     label: "Cities Reached",  col: "#2a9d8f" },
  { n: "100%",   label: "Teen-Led",         col: "#e9c46a" },
  { n: "5",      label: "Active Programs",  col: "#6a4c93" },
];

const CAUSES = [
  { icon: <Sparkles size={22}/>, color: "#e63946", title: "Youth Empowerment", desc: "Giving young people tools, platforms, and confidence to lead change in their communities." },
  { icon: <Users size={22}/>,    color: "#2a9d8f", title: "Community Arts",    desc: "Using creative expression to heal, connect, and document the stories that matter most." },
  { icon: <Globe size={22}/>,    color: "#457b9d", title: "Environmental Action", desc: "Teen-led sustainability initiatives tackling local ecological challenges with global vision." },
  { icon: <Heart size={22}/>,    color: "#6a4c93", title: "Mental Wellness",   desc: "Breaking stigmas and building safe spaces for young people to speak, listen, and heal." },
];

const TESTIMONIALS = [
  { quote: "The Mosaic Foundation gave me a microphone when I only had a whisper.", name: "Riya, 16", role: "Youth Voices alumni", col: "#e63946" },
  { quote: "We painted a mural on our school wall. I finally felt like the school was mine.", name: "Kabir, 15", role: "Community Arts participant", col: "#2a9d8f" },
  { quote: "I never thought a teen could run a proper program. Then I saw what these guys were doing.", name: "Meera, parent", role: "Volunteer supporter", col: "#e9c46a" },
];

function CauseCard({ c }) {
  const ref = useRef(null);
  function onMouseMove(e) {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y*10}deg) rotateY(${x*10}deg) scale(1.04)`;
    el.style.setProperty("--gx", `${(e.clientX - rect.left) / rect.width * 100}%`);
    el.style.setProperty("--gy", `${(e.clientY - rect.top) / rect.height * 100}%`);
  }
  function onMouseLeave() { if (ref.current) ref.current.style.transform = ""; }
  return (
    <div ref={ref} className="cause-card reveal-child" style={{ "--ccol": c.color }}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="cause-glare" />
      <div className="cause-icon">{c.icon}</div>
      <h3>{c.title}</h3>
      <p>{c.desc}</p>
    </div>
  );
}

export default function Home({ onNav }) {
  const heroRef      = useRef(null);
  const causesRef    = useStaggerReveal();
  const statsRef     = useStaggerReveal();
  const testiRef     = useStaggerReveal();
  const ctaRef       = useScrollReveal();

  // Parallax tilt on hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.setProperty("--rx", `${y * 4}deg`);
      el.style.setProperty("--ry", `${-x * 4}deg`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="home page-enter">

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          {[...Array(24)].map((_, i) => (
            <span key={i} className="bg-tile" style={{
              "--delay": `${Math.random() * 7}s`,
              "--dur":   `${3 + Math.random() * 5}s`,
              "--col":   `var(--c${(i % 10) + 1})`,
              left:  `${Math.random() * 100}%`,
              top:   `${Math.random() * 100}%`,
              width: `${16 + Math.random() * 56}px`,
              height:`${16 + Math.random() * 56}px`,
            }} />
          ))}
        </div>

        <div className="container hero-inner">
          <div className="hero-text">
            <span className="tag-glow">Founded &amp; Managed by Teens</span>
            <h1 className="hero-title">
              Every piece<br />
              <em>matters.</em> Every<br />
              voice <span className="accent-word">counts.</span>
            </h1>
            <p className="hero-desc">
              The Mosaic Foundation is a youth-driven nonprofit weaving together diverse stories,
              talents, and visions into something greater than any single piece alone.
            </p>
            <div className="hero-btns">
              <button className="btn btn-primary" onClick={() => onNav("about")}>
                Our Story <ArrowRight size={16}/>
              </button>
              <button className="btn btn-outline" onClick={() => onNav("involved")}>
                Join Us
              </button>
            </div>
          </div>

          <div className="hero-mosaic">
            <div className="mosaic-wrapper">
              <div className="mosaic-glow" />
              <MosaicCanvas size={480} />
              <p className="mosaic-hint mono">click any tile to repaint it</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          <div className="container stats-inner" ref={statsRef}>
            {STATS.map((s, i) => (
              <div key={s.n} className="stat reveal-child" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="stat-n" style={{ color: s.col }}>{s.n}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="section causes-section">
        <div className="container">
          <span className="tag-glow">What We Do</span>
          <h2 className="section-title">Four pillars.<br />One foundation.</h2>
          <div className="causes-grid" ref={causesRef}>
            {CAUSES.map(c => <CauseCard key={c.title} c={c} />)}
          </div>
        </div>
      </section>

      {/* ── QUOTE BANNER ── */}
      <section className="quote-banner">
        <div className="qb-tiles">
          {[...Array(30)].map((_, i) => (
            <span key={i} className="qb-tile" style={{
              "--col": `var(--c${(i % 10) + 1})`,
              "--d":   `${Math.random() * 4}s`,
              "--dur": `${2 + Math.random() * 3}s`,
            }} />
          ))}
        </div>
        <div className="container qb-inner">
          <div className="qb-mark">"</div>
          <blockquote>
            We are not fragments waiting to be fixed.<br />
            We are tiles waiting to find our place in the mosaic.
          </blockquote>
          <cite>— The Mosaic Foundation</cite>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testimonials-section">
        <div className="container">
          <span className="tag-glow">Voices</span>
          <h2 className="section-title">What people say</h2>
          <div className="testi-grid" ref={testiRef}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card reveal-child" style={{ "--tcol": t.col, transitionDelay: `${i * 0.1}s` }}>
                <div className="testi-bar" />
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-who">
                  <div className="testi-avatar" style={{ background: t.col }}>{t.name[0]}</div>
                  <div>
                    <span className="testi-name">{t.name}</span>
                    <span className="testi-role mono">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section" ref={ctaRef}>
        <div className="container">
          <div className="cta-inner reveal-block">
            <div className="cta-tiles-bg">
              {[...Array(6)].map((_,i) => (
                <span key={i} className="cta-bg-tile" style={{ "--col": `var(--c${i+1})`, "--i": i }} />
              ))}
            </div>
            <div className="cta-content">
              <span className="tag-glow" style={{ "--accent": "#fff", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)" }}>
                Be Part of the Picture
              </span>
              <h2>Ready to add your<br />piece to the mosaic?</h2>
              <p>Whether you want to volunteer, donate, partner, or just learn more — there's a tile here with your name on it.</p>
              <div className="cta-btns">
                <button className="btn cta-btn-primary" onClick={() => onNav("involved")}>
                  Get Involved <ArrowRight size={16}/>
                </button>
                <button className="btn cta-btn-ghost" onClick={() => onNav("contact")}>
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
