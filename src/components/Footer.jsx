import { Heart, Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import "./Footer.css";

export default function Footer({ onNav }) {
  return (
    <footer className="footer">
      {/* Animated mosaic divider */}
      <div className="mosaic-divider">
        {[...Array(10)].map((_,i) => <span key={i}/>)}
      </div>

      <div className="footer-body">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo-tiles">
                {[...Array(9)].map((_,i) => <span key={i} className="ft" style={{"--i":i}}/>)}
              </div>
              <h3>The Mosaic Foundation</h3>
              <p>Every piece matters. Every voice counts. Together we build something beautiful.</p>
              <div className="footer-socials">
                <a href="#" aria-label="Instagram"><Instagram size={16}/></a>
                <a href="#" aria-label="Twitter"><Twitter size={16}/></a>
                <a href="#" aria-label="LinkedIn"><Linkedin size={16}/></a>
                <a href="#" aria-label="Email"><Mail size={16}/></a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Navigate</h4>
              <ul>
                {[["home","Home"],["about","About"],["work","Our Work"],["programs","Programs"],["involved","Get Involved"],["blog","Blog"],["contact","Contact"]].map(([p,l]) => (
                  <li key={p}><button onClick={() => onNav(p)}>{l}</button></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Programs</h4>
              <ul>
                {["Youth Voices Initiative","Community Arts Lab","Green Mosaic Project","Digital Bridge","Mosaic Wellness","The Scholarship Tile"].map(p => (
                  <li key={p}><span>{p}</span></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Get Involved</h4>
              <ul>
                {[["involved","Volunteer"],["involved","Partner With Us"],["contact","Donate"],["contact","Intern"],["contact","Newsletter"],["contact","Press"]].map(([p,l]) => (
                  <li key={l}><button onClick={() => onNav(p)}>{l}</button></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="mono" style={{fontSize:11}}>
              © {new Date().getFullYear()} The Mosaic Foundation · Founded &amp; managed by teens
            </p>
            <p style={{fontSize:13,color:"var(--text3)",display:"flex",alignItems:"center",gap:6}}>
              Made with <Heart size={11} fill="currentColor" color="var(--c1)"/> by youth, for the world
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
