import sqb from "../assets/shots/sqb.webp";

// Keys used by `image` fields in content.js. Captured from the live sites at 2x
// (headless Chrome, 1440x900, saved as 2048px WebP). SQB and Al-Haysoni in their
// English mode; Erth in its dark theme, which is Arabic only since its
// September 2026 redesign (the owner asked for that screen).
export const IMAGES = { sqb };

// Small cards for the "Everything I've built" index. The private systems have
// no public screen, so theirs are stills from their own 3D scenes on this page.
import tSqb from "../assets/thumbs/sqb.webp";
import tHr from "../assets/thumbs/hr.webp";
import tNeurolink from "../assets/thumbs/neurolink.webp";
import tEmail from "../assets/thumbs/email.webp";
import tLaw from "../assets/thumbs/law.webp";
import tErth from "../assets/thumbs/erth.webp";

export const THUMBS = { sqb: tSqb, hr: tHr, neurolink: tNeurolink, email: tEmail, law: tLaw, erth: tErth };
