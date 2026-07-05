/** Site chrome — single place for nav and defaults (Lesson 11). */

export const site = {
  name: "Lifan",
  url: "https://lifanh.com/",
  defaultTitle: "Lifan Huang",
  defaultDescription:
    "Personal site and writing of Lifan Huang.",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Primary nav — same on every page */
export const primaryNav: NavItem[] = [
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
];
