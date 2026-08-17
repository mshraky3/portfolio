#!/usr/bin/env python3
# ATS-friendly one-page resume for Mahmoud Ahmed El-Sharaky
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                                HRFlowable, ListFlowable, ListItem)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import sys

OUT = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
# Variant: ksa (default) | ireland | remote — the three market variants — plus five
# sector variants for the Qassim employers in the HQ "Qassim 40km" tab:
# enterprise | agency | health | edu | gov.
# Every variant states the same facts. Only the headline, the summary angle, the
# targeting line, and the ORDER of the experience blocks change.
VARIANT = (sys.argv[2] if len(sys.argv) > 2 else "ksa").lower()

TITLES = {
    "ksa": "Software Engineer &nbsp;|&nbsp; Computer Science Student",
    "ireland": "Software Engineer &nbsp;|&nbsp; Full-Stack (React &middot; Node.js &middot; PostgreSQL)",
    "remote": "Remote Full-Stack Software Engineer &nbsp;|&nbsp; React &middot; Node.js &middot; PostgreSQL",
    "enterprise": "Software Engineer &nbsp;|&nbsp; Enterprise Systems (ERP &middot; HR &middot; Reporting)",
    "agency": "Full-Stack Web Developer &nbsp;|&nbsp; React &middot; Node.js &middot; PostgreSQL",
    "health": "Software Engineer &nbsp;|&nbsp; Healthcare &amp; Health-Information Systems",
    "edu": "Software Engineer &nbsp;|&nbsp; EdTech &amp; Learning Platforms",
    "gov": "Software Engineer &nbsp;|&nbsp; Digital Services &amp; Arabic-First Systems",
    "frontend": "Junior React Developer &nbsp;|&nbsp; Frontend Engineer (React &middot; Dashboards &middot; APIs)",
}

SUMMARY_EXTRA = {
    "ksa": "",
    "ireland": " Seeking a software engineering role in Ireland (software developer is on the Critical Skills "
               "Occupations List); open to employer-sponsored relocation or starting fully remote — based at "
               "UTC+3, only 2&ndash;3 hours ahead of Irish business hours.",
    "remote": " Remote-ready by default: every system above was built, deployed, and operated independently on "
              "serverless infrastructure, with async communication in fluent English and full overlap with "
              "European business hours (UTC+3).",
    "enterprise": " Comfortable in the parts of enterprise software that are usually someone else's problem: "
                  "multi-branch data models, role-based permissions, payroll and attendance rules, document "
                  "compliance deadlines, and Arabic RTL reporting with Hijri&ndash;Gregorian dates.",
    "agency": " Ships client work end to end &mdash; four live production sites on their own domains, delivered "
              "solo from first call to deployment, including SEO, performance, bilingual AR/EN content, and "
              "post-launch support.",
    "health": " Healthcare is where most of that work happened: the HR platform runs a 25-branch healthcare "
              "provider, and the EdTech platform prepares physicians for the SCFHS (Saudi Prometric) licensing "
              "exam &mdash; so clinical vocabulary, staff-credential expiry rules, and Arabic reporting are "
              "already familiar ground.",
    "edu": " Education technology is the focus: an 8,000+ question bank with adaptive mock exams, a "
           "weakness-analysis engine, and real-time learner analytics &mdash; designed, built, and operated solo, "
           "with measured learning outcomes rather than page views.",
    "gov": " Built for Saudi requirements from the start: Arabic-first RTL interfaces and reports, "
           "Hijri&ndash;Gregorian date handling, bilingual AR/EN service portals, JWT with role-based access "
           "control, and automated compliance deadlines for expiring official documents.",
    "frontend": " Frontend-focused: I've built the operator-facing side of production systems &mdash; reusable "
                "React components, dashboards over dense tabular data, and real-time views wired to REST APIs "
                "&mdash; and I document every component so a non-technical team can run it after I hand it off.",
}

