import { useRef } from "react";
import { Users, Zap, Award, BookOpen, ArrowRight } from "lucide-react";
import MosaicCanvas from "../components/MosaicCanvas";
import { useScrollReveal, useStaggerReveal } from "../hooks/useScrollReveal";
import "./PageShared.css";
import "./About.css";

const TEAM = [
  { name: "Ananya Rao",    role: "Founder & CEO",       age: 17, color: "#ff2d7b" },
  { name: "Rohan Mehta",   role: "Programs Director",    age: 16, color: "#b8ff00" },
  { name: "Priya Nair",    role: "Outreach Lead",        age: 17, color: "#ffe14d" },
  { name: "Dev Sharma",    role: "Tech & Media",         age: 15, color: "#00d4ff" },
  { name: "Simran Gill",   role: "Community Manager",    age: 16, color: "#6c2bd9" },
  { name: "Arjun Kapoor",  role: "Finance Officer",      age: 17, color: "#ff6b35" },
];

const VALUES = [
  { icon: <Users size={22}/>, title: "Inclusivity",   desc: "Every voice deserves space in the mosaic, regardless of background, ability, or identity." },
  { icon: <Zap size={22}/>,   title: "Youth Power",   desc: "We don't wait for adults to hand us the tools. We build them ourselves, together, now." },
  { icon: <Award size={22}/>, title: "Excellence",    desc: "Teen-led doesn't mean amateurish. We hold our work to the highest standard." },
  { icon: <BookOpen size={22}/>, title: "Learning",   desc: "Every failure is a tile placed wrong the first time. We rearrange until the picture is right." },
];

const TIMELINE = [
  { year: "2023", title: "The Idea",         desc: "Five teens in a school art room ask: why do nonprofits talk *at* youth instead of *with* them?" },
  { year: "2023", title: "First Program",    desc: "Youth Voices Initiative launches with 12 students and zero budget. Within weeks: 80 sign-ups." },
  { year: "2024", title: "Growing Fast",     desc: "The Wall Project, Digital Bridge, and Mosaic Wellness all launch within 6 months of each other." },
  { year: "2024", title: "2,400+ Lives",     desc: "We cross 2,400 lives touched across 18 cities. Still 100% teen-run. Still zero paid staff." },
  { year: "2025", title: "What's Next",      desc: "Formalising registration, launching two new programs, and expanding to our first international chapter." },
];

function TeamCard({ m, i }) {
  const ref = useRef(null);
  const rotations = [-2, 1.5, -1, 2, -1.5, 1];
  const rot = rotations[i % rotations.length];
  function onMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y*12}deg) rotateY(${x*12}deg) scale(1.05)`;
  }
  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `rotate(${rot}deg)`;
  }
  return (
    <div ref={ref} className="team-card reveal-child" style={{ transform: `rotate(${rot}deg)` }}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {/* Tape sticker on some cards */}
      {i % 3 === 0 && <div className="tape tape-tl" />}
      {i % 3 === 2 && <div className="tape tape-tr" />}
      <div className="team-avatar" style={{ "--col": m.color }}>
        <div className="avatar-mosaic">
          {[...Array(4)].map((_, j) => <span key={j} style={{ background: m.color, opacity: 0.25 + j*0.2 }} />)}
        </div>
        <span className="avatar-initial">{m.name[0]}</span>
      </div>
      <h3>{m.name}</h3>
      <p className="team-role">{m.role}</p>
      <span className="team-age">Age {m.age}</span>
    </div>
  );
}

function ValueCard({ v, i }) {
  const ref = useRef(null);
  const COLORS = ["#ff2d7b","#b8ff00","#ffe14d","#6c2bd9"];
  const col = COLORS[i % COLORS.length];
  const rots = [-1.5, 2, -1, 1.5];
  const rot = rots[i % rots.length];
  function onMouseMove(e) {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(500px) rotateX(${-y*10}deg) rotateY(${x*10}deg) translateY(-4px)`;
  }
  function onMouseLeave() { ref.current && (ref.current.style.transform = `rotate(${rot}deg)`); }
  return (
    <div ref={ref} className="value-card reveal-child" style={{ "--vcol": col, transform: `rotate(${rot}deg)` }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="value-icon">{v.icon}</div>
      <h3>{v.title}</h3>
      <p>{v.desc}</p>
    </div>
  );
}

