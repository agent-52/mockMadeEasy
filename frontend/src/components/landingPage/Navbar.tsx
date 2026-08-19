import { useState, useEffect } from "react";
import { Link } from "react-router";
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Analytics", href: "#analytics" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>
      {/* ── Main bar ── */}
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#" className="navbar-brand" style={{ textDecoration: "none" }}>
          <div className="navbar-logo-icon">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="5" cy="8" r="2.5" fill="#000" />
              <circle cx="11" cy="5" r="2" fill="#000" />
              <circle cx="11" cy="11" r="2" fill="#000" />
              <line
                x1="7.5"
                y1="8"
                x2="9"
                y2="5"
                stroke="#000"
                strokeWidth="1.2"
              />
              <line
                x1="7.5"
                y1="8"
                x2="9"
                y2="11"
                stroke="#000"
                strokeWidth="1.2"
              />
            </svg>
          </div>
          <span className="navbar-brand-name">MockMadeEasy</span>
        </a>

        {/* Center nav links — hidden on mobile via CSS media query */}
        <div className="navbar-links-center">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="nav-link-pill">
              {label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          <Link to="/auth">
            <button className="btn-nav-login">Login</button>
          </Link>
          <Link to="/auth">
            <button className="btn-nav-start">Get Started</button>
          </Link>

          {/* Hamburger — visible on mobile via CSS media query */}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div className="navbar-mobile">
          <div className="navbar-mobile-links">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="navbar-mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="navbar-mobile-ctas">
            <Link to="/auth">
              <button className="btn-nav-login">Login</button>
            </Link>
            <Link to="/auth">
              <button className="btn-nav-start">Get Started</button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
