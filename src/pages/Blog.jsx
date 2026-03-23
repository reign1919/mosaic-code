import { useRef } from "react";
import { ArrowRight, Clock, User } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "../hooks/useScrollReveal";
import "./PageShared.css";
import "./Blog.css";

const POSTS = [
  { title: "Why Teen-Led Nonprofits Are Different (And Why That Matters)", author: "Ananya Rao",  date: "Mar 12, 2025", readTime: "5 min", tag: "Leadership",    color: "#ff2d7b", excerpt: "When adults run youth programs, they often build for teens rather than with them. Here's what changes when the power dynamic flips.", featured: true },
  { title: "The Wall Project: What Happened When We Asked a Neighbourhood to Paint Its Own Story", author: "Rohan Mehta", date: "Feb 28, 2025", readTime: "8 min", tag: "Community Arts", color: "#ff6b35", excerpt: "Three cities. Fourteen walls. Thousands of stories. The messy, beautiful reality of community-driven public art.", featured: false },
  { title: "Mental Health in Schools: What Students Wish Teachers Knew", author: "Simran Gill", date: "Feb 10, 2025", readTime: "6 min", tag: "Wellness",     color: "#6c2bd9", excerpt: "We asked 200 students what they needed most from their schools. The answers were honest, heartbreaking, and fixable.", featured: false },
  { title: "How We Raised ₹4.2 Lakhs With Zero Paid Marketing", author: "Dev Sharma",  date: "Jan 22, 2025", readTime: "4 min", tag: "Fundraising",  color: "#b8ff00", excerpt: "A scrappy guide to community fundraising from a 16-year-old who had no idea what he was doing at the start.", featured: false },
  { title: "Environmental Data Doesn't Have to Be Boring: A Case Study", author: "Priya Nair",  date: "Jan 8, 2025",  readTime: "7 min", tag: "Environment",  color: "#7bffb2", excerpt: "We turned three months of waste audit data into a public art installation. Here's the why and the how.", featured: false },
  { title: "What Running a Nonprofit Taught Me About Failure", author: "Arjun Kapoor", date: "Dec 15, 2024", readTime: "5 min", tag: "Reflection",   color: "#ffe14d", excerpt: "The program that flopped. The event nobody came to. The grant we didn't get. And why all of it made us better.", featured: false },
];

function BlogCard({ p, i }) {
  const ref = useRef(null);
  function onMouseMove(e) {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-4px)`;
  }
  function onMouseLeave() { if (ref.current) ref.current.style.transform = ""; }
  return (
    <article ref={ref} className="blog-card reveal-child" style={{ "--bcol": p.color, transitionDelay: `${i*0.07}s` }}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="blog-card-bar" />
      <div className="blog-card-body">
        <div className="blog-meta">
          <span className="blog-tag">{p.tag}</span>
          <span className="blog-time mono"><Clock size={10}/>{p.readTime}</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.excerpt}</p>
        <div className="blog-footer">
          <span className="mono blog-author"><User size={10}/>{p.author} · {p.date}</span>
          <span className="read-more">Read <ArrowRight size={11}/></span>
        </div>
      </div>
    </article>
  );
}

export default function Blog({ onNav }) {
  const featRef  = useScrollReveal();
  const gridRef  = useStaggerReveal();
  const nlRef    = useScrollReveal();
  const featured = POSTS[0];

  return (
    <div className="blog page-enter">
      <section className="page-hero blog-hero">
        <div className="blog-hero-strip">
          {POSTS.map((p,i) => <span key={i} style={{ background: p.color, opacity: 0.07, flex: 1 }} />)}
        </div>
        <div className="container" style={{ position: "relative" }}>
          <span className="tag-glow">The Blog</span>
          <h1>Stories, lessons,<br /><em>and honest takes.</em></h1>
          <p>Written by the teens who run this place. No PR polish. No corporate voice. Just real reflections on real work.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Featured */}
          <div className="blog-featured reveal-block" ref={featRef} style={{ "--bcol": featured.color }}>
            <div className="bf-bar" />
            <div className="bf-content">
              <div className="bf-left">
                <div className="blog-meta">
                  <span className="blog-tag">{featured.tag}</span>
                  <span className="blog-time mono"><Clock size={10}/> {featured.readTime} read</span>
                  <span className="blog-time mono"><User size={10}/> {featured.author}</span>
                </div>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <button className="btn btn-primary" style={{ marginTop: 22, background: featured.color }}>
                  Read Article <ArrowRight size={14}/>
                </button>
              </div>
              <div className="bf-right">
                <div className="bf-visual">
                  <div className="bf-tiles">
                    {[...Array(9)].map((_,i) => (
                      <span key={i} style={{
                        background: ["#ff2d7b","#ff6b35","#b8ff00","#00d4ff","#ffe14d","#6c2bd9","#7bffb2","#ff9ee7","#1a0536"][i],
                        borderRadius: 4, animation: `bfTile 3s ease-in-out infinite`, animationDelay: `${i*0.2}s`
                      }}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="blog-grid" ref={gridRef}>
            {POSTS.slice(1).map((p, i) => <BlogCard key={p.title} p={p} i={i} />)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="blog-newsletter" ref={nlRef}>
        <div className="container blog-nl-inner reveal-block">
          <div>
            <span className="tag-glow">Newsletter</span>
            <h2>Stay in the picture.</h2>
            <p>Monthly updates — new projects, stories, and ways to get involved.</p>
          </div>
          <div className="nl-form">
            <input type="email" placeholder="your@email.com" />
            <button className="btn btn-primary">Subscribe <ArrowRight size={14}/></button>
          </div>
        </div>
      </section>
    </div>
  );
}
