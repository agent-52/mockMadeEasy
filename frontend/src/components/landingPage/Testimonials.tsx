import type { RefObject } from "react";
import { useInView } from "../../hooks/useInView";
import { sv } from "../../common/sv";

const TESTIMONIALS = [
  {
    quote:
      "I did 8 sessions over two weeks before my Google loop. Got an offer. The feedback on my communication style was something no Leetcode grind could have given me.",
    name: "Arjun S.",
    role: "Software Engineer → Google L5",
    avatar: "AS",
  },
  {
    quote:
      "I failed the same system design round twice before finding MockMadeEasy. After 6 sessions I passed at Stripe. The score breakdowns are brutally honest in the best way.",
    name: "Michelle T.",
    role: "Backend Engineer → Stripe",
    avatar: "MT",
  },
  {
    quote:
      "The follow-up questions are what make it feel real. It doesn't let you get away with vague answers. I've done 14 sessions and my communication score went from 61 to 89.",
    name: "David K.",
    role: "Full Stack Engineer → Meta E5",
    avatar: "DK",
  },
];

export function Testimonials() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as RefObject<HTMLElement>} className="section">
      <div className="section-inner">
        <div className={`section-header ${sv(visible)}`}>
          <p className="label">Testimonials</p>
          <h2 className="heading-xl">Engineers who got the offer.</h2>
        </div>
        <div className="grid-3">
          {TESTIMONIALS.map(({ quote, name, role, avatar }, i) => (
            <div
              key={name}
              className={`testimonial-card ${sv(visible, `delay-${i}`)}`}
            >
              <div className="stars">
                {[0, 1, 2, 3, 4].map((s) => (
                  <svg
                    key={s}
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                    stroke="none"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="testimonial-quote">&ldquo;{quote}&rdquo;</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span className="author-initials">{avatar}</span>
                </div>
                <div>
                  <p className="author-name">{name}</p>
                  <p className="author-role">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
