// Buraydah visit run — two people, one car.
//
// Mahmoud visits the software shops; his friend (a doctor) applies for GP posts
// at private hospitals and polyclinics on the same trip.
//
// Coordinates are decoded from each business's own Google plus code (±15 m).
// Street-name geocoding was tried and rejected: it placed King Khalid Rd 35.4 km
// from the home pin when the real shops on it are 41–42.6 km away, because
// Buraydah's main roads run for kilometres. The decoder was validated against
// Codlop, whose decoded distance (41.1 km) matches the value already recorded
// independently in techCompanies.js.
//
// Order is an exact Held-Karp search over arrival time (2^10 subsets × 10
// endpoints) that carries the clock in the state, so both opening AND closing
// times are respected — any order arriving too late to finish before a stop
// closes is discarded rather than scored. That constraint changed the answer:
// the distance-only optimum put Solutions Corner in the early afternoon, but its
// Wednesday hours are 09:00–12:00 then 16:00–23:00, so it would have been shut.
//
// All hours re-checked on Google Maps 2026-07-29 (a Wednesday).

export const HOME = { lat: 26.132111, lng: 43.643809, label: "Al-Bukayriyah (your pin)" };

// Driving figures are Google's own, read back off the directions link.
export const PLAN = {
  departure: "08:15",
  finish: "15:03",
  outboundKm: 74.1,
  outboundDriveTime: "1 h 34 min",
  roundTripKm: 125,
  techStops: 6,
  gpStops: 4,
};

const pin = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
const listing = (q) => `https://www.google.com/maps/search/?api=1&query=${q}`;

