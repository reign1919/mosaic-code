import { useState, useEffect, useCallback, useRef } from "react";
import MosaicIntro from "./components/MosaicIntro";
import PageLoader from "./components/PageLoader";
import CursorTrail from "./components/CursorTrail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Work from "./pages/Work";
import Programs from "./pages/Programs";
import Involved from "./pages/Involved";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";

const PAGES = { home: Home, about: About, work: Work, programs: Programs, involved: Involved, blog: Blog, contact: Contact };

export default function App() {
  const [introDone, setIntroDone]   = useState(false);
  const [page, setPage]             = useState("home");
  const [loading, setLoading]       = useState(false);
  const [pageKey, setPageKey]       = useState(0);
  const [theme, setTheme]           = useState(() => {
    try { const s = localStorage.getItem("tmf-theme"); if (s) return s; } catch(e) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("tmf-theme", theme); } catch(e) {}
  }, [theme]);

  const navigate = useCallback((to) => {
    if (to === page) return;
    setLoading(true);
    // Show loader for 900ms then swap page
    setTimeout(() => {
      setPage(to);
      setPageKey(k => k + 1);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 900);
  }, [page]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");
  const PageComponent = PAGES[page] || Home;

  return (
    <>
      {/* Mosaic shatter intro — only on first load */}
      {!introDone && <MosaicIntro onDone={() => setIntroDone(true)} />}

      {/* Custom cursor + tile trail (desktop only) */}
      <CursorTrail />

      {/* Page-transition loader — cursive "Mosaic" signature */}
      <PageLoader show={loading} />

      <div style={{ opacity: introDone ? 1 : 0, transition: "opacity 0.6s ease 0.2s", visibility: introDone ? "visible" : "hidden" }}>
        <Navbar active={page} onNav={navigate} theme={theme} toggleTheme={toggleTheme} />
        <main>
          <PageComponent key={pageKey} onNav={navigate} />
        </main>
        <Footer onNav={navigate} />
      </div>
    </>
  );
}