# One line under the summary that names the sector — helps a human screener and an
# ATS keyword match place the CV in the right pile immediately.
TARGETS = {
    "enterprise": "<b>Target role:</b> Software Engineer / Developer on internal business systems — ERP, HR, "
                  "operations dashboards, and management reporting.",
    "agency": "<b>Target role:</b> Full-stack web developer delivering client websites, web applications, and "
              "mobile-ready platforms.",
    "health": "<b>Target role:</b> Software Engineer / Health-Information Systems Developer — hospital internal "
              "systems, staff and credential management, clinical reporting, and patient-facing portals.",
    "edu": "<b>Target role:</b> Software Engineer / Developer in university IT or EdTech — student and staff "
           "systems, e-learning and assessment platforms, and academic dashboards.",
    "gov": "<b>Target role:</b> Software Engineer / Digital Services Developer — e-service portals, internal "
           "administrative systems, and Arabic-first digital transformation work.",
    "frontend": "<b>Target role:</b> Junior React / Frontend Developer — internal dashboards, operator tools, "
                "and data-heavy interfaces on top of existing backend systems.",
}

# ---------------------------------------------------------------------------
# Per-company variants for the 11 ranked Qassim targets (see /hq/targets).
# Keys match the company ids in frontend/src/pages/hq/data/techCompanies.js.
# Each entry is (headline, summary angle, target-role line, project order).
# Same facts as every other variant — only emphasis and ordering change.
# ---------------------------------------------------------------------------
COMPANY_VARIANTS = {
    "p4it": (
        "Full-Stack Software Engineer &nbsp;|&nbsp; Backend, Integrations &amp; Payment Systems",
        " Backend-first: relational data modelling, REST API design, third-party integrations, and "
        "authentication are the parts I do most. Arabic-native and Egyptian, working in Qassim &mdash; "
        "comfortable operating across Saudi and Egyptian teams in either language.",
        "<b>Target role:</b> Backend / full-stack developer on management platforms, e-commerce, and "
        "payment or messaging integrations.",
        ["hr", "smle", "erth", "law"],
    ),
    "aldqh": (
        "Full-Stack Developer &nbsp;|&nbsp; Custom Web &amp; Business Applications",
        " Builds custom software to order rather than templates: a 25-table HR platform, an assessment "
        "engine, and two client platforms &mdash; each designed from the data model up. Keen to work "
        "somewhere that reviews my code properly; I have shipped everything solo so far and want that "
        "to change.",
        "<b>Target role:</b> Developer on custom web, desktop, or mobile applications built to client "
        "specification.",
        ["hr", "erth", "smle", "law"],
    ),
    "panorama": (
        "Full-Stack Web Developer &nbsp;|&nbsp; React &middot; Node.js &middot; PostgreSQL",
        " Delivers client work end to end &mdash; four live production sites on their own domains, taken "
        "solo from first call to deployment, including design implementation, SEO, performance, and "
        "bilingual AR/EN content.",
        "<b>Target role:</b> Web developer building and programming client sites and applications.",
        ["law", "erth", "hr", "smle"],
    ),
    "codlop": (
        "Full-Stack Web Developer &nbsp;|&nbsp; Arabic-First Delivery on Deadline",
        " Built for Saudi delivery requirements: Arabic-first RTL interfaces and reports, "
        "Hijri&ndash;Gregorian date handling, bilingual AR/EN portals, and role-based access control &mdash; "
        "the specification pattern that government and Etimad-tendered work keeps asking for.",
        "<b>Target role:</b> Additional delivery capacity, priced per project &mdash; the client work you "
        "postpone or turn down when the schedule is full.",
        ["hr", "erth", "law", "smle"],
    ),
    "nuzumcode": (
        "Software Engineer &nbsp;|&nbsp; Custom Systems &amp; Internal Software",
        " Builds the systems businesses run on internally rather than brochure sites: multi-branch data "
        "models, role-based permissions, operational dashboards, and automated reporting.",
        "<b>Target role:</b> Developer on custom software and internal business systems.",
        ["hr", "erth", "smle", "law"],
    ),
    "wakaed": (
        "Full-Stack Software Engineer &nbsp;|&nbsp; Business &amp; Accounting Systems",
        " Strongest in the data-heavy half of business software: payroll rules, attendance, document "
        "compliance deadlines, and Arabic financial-style reporting to PDF and Excel &mdash; the same "
        "shape of problem as cloud accounting built to order.",
        "<b>Target role:</b> Developer on cloud business and accounting software, or maintenance and "
        "extension of existing client systems.",
        ["hr", "erth", "smle", "law"],
    ),
    "rossum": (
        "Full-Stack Software Engineer &nbsp;|&nbsp; React &middot; Node.js &middot; PostgreSQL",
        " Ships production software solo: schema design, REST API, front-end, deployment, and ongoing "
        "support &mdash; four live systems currently running, none of them handed to anyone else to "
        "finish.",
        "<b>Target role:</b> Software developer on client projects, able to take a brief and deliver it "
        "end to end.",
        ["hr", "smle", "erth", "law"],
    ),
    "mte": (
        "Full-Stack Web Developer &nbsp;|&nbsp; Frontend, Backend &amp; Deployment",
        " One person for the whole delivery: front-end, back-end, database, deployment, and post-launch "
        "support. Every system listed below was built and is still operated by me, without a team to "
        "hand any part of it to.",
        "<b>Target role:</b> Web / software developer covering the full stack on client projects.",
        ["law", "erth", "hr", "smle"],
    ),
    "rukn": (
        "Software Engineer &nbsp;|&nbsp; Internal Business Tools &amp; Tracking Systems",
        " Builds the internal systems service businesses usually run on paper or spreadsheets: job and "
        "ticket tracking, customer records, inventory and parts, staff permissions, and automated "
        "reminders before deadlines are missed.",
        "<b>Target role:</b> Developer building internal tools &mdash; job tracking, customer records, "
        "inventory, and reporting.",
        ["hr", "erth", "smle", "law"],
    ),
    "radic": (
        "Remote Full-Stack Developer &nbsp;|&nbsp; React &middot; Node.js &middot; PostgreSQL",
        " Remote-ready by default &mdash; every system below was built, deployed, and supported "
        "independently. Based in Qassim, so client meetings in Buraydah or Unaizah can be attended in "
        "person, which a fully remote agency normally cannot offer.",
        "<b>Target role:</b> Remote or freelance full-stack developer on client web and application "
        "projects.",
        ["erth", "law", "hr", "smle"],
    ),
    "sciencesoft": (
        "Software Engineer &nbsp;|&nbsp; Full-Stack (React &middot; Node.js &middot; PostgreSQL)",
        " Full-stack across relational schema design, REST API architecture, and React front-ends, with "
        "four production systems currently live and in use.",
        "<b>Target role:</b> Software developer &mdash; full-stack application development.",
        ["hr", "smle", "erth", "law"],
    ),
}

