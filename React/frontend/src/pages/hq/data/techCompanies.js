/* Sources: G=Google Maps (rating/reviews/phone verified), D=dlilsa.com directory,
   W=company website, S=web search. Ratings shown as [stars, reviewCount]. */
export const TIERS = [
  {k:"product", t:"🏆 They build actual software products", d:"Custom software, ERP, or their own product. The closest match to what you do — and the ones most likely to need a developer rather than a designer."},
  {k:"webdev",  t:"💻 Web & app development shops", d:"Sites, stores, and mobile apps to order. Your React/Node/PostgreSQL stack plus four live production domains is a direct fit."},
  {k:"itserv",  t:"🔧 IT services, networks & systems", d:"Support, networks and systems work with some development attached. Lower ceiling for you, but real offices with real budgets — and a foot in the door."},
  {k:"agency",  t:"📣 Marketing & design agencies (freelance route)", d:"They sell websites, then need somebody to build them. Pitch yourself as their build capacity, priced per project — this is the fastest path to being paid."},
  {k:"network",  t:"🤝 Not employers — but use every one", d:"A tech community to join, two training centres that hire instructors, and a Saudi job board. Recovered from your own database. Teaching pays now and fits a student timetable; the association is the only organised tech network in the region."},
  {k:"verify",  t:"❓ Verify before you invest time", d:"Real listings, but with a specific reason to check first — unconfirmed city, name collision with a Riyadh company, a dead domain, or a category that suggests repair rather than development."}
];

