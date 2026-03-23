import { useRef } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useStaggerReveal, useScrollReveal } from "../hooks/useScrollReveal";
import "./PageShared.css";
import "./Work.css";

const PROJECTS = [
  { title: "The Wall Project",          year: "2024", color: "#ff2d7b", tag: "Community Arts",  desc: "We commissioned 14 murals across 6 cities, each one depicting a local story told by the community itself. Over 3,000 people participated in the ideation process.", impact: "3,000+ participants · 6 cities",  featured: true },
  { title: "Voices Unfiltered",         year: "2024", color: "#b8ff00", tag: "Youth Media",     desc: "A podcast series where teenagers interview decision-makers — from mayors to principals — asking the questions adults often won't.", impact: "28 episodes · 12K listeners",     featured: false },
  { title: "Green Tile Initiative",     year: "2023", color: "#7bffb2", tag: "Environment",     desc: "Teen-led tree planting and waste audit campaigns across three schools, turning environmental data into visual art installations.", impact: "400 trees · 3 schools",          featured: false },
  { title: "Digital Bridge",            year: "2023", color: "#00d4ff", tag: "Education",       desc: "Refurbished and donated 120 laptops to underserved students, paired with a peer-tutoring program run entirely by high schoolers.", impact: "120 laptops · 200 students",     featured: false },
  { title: "Mosaic Mental Health Week", year: "2024", color: "#6c2bd9", tag: "Wellness",        desc: "An annual awareness campaign combining visual art, open mic nights, and school counsellor partnerships to normalise mental health conversations.", impact: "1,200 attendees · 9 schools",   featured: false },
  { title: "The Scholarship Tile",      year: "2024", color: "#ffe14d", tag: "Education",       desc: "A merit-plus-need scholarship fund for students from low-income families to access arts, coding, and leadership programs.", impact: "₹4.2L raised · 18 recipients",  featured: false },
];

function WorkCard({ p, i }) {
  const ref = useRef(null);
  function onMouseMove(e) {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-4px)`;
    el.style.setProperty("--glare-x", `${(e.clientX - rect.left) / rect.width * 100}%`);
    el.style.setProperty("--glare-y", `${(e.clientY - rect.top) / rect.height * 100}%`);
  }
  function onMouseLeave() { if (ref.current) { ref.current.style.transform = ""; } }

  return (
    <article
      ref={ref}
      className={`work-card reveal-child ${p.featured ? "featured" : ""}`}
      style={{ "--pcol": p.color }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="work-card-bar" />
      <div className="work-glare" />
      <div className="work-card-content">
        <div className="work-meta">
          <span className="work-tag">{p.tag}</span>
          <span className="work-year mono">{p.year}</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.desc}</p>
        <div className="work-impact">
          <TrendingUp size={12} color={p.color} />
          <span className="mono">{p.impact}</span>
        </div>
      </div>
    </article>
  );
}

export default function Work({ onNav }) {
  const grid1 = useStaggerReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="work page-enter">
      {/* Hero */}
      <section className="page-hero work-hero">
        <div className="work-hero-bg">
          {PROJECTS.map((p, i) => (
            <span key={i} className="wh-strip" style={{ "--col": p.color, "--i": i }} />
          ))}
        </div>
        <div className="container">
          <span className="tag-glow">Our Work</span>
          <h1>Real projects.<br /><em>Real impact.</em></h1>
          <p>We don't do symbolic gestures. Every project has measurable outcomes and community buy-in from day one.</p>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section">
        <div className="container">
          <div className="work-grid" ref={grid1}>
            {PROJECTS.map((p, i) => <WorkCard key={p.title} p={p} i={i} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="work-cta" ref={ctaRef}>
        <div className="container">
          <div className="work-cta-inner reveal-block">
            <div>
              <span className="tag-glow">Get Involved</span>
              <h2>Have a project idea?</h2>
              <p>We're always looking to expand. Pitch us a community project — if it fits our values, we'll build it together.</p>
            </div>
            <button className="btn btn-primary" onClick={() => onNav("contact")}>
              Pitch a Project <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
