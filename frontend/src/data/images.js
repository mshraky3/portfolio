import sqb from "../assets/shots/sqb.webp";
import hrExpiry from "../assets/shots/hr-expiry.webp";
import hrBranches from "../assets/shots/hr-branches.webp";
import hrStaffing from "../assets/shots/hr-staffing.webp";
import hrYearcycle from "../assets/shots/hr-yearcycle.webp";

// Keys used by `image` fields in content.js. SQB was captured from the live site at 2x
// (headless Chrome, 1440x900, saved as 2048px WebP), in its English mode.
// The HR screens (hr*) are NOT the real system: they were captured on 11 Oct 2026 from
// the same code running on a throwaway local database filled with invented people,
// branches and numbers. No real employee, branch or company data appears in them.
export const IMAGES = { sqb, hrExpiry, hrBranches, hrStaffing, hrYearcycle };

// Small cards for the "Everything I've built" index. The HR card is a demo-data screen;
// the other private systems have no public screen, so theirs are stills from their own
// 3D scenes on this page.
import tSqb from "../assets/thumbs/sqb.webp";
import tHr from "../assets/thumbs/hr.webp";
import tNeurolink from "../assets/thumbs/neurolink.webp";
import tEmail from "../assets/thumbs/email.webp";
import tLaw from "../assets/thumbs/law.webp";
import tErth from "../assets/thumbs/erth.webp";

export const THUMBS = { sqb: tSqb, hr: tHr, neurolink: tNeurolink, email: tEmail, law: tLaw, erth: tErth };
