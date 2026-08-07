const FOOTER_COLS = [
  {
    title: "Product",
    links: ["Features", "How it works", "Pricing", "Changelog", "Roadmap"],
  },
  {
    title: "Practice",
    links: ["Frontend", "Backend", "System Design", "DSA", "Behavioral"],
  },
  { title: "Company", links: ["About", "Blog", "Careers", "Press", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Security"] },
];

export function Footer() {
  return (
    <footer className="section-sm">
      <div className="section-inner">
        <div className="grid-footer">
          <div>
            <div className="footer-logo-row">
              <div className="footer-logo-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                </svg>
              </div>
              <span className="footer-brand-name">MockMadeEasy</span>
            </div>
            <p className="footer-brand-desc">
              AI-powered technical interview practice for software engineers.
            </p>
          </div>
          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title}>
              <p className="footer-col-title">{title}</p>
              <div className="footer-links">
                {links.map((l) => (
                  <button key={l} className="footer-link">
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            © 2024 MockMadeEasy. All rights reserved.
          </p>
          <p className="footer-copy">Built for engineers who want the offer.</p>
        </div>
      </div>
    </footer>
  );
}