for _key, (_title, _extra, _target, _order) in COMPANY_VARIANTS.items():
    TITLES[_key] = _title
    SUMMARY_EXTRA[_key] = _extra
    TARGETS[_key] = _target
# ORDER is defined further down, so the project ordering is merged there.

if VARIANT not in TITLES:
    sys.exit(f"unknown variant {VARIANT!r}\nchoose one of: {', '.join(sorted(TITLES))}")

INK = HexColor("#111111")
ACCENT = HexColor("#1a1a1a")
GREY = HexColor("#333333")

styles = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, parent=styles['Normal'], **kw)

name_style = S('name', fontName='Helvetica-Bold', fontSize=17, leading=20,
               textColor=INK, alignment=TA_CENTER, spaceAfter=1)
title_style = S('title', fontName='Helvetica', fontSize=10.5, leading=13,
                textColor=GREY, alignment=TA_CENTER, spaceAfter=3)
contact_style = S('contact', fontName='Helvetica', fontSize=8.6, leading=12,
                  textColor=GREY, alignment=TA_CENTER, spaceAfter=2)
section_style = S('section', fontName='Helvetica-Bold', fontSize=10, leading=12,
                  textColor=INK, spaceBefore=8, spaceAfter=2)
body_style = S('body', fontName='Helvetica', fontSize=9.2, leading=12,
               textColor=GREY, alignment=TA_LEFT, spaceAfter=2)
role_style = S('role', fontName='Helvetica-Bold', fontSize=9.6, leading=12,
               textColor=INK, spaceBefore=4, spaceAfter=0)
