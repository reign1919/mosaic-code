import { useRef } from "react";
import { Mic, Palette, Leaf, Monitor, Brain, GraduationCap, ArrowRight } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "../hooks/useScrollReveal";
import "./PageShared.css";
import "./Programs.css";

const PROGRAMS = [
  { icon: <Mic size={26}/>,          color: "#ff2d7b", name: "Youth Voices Initiative", tagline: "Speak. Be heard. Matter.",          desc: "A structured program giving young people platforms to speak on issues they care about — through debates, public speaking workshops, community radio, and more. We partner with local schools and civic bodies to ensure those voices reach decision-makers.",       details: ["Weekly workshops","Annual summit","School partnerships","Public speaking coaching"], open: true },
  { icon: <Palette size={26}/>,      color: "#ff6b35", name: "Community Arts Lab",       tagline: "Create. Connect. Transform.",       desc: "Art is our native language. This program funds and facilitates community art projects — murals, photography, zines, short films — that tell real stories. No experience required. Just intention.",                                                               details: ["Free materials provided","Mentorship from working artists","Exhibition opportunities","Open to all ages"], open: true },
  { icon: <Leaf size={26}/>,         color: "#b8ff00", name: "Green Mosaic Project",     tagline: "Planet first. Youth-led.",          desc: "Teen environmentalists driving action in their own backyards. Tree planting drives, waste audits, urban gardening, and turning environmental data into public art. Because the planet doesn't have time to wait.",                              details: ["Monthly clean-ups","School partnerships","Data-to-art projects","Carbon tracking"], open: true },
  { icon: <Monitor size={26}/>,      color: "#00d4ff", name: "Digital Bridge",           tagline: "Access is a right, not a privilege.", desc: "We refurbish donated devices, install free educational software, and pair each device with a peer-tutoring commitment. Every laptop comes with a human connection — a fellow teen ready to help.",                                                 details: ["Device donation & repair","Peer tutoring","Digital literacy workshops","Software support"], open: false },
  { icon: <Brain size={26}/>,        color: "#6c2bd9", name: "Mosaic Wellness",          tagline: "You are not alone.",               desc: "Mental health awareness, peer support groups, and open-mic events designed to normalise the conversation. We don't replace professional help — we create the environment where seeking it feels brave.",                                          details: ["Peer support circles","Annual wellness week","Counsellor network","Anonymous helpline"], open: true },
  { icon: <GraduationCap size={26}/>, color: "#ffe14d", name: "The Scholarship Tile",   tagline: "Invest in one, inspire thousands.", desc: "A need-plus-merit scholarship for students who can't afford arts, coding, and leadership programs. Every recipient is expected to give back — by mentoring the next cohort.",                                                                    details: ["Annual scholarship cycle","Mentorship requirement","Program access grant","Applications Jan–Mar"], open: false },
];

function ProgramCard({ p, i }) {
  const ref = useRef(null);
  const cardRef = useScrollReveal();
  function onMouseMove(e) {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y*4}deg) rotateY(${x*4}deg) translateY(-3px)`;
  }
  function onMouseLeave() { if (ref.current) ref.current.style.transform = ""; }

  return (
    <div
      ref={e => { ref.current = e; }}
      className="prog-card reveal-block"
      style={{ "--pcol": p.color, "--delay": `${i * 0.08}s`, transitionDelay: `${i * 0.08}s` }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="prog-card-side" />
      <div className="prog-card-inner">
        <div className="prog-card-head">
          <div className="prog-icon-wrap">
            <div className="prog-icon-tiles">
              {[...Array(4)].map((_, j) => <span key={j} style={{ background: p.color, opacity: 0.2 + j*0.15 }} />)}
            </div>
            <span className="prog-icon-fg">{p.icon}</span>
          </div>
          <div className="prog-badge-wrap">
            {p.open
              ? <span className="prog-badge open">Enrolling Now</span>
              : <span className="prog-badge closed">Closed</span>
            }
          </div>
        </div>
        <span className="prog-tagline mono">{p.tagline}</span>
        <h3>{p.name}</h3>
        <p>{p.desc}</p>
        <ul className="prog-pills">
          {p.details.map(d => <li key={d}>{d}</li>)}
        </ul>
        <button
          className="btn btn-primary prog-btn"
          style={{ background: p.color, boxShadow: `0 4px 20px color-mix(in srgb, ${p.color} 35%, transparent)` }}
        >
          {p.open ? "Apply / Join" : "Get Notified"} <ArrowRight size={14}/>
        </button>
      </div>
    </div>
  );
}

export default function Programs({ onNav }) {
  return (
    <div className="programs page-enter">
      <section className="page-hero programs-hero">
        <div className="programs-hero-mosaic">
          {PROGRAMS.map((p, i) => (
            <div key={i} className="phm-cell" style={{ "--col": p.color, "--i": i }} />
          ))}
        </div>
        <div className="container" style={{ position: "relative" }}>
          <span className="tag-glow">Programs</span>
          <h1>Six programs.<br /><em>One mission.</em></h1>
          <p>Each program is its own tile — distinct, purposeful, beautiful on its own. Together, they form who we are.</p>
          <div className="pill-row">
            {PROGRAMS.map(p => (
              <span key={p.name} className="pill" style={{ borderColor: `color-mix(in srgb, ${p.color} 40%, transparent)`, color: p.color }}>
                {p.name.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="programs-grid">
            {PROGRAMS.map((p, i) => <ProgramCard key={p.name} p={p} i={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
