export const sv = (visible: boolean, extra = "") =>
  `scroll-hidden${visible ? " scroll-visible" : ""}${extra ? " " + extra : ""}`;
