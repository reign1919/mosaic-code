import { useRef } from "react";
import { Heart, Handshake, Briefcase, PenLine, ArrowRight, ChevronDown } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "../hooks/useScrollReveal";
import "./PageShared.css";
import "./Involved.css";

const WAYS = [
  { icon: <Heart size={24}/>,     color: "#e63946", title: "Donate",   sub: "Fund the work",   desc: "Every rupee goes directly to programs. No bloated admin costs — we're teens working on borrowed time and genuine passion." },
  { icon: <Handshake size={24}/>, color: "#2a9d8f", title: "Volunteer",sub: "Give your time",  desc: "From event photography to graphic design, spreadsheet management to mentorship — we need people with skills and heart." },
  { icon: <Briefcase size={24}/>, color: "#457b9d", title: "Partner",  sub: "Work with us",    desc: "Schools, businesses, NGOs, and government bodies — if your mission overlaps with ours, let's build something together." },
  { icon: <PenLine size={24}/>,   color: "#e9c46a", title: "Intern",   sub: "Learn by doing",  desc: "We offer structured internships for students who want real nonprofit experience. Real projects. Real responsibilities. No coffee runs." },
];

const TIERS = [
  { amt: "₹199", label: "Supporter", desc: "Workshop materials for one student", col: "#e63946" },
  { amt: "₹499", label: "Advocate",  desc: "One community art supply kit",       col: "#2a9d8f" },
  { amt: "₹999", label: "Champion",  desc: "Funds a full community event",        col: "#6a4c93" },
  { amt: "Custom",label: "Patron",   desc: "Name your own contribution",          col: "#e9c46a" },
];

const FAQ = [
  { q: "Do I need to be a teenager to get involved?", a: "No! While our leadership is teen-run, we welcome volunteers and partners of all ages. Adult mentors are a huge part of our ecosystem." },
  { q: "How are donations used?",                    a: "100% of donations go to programs and direct costs. Our founding team is entirely volunteer-based, so there are no salaries." },
  { q: "Can I propose a new program?",               a: "Absolutely. We love community-driven ideas. Reach out through the contact page with a brief proposal and we'll set up a call." },
  { q: "Is The Mosaic Foundation registered?",       a: "We are currently in the process of formal registration under relevant Indian nonprofit regulations. Updates will be published here." },
];

function WayCard({ w, i, onNav }) {
  const ref = useRef(null);
  function onMouseMove(e) {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y*9}deg) rotateY(${x*9}deg) scale(1.03)`;
  }
  function onMouseLeave() { if (ref.current) ref.current.style.transform = ""; }
  return (
    <div ref={ref} className="way-card reveal-child" style={{ "--wcol": w.color, transitionDelay: `${i*0.07}s` }}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="way-icon">{w.icon}</div>
      <span className="way-label mono">{w.sub}</span>
      <h3>{w.title}</h3>
      <p>{w.desc}</p>
      <button className="btn btn-outline way-btn" onClick={() => onNav("contact")}>
        {w.title} Now <ArrowRight size={13}/>
      </button>
    </div>
  );
}

export default function Involved({ onNav }) {
  const waysRef = useStaggerReveal();
  const donateRef = useScrollReveal();
  const faqRef = useScrollReveal();

  return (
    <div className="involved page-enter">
      <section className="page-hero involved-hero">
        <div className="inv-hero-tiles">
          {[...Array(16)].map((_,i)=>(
            <span key={i} className="inv-tile" style={{
              "--col":`var(--c${(i%10)+1})`,
              "--d":`${Math.random()*5}s`,
              "--dur":`${3+Math.random()*4}s`,
              left:`${Math.random()*100}%`,
              top:`${Math.random()*100}%`,
              width:`${12+Math.random()*32}px`,
              height:`${12+Math.random()*32}px`,
            }}/>
          ))}
        </div>
        <div className="container" style={{position:"relative"}}>
          <span className="tag-glow">Get Involved</span>
          <h1>There's a place here<br /><em>for you.</em></h1>
          <p>A mosaic needs many kinds of tiles. Whatever you bring — time, money, skills, or simply belief — we have a place for it.</p>
        </div>
      </section>

      {/* Ways */}
      <section className="section">
        <div className="container">
          <span className="tag-glow">How You Can Help</span>
          <div className="ways-grid" ref={waysRef}>
            {WAYS.map((w,i) => <WayCard key={w.title} w={w} i={i} onNav={onNav}/>)}
          </div>
        </div>
      </section>

      {/* Donate */}
      <section className="donate-band" ref={donateRef}>
        <div className="container">
          <div className="donate-inner reveal-block">
            <div className="donate-text">
              <span className="tag-glow">Donate</span>
              <h2>Even one tile<br />changes the picture.</h2>
              <p>No amount is too small. We're transparent about where every rupee goes — and we'll show you the impact.</p>
            </div>
            <div className="donate-tiers">
              {TIERS.map((t,i) => (
                <button key={t.amt} className="donate-tier" style={{ "--tcol": t.col, animationDelay: `${i*0.1}s` }} onClick={()=>onNav("contact")}>
                  <span className="tier-amt">{t.amt}</span>
                  <span className="tier-label">{t.label}</span>
                  <span className="tier-desc">{t.desc}</span>
                  <div className="tier-bar" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section" ref={faqRef}>
        <div className="container">
          <span className="tag-glow">Questions</span>
          <h2 className="section-title-centered">Frequently asked</h2>
          <div className="faq-list">
            {FAQ.map(f => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}<ChevronDown size={16} className="faq-chevron"/></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