export const COMPANIES = [
/* ---------------- PRODUCT / SOFTWARE ---------------- */
{id:"ultimate", n:"Ultimate Solutions for Computer Works", ar:"الحلول النهائية لأعمال الحاسب الآلي", city:"Buraydah", tier:"product",
 r:[4.7,77], src:"G+D", ph:"058 188 0681", addr:"King Abdullah Rd, Al-Safra — opposite Al Baik, next to Semina",
 does:"Software development and full ERP implementation, alongside other business systems. They ship their own product — reviewers name the program by name and thank the support staff personally.",
 why:"The most substantial software company found anywhere in your radius: 77 reviews at 4.7 is real traction, and ERP implementation means data modelling, not landing pages. Your 25-table HR system with payroll, attendance and Hijri/Gregorian reporting is the single closest thing on your CV to what they sell. Use the Enterprise CV.",
 q:"برنامج بيرفكت وخدمات البرنامج ممتازة يستاهلون خمس نجوم", links:[]},

{id:"aldqh", n:"Al-Diqah Smart IT", ar:"مؤسسة الدقة الذكية لتقنية المعلومات", city:"Buraydah", tier:"product",
 r:[5.0,2], src:"G+W", ph:"+966 50 495 3001", addr:"King Khalid Rd / Abu Bakr Al-Siddiq Rd",
 does:"Web apps, desktop applications, mobile apps, e-commerce, IoT projects, plus technical training courses. Explicitly builds custom software to order.",
 why:"One of very few here that names desktop and IoT work — meaning they take on problems bigger than a WordPress site. They also run training, so they're used to bringing juniors up. Open on WhatsApp with a concrete idea, not a CV.",
 links:[["Site","https://aldqh.com/"],["WhatsApp","https://wa.me/966504953001"]]},

{id:"efhas", n:"efhas technologies / Check For It", ar:"افحص لتقنية المعلومات", city:"Buraydah", tier:"product",
 r:null, src:"D", ph:null, addr:"Hamoud Al-Mushaiqih St / Suleiman St, Buraydah 52388",
 does:"Business-management and accounting software for Saudi SMEs, pitched explicitly around Vision 2030 — 'protect your money and monitor your success in the market'.",
 why:"A product company, not a project shop, which means they need long-term developers rather than one-off freelancers. Accounting software in Saudi means ZATCA e-invoicing (Fatoora) Phase 2 integration — spend one hour reading those requirements before you contact them and you'll sound like an insider. Enterprise CV.",
 links:[]},

{id:"wakaed", n:"Wakaed IT", ar:"وكائد لتقنية المعلومات", city:"Unaizah", tier:"product",
 r:[4.2,59], src:"G+W", ph:"+966 50 392 5556", addr:"Al-Shereimiyah, Ali Al-Zamil St, Unaizah 56219",
 does:"Website and application development, hosting (20+ years), and custom cloud-based accounting software built to order. Also sells hardware and POS.",
 why:"The longest-running software business in the whole sweep. Twenty years means maintenance contracts and a backlog of client requests — exactly the situation where an extra pair of hands gets hired. Unaizah is its own market with its own clients, worth treating separately from Buraydah.",
 links:[["Site","http://wakaed.com/"],["WhatsApp","https://wa.me/966503925556"],["Email","mailto:info@wakaed.com"]]},

{id:"mosader", n:"Digital Resources Company", ar:"شركة المصادر الرقمية", city:"Buraydah", tier:"product",
 r:[4.5,33], src:"G", ph:"055 522 1049", addr:"Salah Al-Din Al-Ayyubi Rd",
 does:"Website and mobile-app design and development, listed by Maps as a software company (شركة برمجيات).",
 why:"33 reviews at 4.5 is a genuinely active client base. A review thanks 'المهندس كمال' by name — an engineer with a non-Saudi name in a client-facing role, which is a small but real signal that they hire expats. Worth a call for that reason alone.",
 q:"نجوم 5 — المهندس كمال يتميز بالصبر وحسن الأخلاق في التعامل مع العملاء", links:[]},

{id:"nuzumcode", n:"Nuzum Code Technology", ar:"مؤسسة نظم كود للتقنية", city:"Buraydah", tier:"product",
 r:[4.8,25], src:"G", ph:"059 922 6108", addr:"Sultanah Rd, 2641",
 does:"Technology establishment surfacing under web-design searches; Maps files it under electronics but the name (نظم = systems, كود = code) and its search placement point at systems work.",
 why:"4.8 across 25 reviews is one of the better local reputations. Opens at 4 PM per its listed hours — which, unusually, fits a student timetable perfectly. Worth confirming what they actually build.",
 links:[]},

/* ---------------- WEB / APP DEV ---------------- */
{id:"codlop", n:"Codlop", ar:"مؤسسة كود لوب لتقنية المعلومات", city:"Buraydah", tier:"webdev",
 r:[4.7,13], src:"G+W", ph:"+966 54 454 7990", addr:"King Khalid Rd",
 does:"Websites, iOS/Android apps, hosting, digital marketing, SEO, branding. 10+ years, registered with the Ministry of Commerce and Etimad.",
 why:"Etimad registration means they bid on government contracts and need people who can deliver Arabic RTL systems on deadline — that's you. Send an Arabic WhatsApp under five lines with your three live domains in it. Ask about project work first.",
 q:"افضل شركة برمجة و تعامل راقي ومحترم وسرعه في إنهاء المشاريع",
 links:[["Site","https://codlop.sa/"],["Facebook","https://www.facebook.com/codlop.sa/"]]},

{id:"ecommerce", n:"E-commerce Store Design Co.", ar:"شركة تصميم متاجر الكترونية", city:"Buraydah", tier:"webdev",
 r:[4.9,659], src:"G", ph:"054 821 5160", addr:"6854 Salah Al-Din Al-Ayyubi Rd",
 does:"Builds e-commerce stores. Offers on-site services and online appointments.",
 why:"659 reviews at 4.9 — by far the highest volume of any tech business in the region, so this is a real operation with continuous work coming in. Volume that high means they cannot be doing it with one person. Highest-probability place on this list to find an actual opening.",
 q:"استجابه سريعه وحلول فوريه شكرا لكم", links:[]},

{id:"ruman", n:"Ruman Agency", ar:"وكالة رمان لبرمجة وتصميم المواقع والمتاجر الإلكترونية", city:"Buraydah", tier:"webdev",
 r:[5.0,3], src:"G", ph:"053 929 4989", addr:"Al-Salam Rd, next to Al-Marouti markets",
 does:"Programming and design of websites and e-commerce stores. Takes online appointments.",
 why:"Small and new (3 reviews), which cuts both ways — less stability, but far more likely to say yes to a capable person who walks in. The name explicitly includes برمجة (programming), not just design.",
 links:[]},

{id:"panorama", n:"Panorama Qassim", ar:"بانورما القصيم للبرمجة والتصميم", city:"Buraydah", tier:"webdev",
 r:[4.4,7], src:"G+W", ph:"055 449 8558", addr:"7191 King Khalid Rd",
 does:"Programming and design services.",
 why:"A review praises their training ('تدريب مفيد ومتعاونين جدا'), which means they've taken people on and taught them — the single most useful signal you can get about a shop's willingness to hire someone junior.",
 q:"تدريب مفيد ومتعاونين جدا الله يعطيهم الف عافيه",
 links:[["Site","https://panorama-q.com/"]]},

{id:"rossum", n:"Rossum Programming", ar:"مؤسسة روسم للبرمجة", city:"Buraydah", tier:"webdev",
 r:[5.0,null], src:"G+D", ph:"053 957 7700", addr:"Abu Bakr Al-Siddiq Rd, Al-Nahda 52389",
 does:"Website and application development and design. A pure programming shop with no retail or repair sideline.",
 why:"No design/marketing dilution — the pitch is simply React + Node + PostgreSQL with four live production sites and no explanation needed. Their own copy talks about 'latest technologies' and 'highest quality standards', so lead with your stack, not your CV.",
 links:[]},

{id:"mte", n:"MTE Information Technology", ar:"إم تي إي لتقنية المعلومات", city:"Buraydah", tier:"webdev",
 r:[4.0,5], src:"G+D+W", ph:"053 913 4003", addr:"3365 Ali bin Abi Talib Rd, Al-Amn, Buraydah 52385",
 does:"Computer services and web development, run from a proper office rather than a shopfront.",
 why:"Read their portfolio page before contacting and name one specific project you liked. Firms this size need one person who can do front-end AND back-end AND deploy — say that in a single sentence.",
 links:[["Site","https://www.mte.sa/"]]},

{id:"funoon", n:"Funoon Al-Muslim App Design", ar:"شركة تصميم تطبيقات ـ فنون المسلم", city:"Unaizah", tier:"webdev",
 r:[3.8,84], src:"G", ph:"050 851 3110", addr:"Sheikh Abdulaziz bin Bishr St",
 does:"Mobile app design and development.",
 why:"84 reviews means a long client history. A reviewer describes milestone-based payments tied to delivered stages — that's a shop running real project management, not an ad-hoc freelancer. The 3.8 rating suggests they're stretched, which is exactly when people hire.",
 q:"ما حسّيت بأي ضغط مالي، وكل دفعة كانت مرتبطة بمرحلة منجزة فعليًا", links:[]},

{id:"ofoq-tech", n:"Al Ofoq Technology", ar:"أفق التقنية لتصميم وبرمجة المواقع والتطبيقات", city:"Unaizah", tier:"webdev",
 r:null, src:"G+S", ph:"056 445 0461", addr:"—",
 does:"Website and app design and programming, online store builds, with a year of free technical support after delivery. Operating since 2014.",
 why:"Listed as open 24 hours, which almost always means a founder-run operation reachable directly. Offering a year of post-delivery support means ongoing maintenance load — the kind of work that gets handed to a second developer.",
 links:[]},

{id:"digital-creativity", n:"Digital Creativity Foundation", ar:"مؤسسة الابداع الرقمي لتقنية المعلومات", city:"Buraydah", tier:"webdev",
 r:null, src:"D", ph:null, addr:"Omar bin Salim St, Al-Bishr, Buraydah 52377 — Al-Salem Complex, 2nd floor, office 4",
 does:"Saudi establishment specialising in design, hosting and programming of websites.",
 why:"Hosting-plus-design shops skew WordPress. If you can also handle custom React/Node work you're an upgrade rather than a duplicate — lead with that distinction explicitly.",
 links:[]},

{id:"rossum2", n:"Arabic Programming Company", ar:"الشركة العربية للبرمجة", city:"Buraydah", tier:"webdev",
 r:[5.0,null], src:"G", ph:null, addr:"Plus code 9X97+MPC",
 does:"Listed by Maps as a software company (شركة برمجيات).",
 why:"Almost no public information — no phone, no site, few reviews. Worth twenty minutes to look up in person since the plus code puts it in central Buraydah near several others on this list. Bundle it into one trip.",
 links:[]},

{id:"webprog", n:"Web Programming", ar:"برمجة مواقع ويب", city:"Buraydah", tier:"webdev",
 r:[5.0,null], src:"G", ph:null, addr:"Plus code 9WXG+769",
 does:"Maps-listed software company.",
 why:"Same as above — thin listing, central location. Cheap to check while you're visiting the King Khalid Road cluster.",
 links:[]},

{id:"learnprog", n:"Programming Training & Tech Services", ar:"تعلم البرمجة و خدمات تقنية متنوعة", city:"Buraydah", tier:"webdev",
 r:[5.0,1], src:"G", ph:"050 541 2828", addr:"—",
 does:"Software company offering programming training alongside varied technical services. Listed as open 24 hours.",
 why:"A business that teaches programming needs people who can teach and build. If they run courses, that's afternoon-compatible paid work while you're still studying — ask specifically about instructing.",
 links:[]},

{id:"afadat", n:"Afadat for Programming & Design", ar:"أفادت للبرمجة والتصميم", city:"Buraydah", tier:"webdev",
 r:[2.3,3], src:"G", ph:"058 369 4707", addr:"Prince Faisal bin Mishaal bin Saud Rd",
 does:"Programming and design.",
 why:"2.3 stars. Listed for completeness — a shop with unhappy clients sometimes needs help badly, but ask around before spending real time here.",
 links:[]},

{id:"qasr", n:"Qasr Al-Barmaja IT", ar:"قصر البرمجة لتقنية المعلومات", city:"Buraydah", tier:"webdev",
 r:[3.3,null], src:"G+S", ph:"053 091 9167", addr:"6523 King Khalid Rd, Al-Rafi'a, Buraydah 52362",
 does:"IT and programming services.",
 why:"Middling rating, but it sits on King Khalid Road within a few hundred metres of Codlop, Al-Diqah and Panorama. Zero marginal cost to knock on the door while you're on that street.",
 links:[]},

{id:"alyzer", n:"Alyzer", ar:"اليزر", city:"Ar-Rass", tier:"webdev",
 r:[5.0,3], src:"G", ph:null, addr:"Plus code VG2C+MVX",
 does:"Maps-listed software company in the Ar-Rass area.",
 why:"One of only two actual software companies in Ar-Rass, and Ar-Rass is 32 km from you — closer than Buraydah. A review names the owner ('عزام'), so this is a small owner-run shop where one conversation decides everything.",
 links:[]},

{id:"ghaboush", n:"Ghaboush Agency", ar:"وكالة غبوش", city:"Ar-Rass", tier:"webdev",
 r:[4.8,4], src:"G", ph:"050 053 7187", addr:"—",
 does:"Maps-listed software company with its own website. Open 24 hours.",
 why:"4.8 and a website, in a city with almost no competition for developers. No web presence I could confirm through search, so call the number directly rather than hunting for a contact form.",
 links:[]},

/* ---------------- IT SERVICES / NETWORKS ---------------- */
{id:"inter", n:"Inter Company for Communications & IT", ar:"شركة انتر للاتصالات وتقنية المعلومات", city:"Buraydah", tier:"itserv",
 r:[4.1,62], src:"G+D", ph:"056 324 3323", addr:"Al-Sadah, former Al-Rajhi building",
 does:"LLC since 2009. Consulting centres, computer services, computer networks, IT. Maps files them as computer consultants.",
 why:"62 reviews and 16 years of clients means a backlog of small internal systems people have asked for and never got. Their strength is networks and consulting, which usually means software delivery is thin or outsourced — that's the gap you fill. Ask what they've turned down for lack of a developer.",
 q:"شركة محترمة جدا وموظفوها قمة في الالتزام والاحترام", links:[]},

{id:"stc-bpo", n:"Solution by stc — Business Outsourcing Centre", ar:"مركز تعهيد الأعمال", city:"Buraydah", tier:"itserv",
 r:[4.3,39], src:"G", ph:null, addr:"Plus code 9WF8+RGP",
 does:"stc's business process outsourcing centre — an actual operational site in Buraydah, not a retail shop.",
 why:"Genuinely different from the stc phone stores I cut from the last list. BPO centres run large support and technical operations locally and hire in volume, including non-Saudis. Worth walking in to ask what technical roles exist on site rather than applying through the national portal.",
 links:[["stc careers","https://careers.stc.com.sa/"]]},

{id:"rukn", n:"Solutions Corner IT", ar:"ركن حلول لتقنية المعلومات", city:"Buraydah", tier:"itserv",
 r:[4.6,31], src:"G", ph:"059 506 1210", addr:"Al-Sadah",
 does:"IT solutions; Maps categorises them under phone repair, so expect a service-heavy mix.",
 why:"A review says 'they have solutions for every technology' and praises the team — a busy service shop. Lower ceiling for development work, but they're the kind of place that picks up small business-system jobs and needs someone who can actually write them.",
 links:[]},

{id:"advanced-biz", n:"Advanced Business Solutions", ar:"شركة حلول الاعمال المتقدمة", city:"Buraydah", tier:"itserv",
 r:[5.0,1], src:"G", ph:"050 370 8224", addr:"Qurtuba St",
 does:"Corporate office with its own website; business solutions.",
 why:"Only one review, so treat the rating as noise. 'Business solutions' offices usually resell or implement systems — ask directly whether they build anything in-house before pitching yourself as a developer.",
 links:[]},

{id:"daw-shamel", n:"Light of Comprehensive Computers Co.", ar:"شركة ضوء الشامل للحاسبات المحدودة", city:"Buraydah", tier:"itserv",
 r:null, src:"D", ph:null, addr:"King Abdullah Rd, Al-Safra, Buraydah 52382",
 does:"LLC doing electronics retail, computer services, and website development — the directory files them under web development companies.",
 why:"Retail-plus-services businesses usually want their own e-commerce or inventory system and never get around to it. Ask what they use internally; the answer is normally 'nothing good'. Walk-in is easy since there's always someone at the counter.",
 links:[]},

{id:"ofoq-branch", n:"Al Ofoq IT — Buraydah branch", ar:"شركة الأفق لتقنية المعلومات - فرع بريدة", city:"Buraydah", tier:"itserv",
 r:[4.7,3], src:"G", ph:"016 382 1183", addr:"Omar bin Al-Khattab Rd",
 does:"IT company branch; Maps lists it as an electronics store.",
 why:"The word 'branch' means there's a head office somewhere else — ask where, and whether the head office hires developers. That question is worth more than the branch itself.",
 links:[]},

{id:"raqmiyat", n:"Raqmiyat Technology Co.", ar:"شركة رقميات التقنية", city:"Buraydah", tier:"itserv",
 r:[5.0,2], src:"G", ph:"054 066 9948", addr:"— (corporate office, no street address listed)",
 does:"Corporate office with a website, listed under IT searches.",
 why:"Registered with the Ministry of Commerce under a similar name. Two reviews only, so call to establish what they actually do before investing a trip.",
 links:[]},

{id:"mijdaf", n:"Mijdaf (Paddle) Trading", ar:"شركة مجداف للتجارة", city:"Buraydah", tier:"itserv",
 r:null, src:"D", ph:null, addr:"King Abdulaziz Rd, Al-Muntazah, Buraydah 52381",
 does:"Saudi company founded 1979, listed under computer networks and electronics.",
 why:"Founded in 1979 — one of the oldest technology-adjacent businesses in Qassim, so it has deep local client relationships. Networks-first, but a company this established almost certainly has internal systems nobody has modernised.",
 links:[]},

{id:"ruya", n:"Seeing Reality Security Systems", ar:"رؤية الواقع الأمنية", city:"Buraydah", tier:"itserv",
 r:null, src:"D", ph:null, addr:"6979 Al-Sina'a, Al-Muntazah, Buraydah 52381 (CR 1131295919)",
 does:"Security systems, cameras and computer networks.",
 why:"Camera and access-control companies increasingly need dashboards, monitoring interfaces and integrations — real web work sitting on top of hardware. A niche worth one conversation because almost no developer thinks to ask.",
 links:[]},

{id:"nasaq", n:"Nasaq Security Systems", ar:"شركة نسق للانظمة الأمنية", city:"Ar-Rass", tier:"itserv",
 r:[4.9,64], src:"G", ph:"055 645 4818", addr:"Plus code VFCW+W88",
 does:"Security systems and cameras.",
 why:"4.9 across 64 reviews — a well-run operation in a city only 32 km away. Same angle as above: installed camera fleets need monitoring and reporting software, which is web work they currently have no one to build.",
 links:[]},

{id:"nuzum-rass", n:"Nuzum Al-Rass", ar:"نظم الرس", city:"Ar-Rass", tier:"itserv",
 r:[4.9,257], src:"G", ph:"056 676 0515", addr:"King Salman St, Ar-Rass",
 does:"Computer networks centre.",
 why:"257 reviews at 4.9 makes this one of the most trusted tech businesses in the entire region, and it's 32 km from you. Networking-first, so confirm whether they do any programming — but a client base that size generates software requests they must be turning down.",
 links:[]},

{id:"maktab", n:"Al-Maktab Computer Services", ar:"المكتب لخدمات الكمبيوتر", city:"Ar-Rass", tier:"itserv",
 r:[4.5,248], src:"G", ph:"016 333 9991", addr:"Al-Jam'iyah Rd, Ar-Rass",
 does:"Computer services and repair.",
 why:"248 reviews. Primarily repair, so the development ceiling is low — but reviews mention expat staff working there, which tells you the shop hires non-Saudis as a matter of course. Useful intelligence even if you don't work there.",
 links:[]},

{id:"osoul", n:"Osoul Al-Hasib — Maintenance & Programming", ar:"مؤسسة أصول الحاسب | صيانة & برمجة", city:"Buraydah", tier:"itserv",
 r:[4.3,null], src:"G", ph:"054 345 4906", addr:"Omar bin Al-Khattab Rd",
 does:"Computer repair with programming in the business name.",
 why:"Repair-led, but they advertise برمجة explicitly. Open until 11 PM, so easy to visit after class — one of the few places on this list you could reach on a weekday evening.",
 links:[]},

/* ---------------- MARKETING / DESIGN AGENCIES ---------------- */
{id:"mahdi", n:"Al-Mahdi Advertising Agency", ar:"وكالة المهدي للدعاية والاعلان", city:"Buraydah", tier:"agency",
 r:[4.7,271], src:"G", ph:"056 545 4013", addr:"Omar bin Al-Khattab Rd",
 does:"Advertising agency with its own website — design and campaign work.",
 why:"271 reviews at 4.7 makes this the biggest agency in Buraydah by reputation. Agencies this size sell websites constantly and outsource the build. Walk in and ask who builds the sites they design; if the answer is a freelancer in another city, you've found your opening.",
 q:"تعامل راقي طلبت منهم تصميم واستلمته بنفس اليوم", links:[]},

{id:"mawqi", n:"Mawqi Al-Taswiq Marketing Services", ar:"مؤسسة موقع التسويق للخدمات التسويقية", city:"Buraydah", tier:"agency",
 r:[4.9,62], src:"G", ph:"053 191 2020", addr:"Omar bin Al-Khattab Rd",
 does:"Marketing agency with its own website.",
 why:"4.9 across 62 reviews. Opens at 4 PM per its listed hours — which fits your schedule better than almost anything else here. Pitch per-project build capacity, not a salaried role.",
 links:[]},

{id:"awar", n:"Awar Marketing Services", ar:"أوّار للخدمات التسويقية", city:"Unaizah", tier:"agency",
 r:null, src:"D", ph:null, addr:"Omar bin Al-Khattab Rd, Al-Khalidiyah, Unaizah 56261",
 does:"Digital marketing: content, graphics, motion graphics, paid ads, and website design. The directory files them under web development companies.",
 why:"They explicitly sell website design, which means somebody has to build it. Reach them on Instagram or WhatsApp rather than email — marketing agencies live on social. Your Erth result (40% faster, 1.8× repeat requests) is exactly the number an agency loves to quote to a client.",
 links:[]},

{id:"urghwani", n:"Urghwani", ar:"أورغواني", city:"Buraydah", tier:"agency",
 r:null, src:"D", ph:null, addr:"Buraydah",
 does:"Creative digital-marketing agency doing WordPress site programming, design and development.",
 why:"Their own directory listing names WordPress programming as a service, so they already do build work in-house. If you can offer custom development beyond WordPress, you extend what they can sell rather than competing with what they have.",
 links:[]},

{id:"fender", n:"Fender Marketing Services", ar:"فندر للخدمات التسويقية", city:"Buraydah", tier:"agency",
 r:[4.6,10], src:"G", ph:"055 488 8985", addr:"Al-Bukhari district",
 does:"Online marketing services with its own website.",
 why:"Small and well-reviewed. Same play as the other agencies: offer to be the person who builds what they sell, priced per project.",
 links:[]},

{id:"jathb", n:"Jathb Digital Marketing", ar:"جذب للتسويق الالكتروني", city:"Buraydah", tier:"agency",
 r:[5.0,5], src:"G", ph:"055 287 7717", addr:"8264 Jarallah bin Dhuhaira St",
 does:"Digital marketing agency.",
 why:"Small, new, social-media led. A review notes their work speaks for itself on social platforms — which means they're producing constantly and could use technical capacity.",
 links:[]},

{id:"jav", n:"Jav Advertising", ar:"جاف للدعاية والإعلان", city:"Al-Bukayriyah", tier:"agency",
 r:null, src:"W", ph:null, addr:"Al-Bukayriyah — ~3.6 km from you",
 does:"Design and advertising agency, essentially on your doorstep.",
 why:"The only design or tech business of any kind in Al-Bukayriyah. At 3.6 km there is no excuse not to walk in with a laptop and open alhisony.com and erthfc.com in front of them. Don't ask for a job title — ask who builds the sites they design.",
 links:[["Site","https://www.jav.sa/"]]},

/* ---------------- VERIFY FIRST ---------------- */
{id:"ecit", n:"\"IT Experts\" office", ar:"شركة خبراء تقنية المعلومات", city:"Riyadh Al-Khabra", tier:"verify",
 r:[4.9,15], src:"G", ph:"050 125 2878", addr:"Business frontage, King Fahd Rd, Riyadh Al-Khabra",
 does:"Listed by Maps as a software company.",
 why:"If genuinely local this is your closest software company at ~12 km — far better than anything in Buraydah. But there's a name collision: a company called ECIT with a nearly identical Arabic name is headquartered in the capital Riyadh, also on a 'King Fahd Road'. I could not resolve which entity this pin belongs to. Call and ask where they're located before counting on it. Worth the call regardless: a Google review on this exact listing asks 'هل توظفون المقيمين' — do you hire expats.",
 q:"هل توظفون المقيمين", links:[]},

{id:"itharweb", n:"Ithar Web", ar:"ايثار ويب لتصميم المواقع", city:"Buraydah", tier:"verify",
 r:[5.0,13], src:"G+W", ph:"050 186 1968", addr:"King Abdulaziz Rd (branch road)",
 does:"Web design, WordPress development, digital marketing, and digital-library projects.",
 why:"Appears in Buraydah Maps results with a local address, but their website (etharweb.com) markets nationally across Saudi Arabia with no Qassim-specific presence. Likely a national agency with a Buraydah listing. Confirm there are actual people in a Buraydah office before treating it as local — though as a remote/freelance client it works either way.",
 links:[["Site","https://etharweb.com/"]]},

{id:"radic", n:"Radic IT", ar:"راديك لتقنية المعلومات", city:"Buraydah", tier:"verify",
 r:null, src:"W", ph:null, addr:"No physical address published",
 does:"Web design and development, digital marketing, IT solutions — subsidiary of Redicc Group.",
 why:"Their group site carries an <b>Egyptian</b> commercial registration (153812) and names an Egyptian president, with no Saudi address anywhere. They run a blog aggressively targeting 'best web company in Buraydah' searches, which is SEO, not an office. Almost certainly not a local employer — but as an Egyptian-run agency selling into Qassim, they're a plausible <b>remote</b> client for you.",
 links:[["Site","https://redicc.org/ar/"]]},

{id:"propc", n:"Pro PC", ar:"محترف الحاسوب", city:"Unaizah", tier:"verify",
 r:[4.6,357], src:"G+D", ph:"055 997 0560", addr:"Prince Sultan bin Abdulaziz St, Shaykhah, Unaizah 56461",
 does:"Electronics and gaming-device repair and computer supplies. The directory also tags them as an IT company.",
 why:"357 reviews — a very busy shop, but the work is repair, not development. Included only because the directory files them under IT companies and you may see the name elsewhere. Low priority unless you want hardware-side work.",
 links:[]},

/* ===== recovered from your own list-olive-ten.vercel.app database (Apr 2026) ===== */
{id:"p4it", n:"P4IT — Pixel", ar:"بكسل لتقنية المعلومات", city:"Unaizah", tier:"product", own:1,
 r:null, src:"YOURS+W", ph:"+966 545 236006 · 92000 5536", addr:"Unaizah, Al-Qassim — plus a Cairo branch (Nasr City, 10th District)",
 does:"Integrated web solutions and application programming, iOS/Android apps, electronic payment gateways, server hosting, SMS services, e-commerce, and company management software.",
 why:"<b>The single best find on this whole page.</b> A <b>Saudi-Egyptian</b> company with its main office in Unaizah and a branch in Cairo — Egyptian staff, Egyptian paperwork, Egyptian management, already normal to them. That erases the biggest friction in every other application you'll send. They also do payment gateways and management software, not just brochure sites, so the work is real backend engineering. Your own note on them read 'ترحب بالمبدعين'. Contact them this week.",
 links:[["Site","https://p4it.sa/"],["Email","mailto:info@p4it.sa"]]},

{id:"sciencesoft", n:"Science Soft", ar:"ساينس سوفت", city:"Buraydah", tier:"product", own:1,
 r:null, src:"YOURS", ph:null, addr:"Buraydah",
 does:"Software development. Listed in your own database as a small Buraydah software house.",
 why:"No website and no phone in your record, so this needs legwork — but a company whose one-line description is simply 'software development' is exactly the target profile. Search the name on Google Maps and in the Qassim Chamber directory to find current contact details.",
 links:[]},

{id:"nourtech", n:"NourTech", ar:"نورتك", city:"Buraydah", tier:"webdev", own:1,
 r:null, src:"YOURS", ph:null, addr:"Buraydah — King Abdulaziz Road",
 does:"Technical solutions and web development.",
 why:"From your own research, graded B. King Abdulaziz Road is a main Buraydah artery, so pin it down and fold it into the same trip as the other Buraydah visits.",
 links:[]},

{id:"opal", n:"Opal Technology", ar:"أوبال لتقنية المعلومات", city:"Buraydah", tier:"itserv", own:1,
 r:null, src:"YOURS+W", ph:"+966 16 323 8885 · +966 50 736 6227", addr:"Al-Nahda district, Abu Bakr Al-Siddiq Rd, Buraydah (P.O. Box 253)",
 does:"System design and planning for private and government projects — network systems, security systems, communications infrastructure. Founded 2012.",
 why:"Infrastructure and networks rather than custom software, so manage expectations. But they design systems for government projects, which means documentation, diagrams and delivery discipline — and they're on Abu Bakr Al-Siddiq Road, the same street as Rossum, so it's one stop on the same walk. Your own note said 'نعم — تواصل مباشر' (yes, contact directly).",
 links:[["Site","https://opal-t.com.sa/"],["Email","mailto:info@opal-t.com.sa"]]},

{id:"futuresys", n:"Future Systems IT", ar:"فيوتشر سيستمز", city:"Buraydah", tier:"itserv", own:1,
 r:null, src:"YOURS", ph:null, addr:"Buraydah — King Abdulaziz Road",
 does:"Technical solutions and systems integration.",
 why:"Systems integration is where enterprise experience matters more than front-end polish — if they're genuinely doing integration work, send the Enterprise CV rather than the agency one.",
 links:[]},

{id:"infocesta", n:"InfoCesta", ar:"إنفوسيستا", city:"Buraydah", tier:"itserv", own:1,
 r:null, src:"YOURS", ph:null, addr:"Buraydah",
 does:"Hosting, cloud and infrastructure.",
 why:"Hosting companies always end up building control panels, billing pages and customer portals, and rarely have anyone good to build them. That's a specific, concrete thing to offer rather than a general application.",
 links:[]},

{id:"rawad", n:"Al Rawad National", ar:"الرواد الوطنية", city:"Buraydah", tier:"itserv", own:1,
 r:null, src:"YOURS+W", ph:null, addr:"Qassim",
 does:"Technical services and networks. Your record notes a collaboration with Qassim Technical College.",
 why:"The technical-college link is the interesting part — companies that partner with training institutions are used to taking on people who are still studying. Worth asking about that route specifically.",
 links:[["Site","https://www.rowadalaamal.com/"]]},

/* ===== not employers in the normal sense — but use every one of them ===== */
{id:"qassimtech", n:"Qassim Tech Society", ar:"جمعية قصيم تك", city:"Buraydah", tier:"network", own:1,
 r:null, src:"YOURS+W", ph:"WhatsApp +966 53 607 0230", addr:"Qassim region — events across Buraydah and Unaizah",
 does:"Non-profit technology association. Workshops and training (cybersecurity, data protection, encryption), technical events and conferences including LEAP, innovation camps, community sessions. Partners shown include SDAIA, the Ministry of Communications & IT, Qassim University, stc and Al Rajhi Bank.",
 why:"<b>Join this week — membership and volunteering are both open.</b> This is the only organised technology community in your entire region, and it puts you in a room with the people who run every company on this page. Volunteering at their events is the fastest way for a student with no local network to become a known name. It also gives you something to say when someone asks what you do outside university.",
 links:[["Site","https://qassim.tech/"],["WhatsApp","https://wa.me/966536070230"],["Email","mailto:info@qassim.tech"]]},

{id:"efhas-training", n:"Efhas Training Centre", ar:"إفهاص للتدريب", city:"Buraydah", tier:"network", own:1,
 r:null, src:"YOURS+W", ph:"055 402 5589", addr:"Qassim",
 does:"TVTC-accredited training centre. Programmes in soft skills, ERP, CRM, cooperative training (HR, accounting, IT, cybersecurity), and children's coding and robotics. Has a dedicated التوظيف (careers) section.",
 why:"<b>Teaching is real income that fits your timetable.</b> They run children's coding and robotics classes and openly recruit instructors — that's afternoon and weekend work, it pays, it's legal to arrange, and 'taught programming to N students' is a genuinely good CV line. Far more attainable right now than a full-time developer post, and it keeps you in the local tech scene.",
 links:[["Site","https://efhas.sa/"]]},

{id:"atmaal", n:"Atmaal", ar:"أتمال", city:"Buraydah", tier:"network", own:1,
 r:null, src:"YOURS+W", ph:null, addr:"Multiple branches — Riyadh and Qassim",
 does:"Saudi recruitment platform and job portal. Build a CV in their system, search postings, and apply through the platform. Also advertises roles at Atmaal itself and on AT Force projects.",
 why:"Register an account and set up alerts — it's a Saudi-specific board that doesn't overlap much with LinkedIn or Bayt, so it surfaces roles you won't see elsewhere. Ten minutes of setup for ongoing coverage.",
 links:[["Careers portal","https://careers.atmaal.sa/"]]},

{id:"daoob", n:"Daoob Training Institute", ar:"دؤوب — معهد تدريب", city:"Buraydah", tier:"network", own:1,
 r:null, src:"YOURS", ph:"054 127 6633 · Daoob.tr@gmail.com", addr:"Hail · Qassim",
 does:"Training institute covering web development, applications and digital marketing.",
 why:"Same play as Efhas — they teach exactly what you do, so instructing is a realistic ask. Their domain (daoob.sa) didn't resolve when I checked, so confirm they're still trading before spending time; the Gmail address suggests a small operation.",
 links:[]},

{id:"visooft", n:"Visooft", ar:"مؤسسة رؤى برمجية", city:"Buraydah", tier:"verify", own:1,
 r:null, src:"YOURS", ph:null, addr:"Qassim",
 does:"Software solutions, applications and online stores. Graded A in your own database.",
 why:"You rated this one A and recorded 'نعم' for hiring non-Saudis, so past-you thought it was a strong target. But visooft.com does not resolve today. Either they've moved domain or closed — search the Arabic name before writing them off, because your own note says this was a good one.",
 links:[]}
];