meta_style = S('meta', fontName='Helvetica-Oblique', fontSize=8.4, leading=11,
               textColor=GREY, spaceAfter=1)
bullet_style = S('bullet', fontName='Helvetica', fontSize=9.0, leading=11.5,
                 textColor=GREY, alignment=TA_LEFT)
skill_style = S('skill', fontName='Helvetica', fontSize=9.0, leading=12.5,
                textColor=GREY, spaceAfter=0)

def rule():
    return HRFlowable(width="100%", thickness=0.6, color=HexColor("#999999"),
                      spaceBefore=1, spaceAfter=3)

def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(t, bullet_style), leftIndent=8, value='•')
         for t in items],
        bulletType='bullet', start='•', leftIndent=10,
        bulletFontSize=8, spaceBefore=0, spaceAfter=1)

story = []

story.append(Paragraph("MAHMOUD AHMED EL-SHARAKY", name_style))
story.append(Paragraph(TITLES[VARIANT], title_style))
story.append(Paragraph(
    "Qassim, Saudi Arabia &nbsp;&bull;&nbsp; alshraky3@gmail.com &nbsp;&bull;&nbsp; +966 58 261 9119",
    contact_style))
story.append(Paragraph(
    '<link href="https://github.com/mshraky3">github.com/mshraky3</link> &nbsp;&bull;&nbsp; '
    '<link href="https://www.linkedin.com/in/mahmoud-alshraky">linkedin.com/in/mahmoud-alshraky</link> &nbsp;&bull;&nbsp; '
    '<link href="https://web-dev-seven-iota.vercel.app">web-dev-seven-iota.vercel.app</link>',
    contact_style))
story.append(Spacer(1, 3))

# SUMMARY
story.append(Paragraph("SUMMARY", section_style))
story.append(rule())
story.append(Paragraph(
    "Computer Science student (B.Sc., expected 2027) and self-taught software engineer who independently "
    "designs, builds, and deploys production systems used by real organizations. Full-stack across relational "
    "database design, REST API architecture, and React front-ends, grounded in data structures, algorithms, "
    "and software engineering. Shipped an enterprise HR platform serving <b>600+ employees across 25 branches</b> "
    "and an EdTech platform with an <b>8,000+ question</b> bank." + SUMMARY_EXTRA[VARIANT], body_style))

if VARIANT in TARGETS:
    story.append(Paragraph(TARGETS[VARIANT], body_style))

# EXPERIENCE
story.append(Paragraph("EXPERIENCE", section_style))
story.append(rule())

def job(role, org, dates, loc, items, live=None):
    story.append(Paragraph(f"{role} - {org}", role_style))
    m = f"{dates} &nbsp;|&nbsp; {loc}"
    if live:
        m += f' &nbsp;|&nbsp; <link href="https://{live}">{live}</link>'
    story.append(Paragraph(m, meta_style))
    story.append(bullets(items))

JOBS = {
    "hr": dict(
        role="Full-Stack Software Engineer",
        org="Ultimate Care Rehabilitation Co. (Healthcare)",
        dates="Oct 2025 - Present", loc="Qassim, SA",
        items=[
            "Architected and shipped a multi-branch HR platform (~20,000 LOC, 25 relational tables) covering "
            "employee lifecycle, payroll, attendance, documents, and transport for <b>600+ employees across "
            "25 branches</b>.",
            "Implemented JWT authentication with role-based access control (RBAC), TTL-based in-memory caching, "
            "and composite database indexing - reaching <b>sub-second response times</b> and eliminating N+1 "
            "queries.",
            "Automated document-expiry alerts (30/60/90-day) and Arabic RTL PDF/Excel reporting with "
            "Hijri-Gregorian date conversion.",
        ]),
    "smle": dict(
        role="Full-Stack Developer",
        org="SMLE Question Bank - EdTech Platform (Personal)",
        dates="Feb 2025 - Present", loc="Qassim, SA", live="smle-question-bank.com",
        items=[
            "Built a platform for the Saudi Prometric (SCFHS) exam: an <b>8,000+ question</b> bank, adaptive "
            "mock tests, and a weakness-analysis engine with real-time analytics.",
            "Designed the PostgreSQL schema and REST API; users saw a <b>2.3x improvement</b> in measured "
            "proficiency over 3 months.",
            "Built a subscription/payments system on Moyasar (5-tier pricing, Apple Pay, webhook-driven "
            "fulfillment, VAT-inclusive invoicing) with a group-purchase flow that mints single-use invite links.",
            "Shipped a companion mobile app (Expo / React Native) sharing the same backend, alongside a "
            "Telegram bot for notifications and admin broadcast.",
        ]),
    "law": dict(
        role="Web Developer (Freelance)",
        org="Saleh Al-Hisouni Law Firm",
        dates="Jul 2025 - Aug 2025", loc="Qassim, SA", live="alhisony.com",
        items=[
            "Delivered a performant, SEO-optimized website with interactive 3D (Three.js), Schema.org structured "
            "data, and custom-domain email for formal correspondence.",
        ]),
    "erth": dict(
        role="Web Developer (Freelance)",
        org="Erth Environmental Services",
        dates="May 2025 - Jun 2025", loc="Qassim, SA", live="erthfc.com",
        items=[
            "Built a bilingual (AR/EN) platform with automated consultation workflows and Google Maps "
            "integration; cut response time <b>40%</b> and lifted repeat requests <b>1.8x</b>.",
        ]),
}

