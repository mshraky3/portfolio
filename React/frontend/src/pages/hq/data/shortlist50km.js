/* =====================================================================
   Employers inside 50 km of 26.132111, 43.643809 (Al-Bukayriyah).
   km + gps:true  -> real OSM/Nominatim coordinates for that site
   km + gps:false -> town/city-centre estimate, +/- 5 km
   Government / Saudi-national-only entities are excluded by design.
   ===================================================================== */
export const RINGS = [
  {key:1, max:15,  label:"0–15 km · your doorstep",              note:"Under 15 minutes. Visit in person — that's the whole advantage."},
  {key:2, max:30,  label:"15–30 km · airport & university corridor", note:"20–25 minutes. Reachable after class."},
  {key:3, max:40,  label:"30–40 km · Ar-Rass · Unaizah · Buraydah", note:"Where most employers actually are. Batch visits into one trip."},
  {key:4, max:50,  label:"40–50 km · outer Buraydah & Uyun AlJawa", note:"The new ring. Buraydah's far side, the industrial city, the big private hospitals."}
];

export const EMPLOYERS = [
/* ---------------- RING 1 ---------------- */
{id:"jav", n:"Jav Advertising", ar:"جاف للدعاية والإعلان", city:"Al-Bukayriyah", km:3.6, gps:1, sec:"software", fit:"strong", cv:"Agency",
 what:"Design and advertising agency, effectively on your doorstep.",
 role:"Web developer / the person who builds what they design",
 how:"Walk in. At 3.6 km there is no excuse. Bring a laptop and open alhisony.com and erthfc.com in front of them.",
 why:"Design agencies constantly sell websites they then outsource. You are the developer they are currently paying someone in another city for. Don't ask for a job title — ask who builds the sites they design. Offer per-project pricing first: it sidesteps the work-permit conversation entirely and gets you paid fastest.",
 links:[["Site","https://www.jav.sa/"]]},

{id:"sru", n:"Sulaiman Al Rajhi University", ar:"جامعة سليمان الراجحي", city:"Al-Bukayriyah", km:8.7, gps:1, sec:"edu", fit:"strong", cv:"Education",
 what:"Non-profit private university — medicine, applied sciences, nursing, business. IT department of roughly 20 people.",
 role:"Software / web developer, Deanship of IT",
 how:"Careers page plus a direct email to recruitment@sr.edu.sa. Private universities hire non-Saudis for IT far more freely than government ones.",
 why:"The closest serious employer to your door. Their IT team skews infrastructure and network — which is exactly where someone who can actually build an internal web app stands out. SMLE is an 8,000-question adaptive assessment platform; for a medical university that is an unusually direct match. Non-profit waqf, so don't open with salary.",
 links:[["Careers","https://sr.edu.sa/site/careers/"],["Site","https://sr.edu.sa/"],["Email HR","mailto:recruitment@sr.edu.sa"]]},

{id:"sr-hospital", n:"Sulaiman Al Rajhi Charitable Hospital & Foundation", ar:"مستشفى ومؤسسة سليمان الراجحي الخيرية", city:"Al-Bukayriyah", km:9, gps:0, sec:"health", fit:"good", cv:"Health",
 what:"The endowment's charitable hospital and foundation, on the same campus complex as the university.",
 role:"IT / health-information systems developer",
 how:"Same HR channel as the university, or walk in with a printed CV. One visit covers both — ask reception for the IT department directly.",
 why:"Your Ultimate Care HR platform is a healthcare workforce system: 600+ staff, 25 branches, licence and document expiry alerts. Open with that. Waqf entities run lean and value anyone who reduces vendor spend — frame yourself as internal capability, not an outside contractor.",
 links:[["University careers","https://sr.edu.sa/site/careers/"]]},

/* ---------------- RING 2 ---------------- */
{id:"qassim-dates", n:"Qassim Dates Factory", ar:"مصنع تمور القصيم", city:"Between Al-Bukayriyah & Buraydah", km:16.3, gps:1, sec:"industry", fit:"good", cv:"Enterprise",
 what:"Date-processing plant — Qassim's signature industry, with real production, inventory and logistics data.",
 role:"Internal systems developer, or a first paid project on production reporting",
 how:"Cold visit or phone. Factories this size rarely post jobs; they hire whoever turns up with a working solution.",
 why:"Plants at this scale run on Excel plus a basic accounting package. Open with 'how do you track production and stock today?' Then pitch one narrow thing — a production dashboard, or barcode stock movement — not 'a system'. Qassim exports dates, so batch traceability and export documentation have money attached immediately.",
 links:[]},

{id:"badayea", n:"Al-Badayea — date & food processors", ar:"البدائع — مصانع التمور والأغذية", city:"Al-Badayea", km:18.4, gps:1, sec:"industry", fit:"good", cv:"Enterprise",
 what:"Governorate town south of you, missing from every previous list. Its economy is dates, agriculture and food processing — a cluster of small factories and packing houses, not one big employer.",
 role:"Freelance internal systems — inventory, production, delivery tracking",
 how:"Drive out once with a prepared one-page pitch in Arabic. Ask at the biggest packing houses who handles their stock records.",
 why:"Closer than Buraydah and completely uncontested — nobody is pitching software to these businesses. One small paid system here is worth more to you right now than twenty ignored applications to a listed company. Treat it as a market, not as a single employer.",
 links:[]},

{id:"airport", n:"Qassim Int'l Airport — ground services & cargo", ar:"مطار الأمير نايف بن عبدالعزيز الدولي", city:"Al-Malida", km:22.7, gps:1, sec:"industry", fit:"good", cv:"Enterprise",
 what:"The regional international airport. The airport authority itself is government, but the operators inside it are private companies: ground handling, cargo, catering, car rental, duty-free, courier hubs.",
 role:"IT / internal systems at one of the private operators",
 how:"Don't apply to 'the airport'. Identify the ground-handling and cargo companies operating there by name, then apply to each one directly.",
 why:"Aviation services companies are almost entirely expat-staffed and run on scheduling, manifest and rostering data — a natural fit for someone who built shift, attendance and multi-branch permission systems. It's also 22 km, well inside your comfortable range.",
 links:[]},

{id:"qassim-university", n:"Qassim University — funded research projects", ar:"جامعة القصيم", city:"Al-Malida / Buraydah", km:27.3, gps:1, sec:"edu", fit:"strong", cv:"Education",
 what:"Your own university. Public, so HR posts are effectively closed to you — but funded research projects that need software built are not.",
 role:"Student developer / research assistant on a funded project",
 how:"Not through the jobs portal — through people. Email 3–5 professors in the College of Computer with a two-line pitch and links to SMLE and the HR platform. Ask explicitly how student project work is paid.",
 why:"Your single biggest unfair advantage, and you're already inside it. A student who has shipped a 25-table production system is rare, and your faculty don't know it yet. Research and deanship work is paid through routes that avoid the full employment-permit problem. Referrals from faculty are also the most reliable way into every other employer on this page.",
 links:[["University","https://www.qu.edu.sa/"],["College of Computer","https://cc.qu.edu.sa/"]]},

{id:"hayat-hospital", n:"Al Hayat National Hospital", ar:"مستشفى الحياة الوطني", city:"Buraydah area", km:29.9, gps:1, sec:"health", fit:"strong", cv:"Health",
 what:"Private hospital group with multiple KSA locations.",
 role:"IT / health-information systems developer",
 how:"HR email plus LinkedIn. Private hospitals hire expat IT staff routinely — a genuinely open door, unlike the MoH ones.",
 why:"Your Ultimate Care HR platform IS a private-healthcare workforce system: staff across branches, licence and document expiry, Arabic reporting. Say so in the first paragraph. Staff-credential expiry (SCFHS licences, iqamas, contracts) is a real compliance pain for every private hospital and you already built automated 30/60/90-day alerts for it. Second hook: their physicians sit the SMLE exam, and you built the platform they study on.",
 links:[["Site","https://hayathospitals.com/"]]},

/* ---------------- RING 3 ---------------- */
{id:"pcd", n:"PC Doctor", ar:"طبيب الكمبيوتر", city:"Ar-Rass / Buraydah area", km:30.7, gps:1, sec:"software", fit:"good", cv:"Agency",
 what:"Computer services company (pcd.com.sa).",
 role:"Developer / technical",
 how:"Site contact form, then phone.",
 why:"Likely services and repair rather than development — verify before spending effort. If they do any software, they're small enough that one good conversation decides it.",
 links:[["Site","https://pcd.com.sa/"]]},

{id:"daajan", n:"Al Daajan Holdings", ar:"الدجاجن القابضة", city:"Ar-Rass / Buraydah area", km:31.4, gps:1, sec:"industry", fit:"good", cv:"Enterprise",
 what:"Holding company with an office inside the radius.",
 role:"IT / internal systems",
 how:"Cold approach — research the group's subsidiaries first so you know what you're walking into.",
 why:"Holding companies are worth the effort because one approach can reach several subsidiaries. Group-level HR and reporting across subsidiaries is exactly the multi-branch problem you already solved once.",
 links:[]},

{id:"buraydah-colleges", n:"Buraydah Private Colleges", ar:"كليات بريدة الأهلية", city:"Buraydah", km:31.7, gps:1, sec:"edu", fit:"good", cv:"Education",
 what:"Private colleges complex in Buraydah. Verify it still trades under this name — Qassim Private Colleges became Mustaqbal University in 2019 and the two are easy to confuse.",
 role:"IT / systems developer",
 how:"HR office directly, in person or by phone.",
 why:"Private education hires expats and its internal tooling is usually thin. Student portals, attendance, exam systems — SMLE proves you've built assessment software that real users depend on.",
 links:[]},

{id:"mustaqbal", n:"Mustaqbal University", ar:"جامعة المستقبل", city:"Buraydah", km:33.3, gps:1, sec:"edu", fit:"strong", cv:"Education",
 what:"The first private university in Qassim, with a College of Engineering & Computer Science (CS, software engineering, information systems, IT).",
 role:"Developer in university IT, or teaching / lab assistant with a development component",
 how:"HR via uom.edu.sa. Private university, so non-Saudi hiring is normal.",
 why:"A young private institution still building its internal systems — good timing. You're a CS student at the region's flagship public university who has shipped production software; for a private university trying to prove its programme is practical, that story has value beyond your code. Ask about lab and teaching-assistant roles too — both fit an afternoon schedule.",
 links:[["Site","https://uom.edu.sa/"],["Engineering & IT college","https://engineering.futureuniversity.com/"]]},

{id:"qassim-specialist", n:"Qassim Specialist Medical Center", ar:"مركز القصيم الطبي التخصصي", city:"Unaizah / Buraydah area", km:34.4, gps:1, sec:"health", fit:"good", cv:"Health",
 what:"Private specialist medical centre.",
 role:"IT / systems developer",
 how:"Direct approach to the administration or IT office.",
 why:"Centres this size run a commercial HIS and almost nothing else — appointments, staff documents and reporting are all manual. One concrete offer beats a general CV: an automated staff-credential expiry tracker, which you have already built once.",
 links:[]},

{id:"awar", n:"Awar Marketing Services", ar:"أوّار للخدمات التسويقية", city:"Unaizah — Al-Khalidiyah", km:35, gps:0, sec:"software", fit:"good", cv:"Agency",
 what:"Digital marketing agency: content, graphics, motion, paid ads, website design.",
 role:"Web developer, freelance / per project",
 how:"Instagram or WhatsApp. Marketing agencies live on social, not email.",
 why:"They win the client, then someone has to build. Position yourself as the build half, available per project. Unaizah is a separate city with its own client base — treat it as its own market, not a Buraydah afterthought.",
 links:[]},

{id:"shams-altabia", n:"Shams Al Tabia (Natural Solar Energy)", ar:"شمس الطبيعة للطاقة الشمسية", city:"Unaizah area", km:35, gps:1, sec:"industry", fit:"good", cv:"Enterprise",
 what:"Solar energy company operating inside the radius.",
 role:"Developer — monitoring dashboards, sizing and quoting tools",
 how:"Site contact form.",
 why:"Solar installers need exactly two things built: a sizing/quoting calculator for sales, and a monitoring dashboard for installed systems. Both are well inside what you've already shipped. Renewables is also a good sector to have on your CV in two years.",
 links:[["Site","https://www.shamsaltabia.com/"]]},

{id:"qassim-cement", n:"Qassim Cement Company", ar:"شركة أسمنت القصيم", city:"Buraydah", km:38, gps:0, sec:"industry", fit:"strong", cv:"Enterprise",
 what:"Tadawul-listed cement producer, founded 1976, 500–1,000 employees. Acquired Hail Cement in 2024, so it now runs multi-site operations.",
 role:"IT / applications developer, ERP support, reporting analyst",
 how:"They have a real careers portal. Apply properly, in English, and also via LinkedIn and Bayt — listed companies actually use them.",
 why:"The biggest formal employer here with a working online application process. A listed company files quarterly: read the last Tadawul announcement before any interview and you'll be ahead of every other junior applicant. Industrial IT runs on SAP or Oracle, which you don't have — don't pretend. Say instead: 'I built a 25-table system from scratch, so I understand the data model underneath an ERP.' The multi-site angle after the Hail acquisition is your strongest parallel — your HR platform already handles 25 branches with per-branch permissions.",
 links:[["Careers","https://qcc.com.sa/Careers/en/"],["Site","https://qcc.com.sa/"],["LinkedIn","https://www.linkedin.com/company/qassim-cement-company"]]},

{id:"alwasail", n:"Al Wasail Industrial Company", ar:"شركة الوسائل الصناعية", city:"Buraydah industrial area", km:38.9, gps:1, sec:"industry", fit:"strong", cv:"Enterprise",
 what:"Industrial manufacturer in the Buraydah industrial zone, with its own web presence and active hiring.",
 role:"IT / internal systems developer",
 how:"Careers or contact page, plus LinkedIn.",
 why:"Manufacturers this size usually have one or two IT people covering everything, so your value is being the person who can build rather than only maintain. Read their product lines first so you can name what they make — industrial firms notice. Production dashboards, maintenance scheduling and inventory are the standard unmet needs; pick one and pitch it concretely.",
 links:[["Site","https://www.alwasail.com/"]]},

{id:"ojeen", n:"Ojeen Trading Co.", ar:"شركة أوجين للتجارة المحدودة", city:"Buraydah", km:38.9, gps:1, sec:"industry", fit:"good", cv:"Enterprise",
 what:"Trading company with its own website, mapped inside the radius.",
 role:"Internal systems / e-commerce developer",
 how:"Site contact form.",
 why:"Trading companies need inventory, orders and supplier data joined up — a normal database problem you can solve. Check whether their site actually sells online: if it doesn't, that's your pitch; if it does, ask who maintains it.",
 links:[["Site","https://www.ojeenltd.com/"]]},

{id:"codlop", n:"Codlop", ar:"كود لوب لتقنية المعلومات", city:"Buraydah", km:39, gps:0, sec:"software", fit:"strong", cv:"Agency",
 what:"Buraydah software house, 10+ years, registered with Monshaat, Ministry of Commerce and Etimad. Websites, mobile apps, hosting, digital marketing, government-facing work.",
 role:"Full-stack / front-end developer",
 how:"WhatsApp their published numbers (+966 55 870 6532 · +966 54 454 7990) with a two-line Arabic intro and your portfolio link.",
 why:"Etimad registration means they bid on government contracts, so they need people who can deliver Arabic RTL systems on deadline — that's you. Keep the message under five lines and put the three live domains in it. Agencies decide from links, not CVs. Ask about project work first: one paid project is faster to get than a job, and it converts.",
 links:[["Site","https://codlop.sa/"],["Facebook","https://www.facebook.com/codlop.sa/"]]},

{id:"mte", n:"MTE Information Technology", ar:"ام تي اي لتقنية المعلومات", city:"Buraydah — Al-Amn district", km:39, gps:0, sec:"software", fit:"strong", cv:"Agency",
 what:"Saudi IT firm on Ali bin Abi Talib Road — computer services and web development.",
 role:"Web developer",
 how:"Contact form on mte.sa, then follow up by phone. Small firms answer phones, not inboxes.",
 why:"Read their portfolio page first and name one specific project you liked. Almost nobody does this and it works. Firms this size need someone who can do front-end AND back-end AND deploy — say that in one sentence.",
 links:[["Site","https://www.mte.sa/"]]},

{id:"inter", n:"Inter Company for Communications & IT", ar:"شركة انتر للاتصالات وتقنية المعلومات", city:"Buraydah — Al-Sadah", km:39, gps:0, sec:"software", fit:"strong", cv:"Agency",
 what:"LLC founded 2009, headquartered in Buraydah. Consulting, computer services, networks, IT.",
 role:"Software developer / IT consultant",
 how:"Phone or in person.",
 why:"Their business skews networks and consulting, which usually means software delivery is outsourced or thin — that's the gap you fill. Sixteen years of clients means a backlog of small internal systems people have asked for. Ask what they've turned down for lack of a developer.",
 links:[]},

{id:"aldqh", n:"Smart Precision IT (Al-Diqqa Al-Dhakiyya)", ar:"مؤسسة الدقة الذكية لتقنية المعلومات", city:"Buraydah", km:39, gps:0, sec:"software", fit:"strong", cv:"Enterprise",
 what:"Buraydah IT firm building business-management and accounting software for Saudi SMEs, plus mobile apps, web and training courses.",
 role:"Full-stack developer on their product",
 how:"Direct contact through aldqh.com. This is a product company, not a project shop — they need long-term developers.",
 why:"Business and accounting software in Saudi means ZATCA e-invoicing (Fatoora) integration. One hour reading the Phase 2 requirements before you talk to them makes you sound like an insider. Use the Enterprise CV, not the agency one — their world is data models and reporting, not landing pages. Your HR platform's payroll, attendance and Hijri/Gregorian reporting is the closest thing on your CV to what they sell.",
 links:[["Site","https://aldqh.com/"]]},

{id:"ultimate-solutions", n:"Ultimate Solutions for Computer Works", ar:"الحلول النهائية لأعمال الحاسب الآلي", city:"Buraydah — King Abdullah Rd", km:39, gps:0, sec:"software", fit:"good", cv:"Agency",
 what:"Software company opposite Al Baik on King Abdullah Road, 4.7★ on Maps.",
 role:"Developer",
 how:"Phone 058 188 0681, or walk in — they open Sunday 9 AM. Easy to combine with any other Buraydah visit.",
 why:"A 4.7 rating with real reviews means an active client base — read the reviews first, they tell you what the company actually sells. 'Branch' in the name implies a head office elsewhere; ask where, and whether it hires developers.",
 links:[]},

{id:"rossum", n:"Rossum Programming", ar:"مؤسسة روسم للبرمجة", city:"Buraydah — Al-Nahda", km:39, gps:0, sec:"software", fit:"good", cv:"Agency",
 what:"Buraydah software house on Abu Bakr Al-Siddiq Road — website and application development and design.",
 role:"Developer",
 how:"In person or by phone.",
 why:"A pure programming shop, so the pitch is simply React + Node + PostgreSQL with four live production sites — no explanation needed. Small shops care most about whether you can be handed a client and left alone, so use the word 'solo' about at least two projects.",
 links:[]},

{id:"digital-creativity", n:"Digital Creativity Foundation", ar:"مؤسسة الابداع الرقمي لتقنية المعلومات", city:"Buraydah — Al-Bishr", km:39, gps:0, sec:"software", fit:"good", cv:"Agency",
 what:"Saudi firm specialising in website design, hosting and programming.",
 role:"Web developer",
 how:"Direct contact.",
 why:"Hosting-plus-design shops tend to be WordPress-heavy. If you can also handle custom React/Node work you're an upgrade rather than a duplicate — lead with that.",
 links:[]},

{id:"urghwani", n:"Urghwani", ar:"أورغواني", city:"Buraydah", km:39, gps:0, sec:"software", fit:"good", cv:"Agency",
 what:"Creative digital-marketing agency doing WordPress design and development.",
 role:"Web developer / freelance partner",
 how:"Direct contact, framed as freelance overflow capacity.",
 why:"They win the client and then need someone to build. Speed and performance are what they can resell — your Erth result (40% faster response, 1.8× repeat requests) is exactly the kind of number an agency loves to quote to a client.",
 links:[]},

{id:"daw-shamel", n:"Light of Comprehensive Computers Co.", ar:"شركة ضوء الشامل للحاسبات المحدودة", city:"Buraydah — Al-Safra", km:39, gps:0, sec:"software", fit:"good", cv:"Agency",
 what:"Computer company (LLC) doing electronics retail, computer services and website development.",
 role:"Web developer",
 how:"Walk in — retail-facing means someone is always at the counter.",
 why:"Retail plus services businesses usually want their own e-commerce or inventory system. Ask what they use internally; the answer is normally 'nothing good'.",
 links:[]},

{id:"date-market", n:"Buraydah Central Date Market — packers & exporters", ar:"سوق التمور ببريدة — شركات التعبئة والتصدير", city:"Buraydah — Al-Sabakh", km:39.3, gps:1, sec:"industry", fit:"good", cv:"Enterprise",
 what:"The largest date market in the world, and the cluster of packing, grading and export companies that trade through it.",
 role:"Freelance systems work — grading, batch traceability, export documentation",
 how:"Go during the season and talk to the packing companies directly, not the market administration.",
 why:"Export businesses have real compliance paperwork and real money riding on traceability, and almost none of them have software for it. This is the highest-density place in the region to find a first paying client, and it's a single trip that can cover a dozen companies.",
 links:[]},

{id:"habib-qassim", n:"Dr. Sulaiman Al Habib Hospital — Qassim", ar:"مستشفى الدكتور سليمان الحبيب بالقصيم", city:"Buraydah", km:39.6, gps:1, sec:"health", fit:"strong", cv:"Health",
 what:"Branch of Saudi Arabia's largest private healthcare group (HMG), Tadawul-listed, with a serious in-house technology division.",
 role:"Software developer / health-IT — apply to the group, not the branch",
 how:"hmg.com careers plus LinkedIn. HMG runs real software teams and hires non-Saudis.",
 why:"The most professional healthcare employer within reach and the one most likely to have a genuine software engineering track — they built their own hospital information systems and patient apps in-house. Most roles are in Riyadh; apply anyway and say you're open to remote or the Qassim branch. Lead with the healthcare HR platform and SMLE: in a hospital group, both land instantly.",
 links:[["HMG careers","https://hmg.com/en/Pages/careers.aspx"],["LinkedIn","https://www.linkedin.com/company/dr-sulaiman-al-habib-medical-group"]]},

{id:"tkamel", n:"Takamul Technology", ar:"شركة تكامل التقنية", city:"Buraydah", km:39.6, gps:1, sec:"software", fit:"good", cv:"Agency",
 what:"IT company with its own site, mapped at the edge of the old radius.",
 role:"Developer",
 how:"Site contact form, then phone.",
 why:"Check their services page first — 'تكامل' (integration) usually means systems-integration work, where enterprise experience matters more than front-end polish. If so, send the Enterprise CV instead of the Agency one.",
 links:[["Site","https://www.tkamel.com/"]]},

/* ---------------- RING 4 — new in this pass ---------------- */
{id:"qassim-national-hospital", n:"Qassim National Hospital", ar:"مستشفى القصيم الوطني", city:"Buraydah — Al-Iskan", km:40, gps:1, sec:"health", fit:"strong", cv:"Health", isNew:1,
 what:"Private general hospital on Ali bin Abi Talib Road. Independent, not part of a national group.",
 role:"IT / health-information systems developer",
 how:"Walk into administration and ask for the IT manager by name, or apply by email. Independent private hospitals have no HR bureaucracy — one conversation can decide it.",
 why:"An independent private hospital is the single most winnable healthcare target on this page: no group HR in Riyadh filtering you out, no nationality rule, and a decision-maker you can physically reach. Everything you built for Ultimate Care applies directly — staff records across departments, licence and iqama expiry alerts, Arabic reporting.",
 links:[["Facebook","https://www.facebook.com/qnhospital/"]]},

{id:"salam-vet", n:"Salam Veterinary Group", ar:"مجموعة سلام البيطرية", city:"Buraydah", km:40, gps:0, sec:"health", fit:"strong", cv:"Health", isNew:1,
 what:"Founded 2020 with over SAR 150M invested. Holds the Guinness record for the largest veterinary hospital in the world — 71,500 m², capacity for 8,000+ animals — plus research, labs and farm-care programmes.",
 role:"Software developer / internal systems",
 how:"info@svg.sa and 920000080, plus LinkedIn. No public careers page, so a direct, specific email beats a generic application.",
 why:"A five-year-old company built around a record-breaking facility is still building its systems — that is the best possible time to arrive. Animal records, lab results, farm-care scheduling, embryo-transfer tracking: all of it is patient-record software with a different noun, and you've written patient-adjacent systems already. Very few developers in Qassim will even think to apply here.",
 links:[["Site","https://svg.sa/"],["LinkedIn","https://www.linkedin.com/company/salam-veterinary-group"],["Email","mailto:info@svg.sa"]]},

{id:"uyun-aljawa", n:"Uyun AlJawa — agriculture & local business", ar:"عيون الجواء", city:"Uyun AlJawa", km:40.3, gps:1, sec:"industry", fit:"good", cv:"Enterprise", isNew:1,
 what:"Governorate town due north of you, newly inside the radius at 40 km. Agriculture, dates and local trade — small businesses, no large employer.",
 role:"Freelance internal systems for local businesses",
 how:"Same play as Al-Badayea: one trip, an Arabic one-pager, conversations with the biggest agricultural and trading businesses.",
 why:"Listed for completeness rather than promise. Worth a single scouting trip if the Al-Badayea approach produces anything, because the pitch is identical and the competition is zero. Don't prioritise it above Buraydah.",
 links:[]},

{id:"industrial-city", n:"Qassim 1st Industrial City — ~50 factories", ar:"المدينة الصناعية الأولى بالقصيم", city:"South-east Buraydah", km:40.4, gps:1, sec:"industry", fit:"strong", cv:"Enterprise", isNew:1,
 what:"MODON industrial zone established 1980, south of Buraydah on 1.5 million m². Around 50 factories worth SAR 600M, concentrated in food, agricultural and pharmaceutical manufacturing. A second industrial city sits on the Buraydah–Unaizah expressway.",
 role:"IT / internal systems at any of the tenant factories",
 how:"Use MODON's factories directory to get the tenant list, pick the ten largest, and apply to each by name. Do not apply to 'the industrial city' — it's a landlord, not an employer.",
 why:"The densest concentration of manufacturers in the region, and every one of them has the same unsolved problems: production tracking, stock, maintenance scheduling, ZATCA-compliant invoicing. This single card is worth more than most individual companies on the page because it's ten applications from one afternoon of research. Food and pharma tenants also carry batch-traceability and expiry requirements — the exact automated-expiry logic you already built.",
 links:[["MODON factories directory","https://modon.gov.sa/en/Partners/Factories/Pages/default.aspx"],["Qassim 1st Industrial City","https://modon.gov.sa/en/Cities/IndustrialCities/Pages/IndustrialCity.aspx?CityId=1fd97192-4294-4b4b-9b48-b2cc640fe50d"]]},

{id:"gaco", n:"Al Gassim Investment Holding (GACO)", ar:"شركة القصيم القابضة للاستثمار", city:"Buraydah", km:40, gps:0, sec:"industry", fit:"strong", cv:"Enterprise", isNew:1,
 what:"Tadawul-listed holding company (ticker 6020), founded 1984 in Buraydah as Qassim Agriculture Company, renamed 2017. Holds interests across real estate, industry, education, healthcare, transport, agriculture and cold-chain logistics.",
 role:"IT / applications developer, group reporting",
 how:"Apply through the group, and check its subsidiaries separately — a holding company is several employers behind one name.",
 why:"One of only two Tadawul-listed companies headquartered in your radius, and it sits across the exact sectors you've already built for: healthcare, education and logistics. Group-level reporting across subsidiaries is the multi-branch problem your HR platform already solves. Listed companies also publish quarterly — read the last announcement before any interview.",
 links:[["Site","https://gih.sa/"],["LinkedIn","https://sa.linkedin.com/company/شركة-القصيم-القابضة-للاستثمار"]]},

{id:"panorama", n:"Panorama Qassim", ar:"بانوراما القصيم للبرمجة والتصميم", city:"Buraydah", km:40, gps:0, sec:"software", fit:"strong", cv:"Agency", isNew:1,
 what:"Buraydah software and design house — programming and design services.",
 role:"Developer",
 how:"Through panorama-q.com. Their site blocks automated access, so open it yourself and use whatever contact channel they publish.",
 why:"A software house that didn't appear in any earlier sweep, which usually means less competition from other applicants. Same approach as Codlop: an Arabic message under five lines with your three live domains in it.",
 links:[["Site","https://panorama-q.com/"]]},

{id:"radic", n:"Radic IT (راديك)", ar:"راديك لتقنية المعلومات", city:"Buraydah — address unverified", km:40, gps:0, sec:"software", fit:"good", cv:"Agency", isNew:1,
 what:"IT subsidiary of Radic Group — website design and development, e-marketing, branding and motion graphics, positioned specifically around Buraydah and Qassim.",
 role:"Web developer",
 how:"Via redicc.org. Confirm they have a physical Buraydah office before counting them as local — they market to Qassim but publish no street address.",
 why:"They publish a blog aimed at Qassim businesses looking for websites, which means they're actively selling build work in your city. If the delivery team is small or remote, a local developer who can meet clients face to face is a real advantage to them.",
 links:[["Site","https://redicc.org/ar/"],["Blog","https://blog.redicc.net/"]]},

{id:"dunia-khallatat", n:"Dunia Al-Khallatat", ar:"دنيا الخلاطات", city:"Qassim", km:40, gps:0, sec:"industry", fit:"good", cv:"Enterprise", isNew:1,
 what:"One of only five companies Arabic Wikipedia lists as headquartered in the Qassim region — a retail and distribution business.",
 role:"Internal systems / e-commerce developer",
 how:"Find the head office address first; the retail branches can't route a developer CV anywhere useful.",
 why:"Retail chains run on stock, branches and pricing — a multi-branch data problem you've solved before. Being headquartered in Qassim matters: the decision-maker is here, not in Riyadh, which is unusual and worth the effort of finding them.",
 links:[]},

{id:"qyem", n:"Qyem International Schools", ar:"مدارس قيم العالمية", city:"Buraydah — Al-Hamr", km:40, gps:0, sec:"edu", fit:"strong", cv:"Education", isNew:1,
 what:"American-curriculum private school with computer labs, science labs and full facilities.",
 role:"IT coordinator / systems and web developer",
 how:"Contact the school administration directly. Private schools have no central HR to filter you.",
 why:"Private international schools are the most reliably expat-friendly employers in any Saudi city — most of their staff are non-Saudi. They also run on a stack of half-working systems: attendance, grades, parent communication, fee tracking. You've built assessment and reporting software already. Note the schedule: school IT work is mornings, so this suits you better after you graduate in 2027 unless they'll take afternoon hours.",
 links:[]},

{id:"excellence-school", n:"Excellence International School", ar:"مدرسة التميز العالمية", city:"Buraydah — Al-Naziah", km:40, gps:0, sec:"edu", fit:"strong", cv:"Education", isNew:1,
 what:"British curriculum plus an Egyptian track, in Al-Naziah district, Buraydah.",
 role:"IT coordinator / developer",
 how:"Direct approach to administration.",
 why:"The Egyptian track means Egyptian staff, Egyptian families and an administration that already handles Egyptian paperwork routinely — that removes the single biggest friction in every other application on this page. Of all the schools, start here. Same morning-hours caveat applies.",
 links:[]},

{id:"indian-school", n:"International Indian School Buraidah", ar:"المدرسة الهندية العالمية ببريدة", city:"Buraydah", km:40, gps:0, sec:"edu", fit:"good", cv:"Education", isNew:1,
 what:"Indian-curriculum international school serving Buraydah's expat community.",
 role:"IT support with a development brief",
 how:"Direct approach to administration.",
 why:"An entirely expat-staffed institution, so nationality is a non-issue. Budgets are smaller than the American and British schools, which cuts both ways: less money, but far more appetite for someone who can build what they'd otherwise have to buy.",
 links:[]},

{id:"rowad-schools", n:"Al Rowad National Schools", ar:"مدارس الرواد الأهلية", city:"Buraydah", km:40, gps:0, sec:"edu", fit:"good", cv:"Education", isNew:1,
 what:"Established private school group in Buraydah.",
 role:"IT / systems developer",
 how:"Direct approach to administration.",
 why:"Larger private school groups run several campuses, which turns their record-keeping into the same multi-branch problem your HR platform solves. Worth one visit alongside the other schools in the same trip.",
 links:[]}
];

/* ------------------------------------------------------------------ */

export const SECTOR_LABEL = {
  software: "💻 Software",
  edu: "🎓 Education",
  health: "🏥 Health",
  industry: "🏭 Industry",
};

export const FIT_LABEL = {
  strong: ["fit-strong", "🔥 Realistic"],
  good: ["fit-good", "Worth a shot"],
  maybe: ["fit-maybe", "Long shot"],
};

// Upper bound is exclusive so a 40 km estimate lands in the 40–50 band, not 30–40.
export const ringOf = km => {
  for (const r of RINGS) if (km < r.max) return r.key;
  return 4;
};