/* ---------------------------------------------------------------------
   Straight-line distance from the pin 26°07'55.6"N 43°38'37.7"E
   (26.132111, 43.643809). [km, precision]

   exact  — decoded from the business's own Google plus code (±15 m)
   street — Nominatim geocode of its street (±3 km; these roads are long)
   town   — town centre (Unaizah 34.5 / Ar-Rass 33.0 / R.Al-Khabra 12.1)
   city   — Buraydah centre 39.5 km, and Buraydah is ~15 km across (±5 km)
   --------------------------------------------------------------------- */
export const KM = {
  jav:[2.9,"exact"], ecit:[12.1,"town"],
  maktab:[31.6,"exact"], nasaq:[32.5,"exact"], "nuzum-rass":[33.0,"street"],
  ghaboush:[33.0,"town"], alyzer:[33.5,"exact"],
  wakaed:[34.5,"town"], awar:[34.5,"town"], propc:[34.5,"town"],
  funoon:[34.5,"town"], "ofoq-tech":[34.5,"town"],
  ruman:[36.7,"street"], "stc-bpo":[38.3,"exact"],
  "digital-creativity":[39.4,"street"],
  ultimate:[39.5,"city"], efhas:[39.5,"city"], mosader:[39.5,"city"],
  nuzumcode:[39.5,"city"], ecommerce:[39.5,"city"], learnprog:[39.5,"city"],
  afadat:[39.5,"city"], inter:[39.5,"city"], rukn:[39.5,"city"],
  "advanced-biz":[39.5,"city"], "daw-shamel":[39.5,"city"], raqmiyat:[39.5,"city"],
  mijdaf:[39.5,"city"], ruya:[39.5,"city"], urghwani:[39.5,"city"],
  fender:[39.5,"city"], jathb:[39.5,"city"], itharweb:[39.5,"city"],
  webprog:[40.8,"exact"], codlop:[41.1,"exact"], rossum2:[41.4,"exact"],
  rossum:[42.1,"street"], aldqh:[42.6,"street"], panorama:[42.6,"street"],
  qasr:[42.6,"street"], mte:[43.1,"street"],
  mahdi:[43.5,"street"], mawqi:[43.5,"street"], osoul:[43.5,"street"],
  "ofoq-branch":[43.5,"street"],
  /* recovered from your own companies-db.json */
  p4it:[34.5,"town"], opal:[42.1,"street"],
  sciencesoft:[39.5,"city"], nourtech:[39.5,"city"], futuresys:[39.5,"city"],
  infocesta:[39.5,"city"], rawad:[39.5,"city"], qassimtech:[39.5,"city"],
  "efhas-training":[39.5,"city"], atmaal:[39.5,"city"], daoob:[39.5,"city"],
  visooft:[39.5,"city"],
  radic:null   /* no address published anywhere — cannot be placed */
};

export const kmOf = id => ((KM[id] && KM[id][0]) != null ? KM[id][0] : 999);