# Which project a screener in that sector should read first.
ORDER = {
    "enterprise": ["hr", "erth", "smle", "law"],
    "agency":     ["hr", "law", "erth", "smle"],
    "health":     ["hr", "smle", "erth", "law"],
    "edu":        ["smle", "hr", "erth", "law"],
    "gov":        ["hr", "erth", "smle", "law"],
    "frontend":   ["hr", "smle", "erth", "law"],
}

for _key, (_t, _e, _tg, _order) in COMPANY_VARIANTS.items():
    ORDER[_key] = _order

for key in ORDER.get(VARIANT, ["hr", "smle", "law", "erth"]):
    job(**JOBS[key])

# EDUCATION
story.append(Paragraph("EDUCATION", section_style))
story.append(rule())
story.append(Paragraph("B.Sc. in Computer Science - Qassim University", role_style))
story.append(Paragraph("2022 - 2027 (Expected) &nbsp;|&nbsp; Saudi Arabia", meta_style))
story.append(Paragraph(
    "Relevant coursework: Data Structures, Analysis &amp; Design of Algorithms, Operating Systems, Software "
    "Engineering, Databases, Logical Design, Coding &amp; Encryption Theory.", body_style))

# SKILLS
story.append(Paragraph("TECHNICAL SKILLS", section_style))
story.append(rule())
for label, val in [
    ("Languages", "JavaScript (ES2022+), Python, SQL, HTML, CSS"),
    ("Backend", "Node.js, Express, REST API design, JWT / RBAC authentication, Nodemailer"),
    ("Frontend", "React 19, Vite, Framer Motion, Material-UI, Three.js / React Three Fiber"),
    ("Databases", "PostgreSQL (schema design, indexing, query optimization), Redis, Neon"),
    ("Payments", "Moyasar integration, webhook-driven fulfillment, subscription billing, VAT invoicing"),
    ("Mobile", "Expo, React Native"),
    ("CS Foundations", "Data Structures &amp; Algorithms, Operating Systems, Software Engineering, Databases, Cryptography"),
    ("Tools &amp; Cloud", "Git, GitHub, Vercel (serverless), AWS S3 / Cloudflare R2, Vercel Blob Storage, Axios, ESLint"),
]:
    story.append(Paragraph(f"<b>{label}:</b> {val}", skill_style))

# LANGUAGES
story.append(Paragraph("LANGUAGES", section_style))
story.append(rule())
story.append(Paragraph("Arabic (Native) &nbsp;&bull;&nbsp; English (Fluent)", body_style))

doc = SimpleDocTemplate(OUT, pagesize=A4,
                        leftMargin=14*mm, rightMargin=14*mm,
                        topMargin=11*mm, bottomMargin=10*mm,
                        title="Mahmoud Ahmed El-Sharaky - Resume",
                        author="Mahmoud Ahmed El-Sharaky")
doc.build(story)
print("wrote", OUT)
