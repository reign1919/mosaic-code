import { useState, useRef } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import MosaicCanvas from "../components/MosaicCanvas";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./PageShared.css";
import "./Contact.css";

const REASONS = ["General Inquiry","Volunteering","Donation / Sponsorship","Partnership","Program Application","Media / Press","Pitch a Project","Other"];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", reason:"", message:"" });
  const formRef = useScrollReveal();
  const infoRef = useScrollReveal();

  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }
  function handleSubmit(e) { e.preventDefault(); setSent(true); }

  return (
    <div className="contact page-enter">
      <section className="page-hero contact-hero">
        <div className="contact-hero-tiles">
          {[...Array(20)].map((_,i) => (
            <span key={i} className="ch-tile" style={{
              "--col":`var(--c${(i%10)+1})`,
              left:`${(i%5)*20 + Math.random()*15}%`,
              top:`${Math.floor(i/5)*25 + Math.random()*15}%`,
              width:`${16+Math.random()*30}px`,
              height:`${16+Math.random()*30}px`,
              animationDelay:`${Math.random()*5}s`,
              animationDuration:`${3+Math.random()*4}s`,
            }}/>
          ))}
        </div>
        <div className="container" style={{ position:"relative" }}>
          <span className="tag-glow">Contact Us</span>
          <h1>Let's add your tile<br /><em>to the mosaic.</em></h1>
          <p>Whether you want to volunteer, donate, partner, or just say hi — we read every message. (We're teenagers with too much time and too much email.)</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          {/* Form */}
          <div className="contact-form-wrap reveal-block" ref={formRef}>
            {sent ? (
              <div className="success-state">
                <div className="success-tiles">
                  {[...Array(9)].map((_,i) => (
                    <span key={i} style={{ background: ["#ff2d7b","#ff6b35","#b8ff00","#00d4ff","#ffe14d","#6c2bd9","#7bffb2","#ff9ee7","#1a0536"][i], borderRadius:4, animation:`successTile 0.6s ease forwards`, animationDelay:`${i*0.05}s`, opacity:0 }}/>
                  ))}
                </div>
                <CheckCircle size={48} color="var(--c3)" />
                <h2>Message received!</h2>
                <p>Thank you for reaching out. One of our team members will get back to you within 2–3 business days.</p>
                <button className="btn btn-outline" onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h2>Send us a message</h2>
                <p className="form-sub">We respond to every single one.</p>
                <div className="form-row">
                  <div className={`form-group ${active==="name"?"focused":""}`}>
                    <label>Your Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} onFocus={()=>setActive("name")} onBlur={()=>setActive(null)} placeholder="e.g. Priya Sharma" required />
                  </div>
                  <div className={`form-group ${active==="email"?"focused":""}`}>
                    <label>Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} onFocus={()=>setActive("email")} onBlur={()=>setActive(null)} placeholder="you@example.com" required />
                  </div>
                </div>
                <div className={`form-group ${active==="reason"?"focused":""}`}>
                  <label>Reason for Contact *</label>
                  <select name="reason" value={form.reason} onChange={handleChange} onFocus={()=>setActive("reason")} onBlur={()=>setActive(null)} required>
                    <option value="">Select a reason…</option>
                    {REASONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className={`form-group ${active==="message"?"focused":""}`}>
                  <label>Your Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} onFocus={()=>setActive("message")} onBlur={()=>setActive(null)} rows={6} placeholder="Tell us what's on your mind…" required />
                </div>
                <button type="submit" className="btn btn-primary submit-btn">
                  Send Message <Send size={15}/>
                </button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="contact-info reveal-block" ref={infoRef}>
            <div className="contact-info-card">
              <h3>Ways to reach us</h3>
              {[
                { icon: <Mail size={15} color="#ff2d7b"/>, label:"Email",   val:"hello@mosaicfoundation.org" },
                { icon: <Phone size={15} color="#b8ff00"/>, label:"Phone",  val:"+91 XXXXX XXXXX" },
                { icon: <MapPin size={15} color="#ffe14d"/>,label:"Based in",val:"India (nationwide)" },
              ].map(d => (
                <div key={d.label} className="contact-detail">
                  <div className="cd-icon">{d.icon}</div>
                  <div><span className="cd-label mono">{d.label}</span><span className="cd-val">{d.val}</span></div>
                </div>
              ))}
            </div>

            <div className="contact-info-card">
              <h4>Response times</h4>
              {[
                { label:"General inquiries",    time:"2–3 days", col:"#b8ff00" },
                { label:"Partnership requests", time:"3–5 days", col:"#ffe14d" },
                { label:"Program applications", time:"1 week",   col:"#ff6b35" },
                { label:"Donation queries",     time:"24–48 hrs",col:"#7bffb2" },
              ].map(r => (
                <div key={r.label} className="response-row">
                  <span>{r.label}</span>
                  <span className="mono" style={{ color: r.col, fontSize:11 }}>{r.time}</span>
                </div>
              ))}
            </div>

            <div className="contact-mosaic-wrap">
              <MosaicCanvas size={260} />
              <p className="mono" style={{ fontSize:10, color:"var(--text3)", textAlign:"center", marginTop:8 }}>
                Every tile a conversation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
