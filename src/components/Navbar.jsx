import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import "./Navbar.css";

const LINKS = [
  { label: "Home", path: "home" },
  { label: "About", path: "about" },
  { label: "Our Work", path: "work" },
  { label: "Programs", path: "programs" },
  { label: "Get Involved", path: "involved" },
  { label: "Blog", path: "blog" },
  { label: "Contact", path: "contact" },
];

export default function Navbar({ active, onNav, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function go(path) { onNav(path); setMobileOpen(false); }

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Logo */}
          <button className="nav-logo" onClick={() => go("home")}>
            <span className="logo-tiles">
              {[...Array(4)].map((_, i) => <span key={i} className="logo-tile" style={{ "--i": i }} />)}
            </span>
            <span>
              <span className="logo-name">The Mosaic</span>
              <span className="logo-sub">Foundation</span>
            </span>
          </button>

          {/* Desktop Links */}
          <ul className="nav-links">
            {LINKS.map(l => (
              <li key={l.path}>
                <button
                  className={`nav-link ${active === l.path ? "active" : ""}`}
                  onClick={() => go(l.path)}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn btn-primary donate-btn" onClick={() => go("contact")}>
              Donate
            </button>
            <button className="hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <ul>
          {LINKS.map(l => (
            <li key={l.path}>
              <button className={`mobile-link ${active === l.path ? "active" : ""}`} onClick={() => go(l.path)}>
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => go("contact")}>
              Donate Now
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