export default function About({ onNav }) {
  const heroReveal   = useScrollReveal();
  const valuesReveal = useStaggerReveal();
  const teamReveal   = useStaggerReveal();
  const timelineRef  = useStaggerReveal();

  return (
    <div className="about page-enter">
      {/* Hero */}
      <section className="page-hero about-hero">
        <div className="about-hero-tiles">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="ah-tile" style={{
              "--col": `var(--c${(i%10)+1})`,
              "--d": `${Math.random()*5}s`,
              "--dur": `${3+Math.random()*4}s`,
              "--rot": `${(Math.random() - 0.5) * 24}deg`,
            }} />
          ))}
        </div>
        <div className="container" ref={heroReveal}>
          <span className="tag-glow">Our Story</span>
          <h1>We started because<br /><em className="handwritten" style={{ color: "var(--accent)" }}>someone had to.</em></h1>
          <p className="handwritten" style={{ fontSize: 17, lineHeight: 1.7, color: "var(--text2)", maxWidth: 600, marginTop: 16 }}>Born in a school library. Grown into a movement. The Mosaic Foundation was founded by teenagers who believed the most powerful change-makers weren't waiting to grow up — they were already here.</p>
          <div className="pill-row">
            <span className="pill">Est. 2023</span>
            <span className="pill">100% Teen-Led</span>
            <span className="pill">18 Cities</span>
            <span className="pill">2,400+ Lives</span>
          </div>
        </div>
      </section>

      {/* Origin + Canvas */}
      <section className="section about-origin">
        <div className="container about-split">
          <div className="about-text reveal-block" ref={useScrollReveal()}>
            <span className="tag-glow">Est. 2023</span>
            <h2>From a whiteboard<br />idea to a foundation.</h2>
            <p className="handwritten">It began with a simple question: why do nonprofits always talk <em>at</em> young people instead of <em>with</em> them? Five teenagers in a school art room decided to do something different.</p>
            <p className="handwritten">We chose the name "Mosaic" deliberately. A mosaic is made of broken, irregular pieces — and that's exactly what we are. We're not polished or perfect. We're real, we're young, and we fit together into something stunning.</p>
            <p className="handwritten">Today we run five active programs, have touched over 2,400 lives, and are entirely operated by people under 18. Not "youth advisory board" energy — actual leadership, actual decisions, actual impact.</p>
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => onNav("work")}>
              See Our Work <ArrowRight size={15}/>
            </button>
          </div>
          <div className="about-visual">
            <div className="canvas-float">
              <MosaicCanvas size={380} />
              <p className="handwritten" style={{ fontSize: 13, color: "var(--accent)", textAlign: "center", marginTop: 12 }}>
                ↑ Every tile a different story. One foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section timeline-section">
        <div className="container">
          <span className="tag-glow">How We Got Here</span>
          <h2 className="section-title-centered">Our journey</h2>
          <div className="timeline" ref={timelineRef}>
            {TIMELINE.map((t, i) => (
              <div key={i} className="tl-item reveal-child">
                <div className="tl-dot" style={{ "--col": `var(--c${(i%5)+1})` }} />
                <div className="tl-year">{t.year}</div>
                <div className="tl-body">
                  <h4>{t.title}</h4>
                  <p className="handwritten">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section values-section">
        <div className="container">
          <span className="tag-glow">What We Stand For</span>
          <h2 className="section-title-centered">Our Values</h2>
          <div className="values-grid" ref={valuesReveal}>
            {VALUES.map((v, i) => <ValueCard key={v.title} v={v} i={i} />)}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section team-section">
        <div className="container">
          <span className="tag-glow">The People</span>
          <h2 className="section-title-centered">Meet the team</h2>
          <p className="section-sub">All of us are between 15 and 18. All of us are serious about changing the world.</p>
          <div className="team-grid" ref={teamReveal}>
            {TEAM.map((m, i) => <TeamCard key={m.name} m={m} i={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