export const STOPS = [
  {
    order: 1, who: "gp", name: "Al-Freih Hospital", ar: "مستشفى الفريح",
    lat: 26.317187, lng: 43.982188, plusCode: "8X8J+VV", kmHome: 39.5,
    address: "King Abdulaziz Rd, Al-Janoub, Buraydah 52354",
    open: "08:00", close: "15:00", arrive: "09:07", leave: "09:32",
    hours: "hospital open 24h · HR office hours", phone: "9200 22894",
    rating: "3.1 (1,039)", kind: "Private hospital", band: "band-c",
    move: "On the way in and opens early, so it leads the day. Ask reception for HR / الموارد البشرية by name and hand the CV over in person.",
    mapPin: pin(26.317187, 43.982188),
    mapListing: listing("%D9%85%D8%B3%D8%AA%D8%B4%D9%81%D9%89%20%D8%A7%D9%84%D9%81%D8%B1%D9%8A%D8%AD%20%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9"),
  },
  {
    order: 2, who: "tech", name: "Solutions Corner IT", ar: "ركن حلول لتقنية المعلومات",
    lat: 26.324063, lng: 43.982438, plusCode: "8XFJ+JX", kmHome: 40.0,
    address: "Al-Sadah, Buraydah 52361",
    open: "09:00", close: "12:00", arrive: "09:33", leave: "10:03",
    hours: "09:00–12:00, then 16:00–23:00", phone: "059 506 1210",
    rating: "4.6 (31)", cv: "09_Solutions_Corner", band: "band-c",
    warn: "DO NOT pitch development here. And it shuts at 12:00 until 16:00 — this stop cannot move later.",
    move: "Google files them as phone repair — confirmed. Ask what they use to track repairs, customers and parts. If the answer is a notebook or a spreadsheet, that's your project.",
    update: "Split hours are why this is stop 2 rather than mid-afternoon. The distance-only optimum would have arrived at 13:14, to a locked door.",
    mapPin: pin(26.324063, 43.982438),
    mapListing: listing("%D8%B1%D9%83%D9%86%20%D8%AD%D9%84%D9%88%D9%84%20%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9"),
  },
  {
    order: 3, who: "tech", name: "Codlop", ar: "مؤسسة كود لوب لتقنية المعلومات",
    lat: 26.358687, lng: 43.969313, plusCode: "9X59+FP", kmHome: 41.1,
    address: "King Khalid Rd, Al-Rabwah, Buraydah 52367",
    open: "10:00", close: "18:00", arrive: "10:09", leave: "10:39",
    hours: "10:00–18:00 · closed Fri & Sat", phone: "054 454 7990",
    rating: "4.7 (13)", cv: "04_Codlop", band: "band-b", site: "https://codlop.sa",
    move: "Ask for OVERFLOW work — the projects they delay when busy — not a seat. Etimad-registered, so Arabic RTL on deadline is their world.",
    mapPin: pin(26.358687, 43.969313),
    mapListing: listing("%D9%85%D8%A4%D8%B3%D8%B3%D8%A9%20%D9%83%D9%88%D8%AF%20%D9%84%D9%88%D8%A8%20%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9"),
  },
  {
    order: 4, who: "tech", name: "Al-Diqah Smart IT", ar: "مؤسسة الدقة الذكية لتقنية المعلومات",
    lat: 26.363563, lng: 43.967438, plusCode: "9X78+CX", kmHome: 41.3,
    address: "King Khalid Rd, Al-Fayziyah, Buraydah 52211",
    open: "08:30", close: "22:30", arrive: "10:39", leave: "11:09",
    hours: "08:30–22:30 · closed Fri", phone: "050 495 3001",
    rating: "5.0 (2)", cv: "02_AlDiqah_Smart_IT", band: "band-a", site: "https://aldqh.com",
    move: "Mention the DESKTOP or IoT work specifically — almost nobody asks about those. They run training courses, so juniors are normal to them.",
    update: "≈14 m from Panorama (stop 5). Park once, do both.",
    mapPin: pin(26.363563, 43.967438),
    mapListing: listing("%D9%85%D8%A4%D8%B3%D8%B3%D8%A9%20%D8%A7%D9%84%D8%AF%D9%82%D8%A9%20%D8%A7%D9%84%D8%B0%D9%83%D9%8A%D8%A9%20%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9"),
  },
  {
    order: 5, who: "tech", name: "Panorama Qassim", ar: "بانورما القصيم للبرمجة والتصميم",
    lat: 26.363687, lng: 43.967438, plusCode: "9X78+FX", kmHome: 41.3,
    address: "7191 King Khalid Rd, Al-Fayziyah, Buraydah 52362",
    open: "08:30", close: "20:00", arrive: "11:10", leave: "11:40",
    hours: "08:30–20:00 · closed Fri & Sat", phone: "055 449 8558",
    rating: "4.4 (7)", cv: "03_Panorama_Qassim", band: "band-a", site: "https://panorama-q.com",
    move: "Best documented odds on the whole list — a public review thanks them for training someone. Lead with \"CS student at Qassim University who has already shipped production systems\".",
    mapPin: pin(26.363687, 43.967438),
    mapListing: listing("%D8%A8%D8%A7%D9%86%D9%88%D8%B1%D9%85%D8%A7%20%D8%A7%D9%84%D9%82%D8%B5%D9%8A%D9%85%20%D9%84%D9%84%D8%A8%D8%B1%D9%85%D8%AC%D8%A9%20%D9%88%D8%A7%D9%84%D8%AA%D8%B5%D9%85%D9%8A%D9%85"),
  },
  {
    order: 6, who: "gp", name: "Dr. Sulaiman Al-Habib Hospital", ar: "مستشفى د. سليمان الحبيب",
    lat: 26.361438, lng: 43.946438, plusCode: "9W6W+HH", kmHome: 39.5,
    address: "King Abdulaziz Rd, Al-Safra, Buraydah 52381",
    open: "08:00", close: "15:00", arrive: "11:42", leave: "12:07",
    hours: "hospital open 24h · HR office hours", phone: "920007175",
    rating: "4.4 (8,727)", kind: "Private hospital — national group", band: "band-a",
    move: "Best medical odds of the four: the largest private hospital group in the Kingdom, recruiting physicians continuously. Walk the CV into HR, then apply on their careers portal the same day — the visit is what makes the online application get read.",
    mapPin: pin(26.361438, 43.946438),
    mapListing: listing("Dr.%20Sulaiman%20Al-Habib%20hospital%20Qassim"),
  },
  {
    order: 7, who: "gp", name: "Qassim National Hospital", ar: "مستشفى القصيم الوطني",
    lat: 26.374313, lng: 43.940437, plusCode: "9WFR+P5", kmHome: 40.0,
    address: "Ali bin Abi Talib Rd, Al-Iskan, Buraydah 51421",
    open: "08:00", close: "15:00", arrive: "12:09", leave: "12:34",
    hours: "hospital open 24h · HR office hours", phone: "016 383 6100",
    rating: "3.9 (2,503)", kind: "Private hospital", band: "band-b",
    move: "Large private hospital, 2,500+ reviews. Same play: HR desk in person, then the online form.",
    update: "1.5 km from stop 6 — the doctor does two hospitals back to back while you wait.",
    mapPin: pin(26.374313, 43.940437),
    mapListing: listing("%D9%85%D8%B3%D8%AA%D8%B4%D9%81%D9%89%20%D8%A7%D9%84%D9%82%D8%B5%D9%8A%D9%85%20%D8%A7%D9%84%D9%88%D8%B7%D9%86%D9%8A%20%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9"),
  },
  {
    order: 8, who: "tech", name: "MTE Information Technology", ar: "إم تي إي لتقنية المعلومات",
    lat: 26.379188, lng: 43.953187, plusCode: "9XH3+M7", kmHome: 41.3,
    address: "3365 Ali bin Abi Talib Rd, Al-Amn, Buraydah 52385",
    open: "09:00", close: "21:00", arrive: "12:36", leave: "13:06",
    hours: "09:00–21:00 · closed Fri & Sat", phone: "053 913 4003",
    rating: "4.0 (5)", cv: "08_MTE", band: "band-c", site: "https://www.mte.sa",
    move: "Read their portfolio page on the drive and name one specific project in your first sentence. Then: one person who does front-end, back-end and deployment.",
    mapPin: pin(26.379188, 43.953187),
    mapListing: listing("%D8%A5%D9%85%20%D8%AA%D9%8A%20%D8%A5%D9%8A%20%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9"),
  },
  {
    order: 9, who: "tech", name: "Rossum Programming", ar: "مؤسسة روسم للبرمجة",
    lat: 26.410187, lng: 43.933312, plusCode: "CW6M+38", kmHome: 42.3,
    address: "Abu Bakr Al-Siddiq Rd, Al-Nahda, Buraydah 52389",
    open: "08:00", close: "21:00", arrive: "13:12", leave: "13:42",
    hours: "08:00–21:00 · closed Fri", phone: "053 957 7700",
    rating: "5.0 (8)", cv: "07_Rossum_Programming", band: "band-b", site: "https://rawsam.com.sa",
    move: "Pure dev shop, no dilution. Lead with the stack — React, Node, PostgreSQL, four live sites — and say \"solo\" about at least two of them.",
    update: "They DO have a website (rawsam.com.sa) and 8 reviews. The old \"no web presence, probably too quiet\" concern is weaker than it looked.",
    mapPin: pin(26.410187, 43.933312),
    mapListing: listing("%D9%85%D8%A4%D8%B3%D8%B3%D8%A9%20%D8%B1%D9%88%D8%B3%D9%85%20%D9%84%D9%84%D8%A8%D8%B1%D9%85%D8%AC%D8%A9%20%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9"),
  },
  {
    order: 10, who: "gp", name: "Salamat Medical Complex (1)", ar: "مجمع سلامات الطبي (١)",
    lat: 26.386563, lng: 43.902812, plusCode: "9WP3+J4", kmHome: 38.3,
    address: "King Abdulaziz Rd, Al-Falah, Buraydah 52378",
    open: "08:00", close: "15:00", arrive: "13:47", leave: "14:12",
    hours: "open 24h", phone: "9200 27767",
    rating: "3.5 (1,454)", kind: "Polyclinic", band: "band-b",
    move: "Polyclinics hire GPs more readily than hospitals and decide faster. Open 24h, so this is the safest stop to keep if the day runs late.",
    mapPin: pin(26.386563, 43.902812),
    mapListing: listing("%D9%85%D8%AC%D9%85%D8%B9%20%D8%B3%D9%84%D8%A7%D9%85%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%20%D8%A8%D8%B1%D9%8A%D8%AF%D8%A9"),
  },
];

