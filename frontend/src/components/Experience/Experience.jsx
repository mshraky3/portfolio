import React from "react";
import { motion } from "framer-motion";
import "./Experience.css";

// ─── Experience Data ────────────────────────────────────────────
// Same facts as JOBS in resume-src/gen_resume.py — keep both in sync.
const EXPERIENCE = [
    {
        id: "hr",
        role: "مهندس برمجيات Full-Stack",
        roleEn: "Full-Stack Software Engineer",
        org: "Ultimate Care Rehabilitation Co.",
        orgNote: "قطاع صحي — 25+ فرع",
        dates: "أكتوبر 2025 — حتى الآن",
        location: "القصيم، السعودية",
        current: true,
        items: [
            "صممت وبنيت نظام HR متكامل من الصفر (~20,000 سطر كود، 25 جدول علائقي) يغطي دورة حياة الموظف، الرواتب، الغياب، الوثائق، ونقل الطلاب لأكثر من 600 موظف عبر 25 فرعًا.",
            "طبّقت مصادقة JWT مع صلاحيات متعددة المستويات (RBAC)، تخزين مؤقت (caching) بفترات صلاحية مخصصة، وفهرسة مركّبة لقاعدة البيانات — وصلت أوقات الاستجابة لأقل من ثانية.",
            "أتمتة تنبيهات انتهاء الوثائق (30/60/90 يوم) وتقارير PDF/Excel عربية بدعم كامل للتقويم الهجري.",
        ],
        technologies: ["React 19", "Node.js", "Express.js", "PostgreSQL", "JWT", "Redis", "Vercel"],
        color: "#06B6D4",
    },
    {
        id: "smle",
        role: "مطوّر Full-Stack",
        roleEn: "Full-Stack Developer",
        org: "SMLE Question Bank",
        orgNote: "منصة EdTech شخصية",
        dates: "فبراير 2025 — حتى الآن",
        location: "القصيم، السعودية",
        current: true,
        live: "smle-question-bank.com",
        items: [
            "بنيت منصة تحضير لاختبار البرومترك السعودي (SCFHS): بنك أسئلة يضم أكثر من 8,000 سؤال، اختبارات محاكاة تكيّفية، ومحرك تحليل نقاط الضعف.",
            "صممت مخطط قاعدة البيانات وREST API — رفع أداء المستخدمين المقاس 2.3× خلال 3 أشهر.",
            "بنيت نظام اشتراكات ودفع عبر Moyasar (5 خطط تسعير، Apple Pay، تفعيل تلقائي عبر Webhooks، فوترة بضريبة القيمة المضافة) مع نظام شراء جماعي يولّد روابط دعوة لمرة واحدة.",
            "أطلقت تطبيق جوال مصاحب (Expo / React Native) يشارك نفس الواجهة الخلفية، بالإضافة إلى بوت تيليجرام للإشعارات والبث الإداري.",
        ],
        technologies: ["React", "PostgreSQL", "Node.js", "Express", "Moyasar", "Expo / React Native"],
        color: "#7C3AED",
    },
    {
        id: "law",
        role: "مطوّر ويب (عمل حر)",
        roleEn: "Web Developer (Freelance)",
        org: "مكتب المحامي صالح الحيسوني",
        orgNote: "",
        dates: "يوليو 2025 — أغسطس 2025",
        location: "القصيم، السعودية",
        current: false,
        live: "alhisony.com",
        items: [
            "سلّمت موقعًا احترافيًا بأداء عالٍ وتحسين SEO، مع نموذج 3D تفاعلي (Three.js) وبيانات Schema.org منظّمة.",
        ],
        technologies: ["React 19", "Three.js", "Vite", "Node.js"],
        color: "#D4A017",
    },
    {
        id: "erth",
        role: "مطوّر ويب (عمل حر)",
        roleEn: "Web Developer (Freelance)",
        org: "Erth Environmental Services",
        orgNote: "",
        dates: "مايو 2025 — يونيو 2025",
        location: "القصيم، السعودية",
        current: false,
        live: "erthfc.com",
        items: [
            "بنيت منصة ثنائية اللغة (عربي/إنجليزي) مع أتمتة طلبات الاستشارات وربط خرائط Google — خفّضت وقت الاستجابة 40% ورفعت الطلبات المتكررة 1.8×.",
        ],
        technologies: ["React", "Express.js", "Google Maps API"],
        color: "#10B981",
    },
];

function ExperienceItem({ job, index }) {
    return (
        <motion.article
            className="exp-item"
            style={{ "--exp-accent": job.color }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
        >
            <div className="exp-marker">
                <span className="exp-dot" />
                {job.current && <span className="exp-pulse" />}
            </div>

            <div className="exp-card">
                <div className="exp-card-head">
                    <div>
                        <h3 className="exp-role">{job.role}</h3>
                        <p className="exp-org">
                            {job.org}
                            {job.orgNote && <span className="exp-org-note"> · {job.orgNote}</span>}
                        </p>
                    </div>
                    {job.current && <span className="exp-current-badge">مستمر الآن</span>}
                </div>

                <div className="exp-meta">
                    <span className="exp-dates">{job.dates}</span>
                    <span className="exp-sep">•</span>
                    <span className="exp-location">{job.location}</span>
                    {job.live && (
                        <>
                            <span className="exp-sep">•</span>
                            <a
                                className="exp-live-link"
                                href={`https://${job.live}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {job.live}
                            </a>
                        </>
                    )}
                </div>

                <ul className="exp-bullets">
                    {job.items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>

                <div className="exp-tech">
                    {job.technologies.map((tech) => (
                        <span className="exp-tech-tag" key={tech}>
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.article>
    );
}

function Experience() {
    return (
        <motion.section
            className="experience-section"
            id="experience"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <motion.div
                className="experience-header"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true }}
            >
                <span className="experience-eyebrow">مسيرتي المهنية</span>
                <h2>خبرة عملية حقيقية</h2>
                <p className="experience-lead">
                    أنظمة إنتاجية بنيتها وأشغّلها بنفسي — من التصميم إلى النشر والصيانة.
                </p>
            </motion.div>

            <div className="exp-timeline">
                {EXPERIENCE.map((job, index) => (
                    <ExperienceItem key={job.id} job={job} index={index} />
                ))}
            </div>
        </motion.section>
    );
}

export default Experience;