// Opens at 16:00 — cannot fit the day without a long wait, and it needs a
// qualifying phone call before it is worth any drive at all.
export const DEFERRED = {
  rank: 5,
  name: "Nuzum Code Technology",
  ar: "مؤسسة نظم كود للتقنية",
  lat: 26.380063, lng: 43.890812, plusCode: "9VJR+28", kmHome: 37.0,
  address: "Sultanah Rd, Sultanah 2641, Buraydah 52375",
  opens: "16:00", phone: "059 922 6108", site: "https://software-code.com",
  rating: "4.8 (25)", cv: "05_Nuzum_Code",
  move: "Call at 16:00 and ask ONE question first: custom software, or hardware and systems? Drive out only if they say software.",
  update: "Their website is software-code.com — decent evidence they really do software, despite Maps filing them under electronics. Also the closest of all at 37.0 km.",
  mapPin: pin(26.380063, 43.890812),
};

export const NOT_ON_ROUTE = [
  { rank: 1, name: "P4IT — Pixel", why: "Unaizah, 34.5 km — different city. WhatsApp today, drive another day. Still your #1.", phone: "+966 545 236006", cv: "01_P4IT_Pixel" },
  { rank: 6, name: "Wakaed IT", why: "Unaizah, 34.5 km — pair with P4IT on a separate run.", phone: "+966 50 392 5556", cv: "06_Wakaed_IT" },
  { rank: 10, name: "Radic IT", why: "No address published in any country. Message only.", phone: null, cv: "10_Radic_IT" },
  { rank: 11, name: "Science Soft", why: "No phone, site or address. 15 minutes of research, then drop it.", phone: null, cv: "11_Science_Soft" },
];

// Ministry of Health — centralised online hiring. A walk-in at the gate does not
// reach a decision-maker, so these are an application, not a morning.
export const MOH_APPLY_ONLINE = [
  "King Fahd Specialist Hospital — مستشفى الملك فهد التخصصي, King Abdullah Rd",
  "Buraydah Central Hospital — مستشفى بريدة المركزي",
  "Maternity & Children's Hospital — مستشفى الولادة والأطفال ببريدة",
];

export const MAPS_LINK =
  "https://www.google.com/maps/dir/?api=1&origin=26.132111,43.643809" +
  "&destination=26.386563,43.902812" +
  "&waypoints=26.317187,43.982188|26.324063,43.982438|26.358687,43.969313|26.363563,43.967438" +
  "|26.363687,43.967438|26.361438,43.946438|26.374313,43.940437|26.379188,43.953187|26.410187,43.933312" +
  "&travelmode=driving";
