import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ProjectShowcase.css";

import smlePreview from "./projectsImgs/pro2.png";
import hirfaPreview from "./projectsImgs/mockuper.png";
import erthPreview from "./projectsImgs/wsm.png";

// ─── Project Data ───────────────────────────────────────────────
// You can expand each project with more screenshots, problem/solution, etc.
const PROJECTS = [
    {
        id: "smle",
        category: "منصة تعليمية",
        categoryEn: "EdTech",
        title: "منصة بنك أسئلة SMLE",
        subtitle: "SMLE Question Bank",
        problem:
            "المرشحون لاختبار SMLE يعانون من تشتت المصادر وعدم وجود منصة موحدة لقياس مستواهم الفعلي قبل الامتحان.",
        solution:
            "بنينا منصة متكاملة بنظام اختبارات ذكي يتكيف مع مستوى الطالب، مع لوحة تحليلات أداء لحظية ولوحات متابعة للمدربين.",
        impact:
            "أكثر من ٥٠٠٠ سؤال تفاعلي رفع معدل الإتقان ٢٫٣× خلال أول ثلاثة أشهر من الإطلاق.",
        stats: [
            { value: 5000, suffix: "+", label: "عنصر تعلّمي" },
            { value: 94, suffix: "٪", label: "رضا المستخدمين" },
            { value: 2.3, suffix: "×", label: "تحسّن الأداء" },
        ],
        technologies: ["React", "PostgreSQL", "Chart.js", "Node.js", "Express"],
        href: "https://www.smle-question-bank.com",
        github: "",
        images: [smlePreview],
        imageAlt: "واجهة منصة بنك أسئلة SMLE",
        color: "#7C3AED",
        featured: true,
    },
    {
        id: "hirfa",
        category: "سوق خدمات",
        categoryEn: "Marketplace",
        title: "منصة حِرفة للخدمات",
        subtitle: "Hirfa Services",
        problem:
            "أصحاب المنازل يضيعون وقتًا كبيرًا في البحث عن فنيين موثوقين عبر منصات متعددة ومعقدة.",
        solution:
            "صممنا واجهة مبسطة تربط صاحب المنزل مباشرة بأقرب فني متخصص دون الحاجة لإنشاء حساب، مع نظام تقييم وحجز فوري.",
        impact:
            "رحلة حجز جديدة قللت وقت العثور على فني من ٢٠ دقيقة إلى أقل من ٣ دقائق.",
        stats: [
            { value: 3, suffix: " دقائق", label: "متوسط الحجز" },
            { value: 65, suffix: "٪", label: "زيادة التحويل" },
            { value: 20, suffix: "+", label: "تخصص متوفر" },
        ],
        technologies: ["React", "PostgreSQL", "Supabase", "Tailwind"],
        href: "https://hirfa-react.vercel.app",
        github: "",
        images: [hirfaPreview],
        imageAlt: "واجهة منصة حِرفة للخدمات",
        color: "#06B6D4",
        featured: false,
    },
    {
        id: "erth",
        category: "استشارات أعمال",
        categoryEn: "Business",
        title: "منصة الأثر البيئي",
        subtitle: "Erth Environmental",
        problem:
            "شركة استشارات بيئية تحتاج واجهة ثنائية اللغة مع أتمتة جمع التقييمات وربط خرائط Google.",
        solution:
            "واجهة ثنائية اللغة مع تكاملات تلقائية مع خرائط Google وExpress.js لدعم طلبات الاستشارات البيئية ومتابعتها.",
        impact:
            "أتمتة جمع التقييمات رفعت معدل الطلبات المتكررة ١٫٨× وخفضت وقت الردود بنسبة ٤٠٪.",
        stats: [
            { value: 1.8, suffix: "×", label: "طلبات متكررة" },
            { value: 40, suffix: "٪", label: "تسريع الاستجابة" },
            { value: 2, suffix: " لغة", label: "واجهة متعددة" },
        ],
        technologies: ["React", "Express.js", "Apify", "Google Maps API"],
        href: "https://erthfc.com/",
        github: "",
        images: [erthPreview],
        imageAlt: "واجهة منصة الأثر البيئي",
        color: "#10B981",
        featured: false,
    },
];

const CATEGORIES = [
    { key: "all", label: "الكل" },
    { key: "EdTech", label: "تعليمية" },
    { key: "Marketplace", label: "سوق خدمات" },
    { key: "Business", label: "أعمال" },
];

// ─── Animated Counter ───────────────────────────────────────────
function AnimatedCounter({ value, suffix = "", duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const start = performance.now();
                    const isFloat = !Number.isInteger(value);

                    const animate = (now) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // easeOutExpo
                        const eased = 1 - Math.pow(2, -10 * progress);
                        const current = eased * value;
                        setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value, duration]);

    return (
        <span ref={ref} className="counter-value">
            {count}
            {suffix}
        </span>
    );
}

// ─── Browser Mockup ─────────────────────────────────────────────
function BrowserMockup({ children, url, color }) {
    return (
        <div className="browser-mockup" style={{ "--project-accent": color }}>
            <div className="browser-topbar">
                <div className="browser-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                </div>
                <div className="browser-url-bar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>{url}</span>
                </div>
            </div>
            <div className="browser-content">{children}</div>
        </div>
    );
}

// ─── Case Study Modal ───────────────────────────────────────────
function CaseStudyModal({ project, onClose }) {
    const modalRef = useRef(null);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    // Close on backdrop click
    const handleBackdrop = (e) => {
        if (e.target === modalRef.current) onClose();
    };

    return (
        <motion.div
            className="case-study-overlay"
            ref={modalRef}
            onClick={handleBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="case-study-modal"
                style={{ "--project-accent": project.color }}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <button className="case-study-close" onClick={onClose} aria-label="إغلاق">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="case-study-header">
                    <span className="case-study-category">{project.category}</span>
                    <h2>{project.title}</h2>
                    <p className="case-study-subtitle">{project.subtitle}</p>
                </div>

                {/* Browser Preview */}
                <BrowserMockup url={project.href.replace("https://", "")} color={project.color}>
                    <img src={project.images[0]} alt={project.imageAlt} />
                </BrowserMockup>

                {/* Problem → Solution */}
                <div className="case-study-story">
                    <div className="story-block">
                        <div className="story-icon problem-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4M12 16h.01" />
                            </svg>
                        </div>
                        <div>
                            <h4>المشكلة</h4>
                            <p>{project.problem}</p>
                        </div>
                    </div>
                    <div className="story-connector">
                        <svg width="24" height="40" viewBox="0 0 24 40">
                            <path d="M12 0v40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
                            <path d="M6 30l6 8 6-8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                        </svg>
                    </div>
                    <div className="story-block">
                        <div className="story-icon solution-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <path d="M22 4 12 14.01l-3-3" />
                            </svg>
                        </div>
                        <div>
                            <h4>الحل</h4>
                            <p>{project.solution}</p>
                        </div>
                    </div>
                </div>

                {/* Impact */}
                <div className="case-study-impact">
                    <h4>النتائج</h4>
                    <p>{project.impact}</p>
                </div>

                {/* Animated Stats */}
                <div className="case-study-stats">
                    {project.stats.map((stat) => (
                        <div className="case-stat" key={stat.label}>
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            <span className="case-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Tech Stack */}
                <div className="case-study-tech">
                    <h4>التقنيات المستخدمة</h4>
                    <div className="tech-pills">
                        {project.technologies.map((tech) => (
                            <span className="tech-pill" key={tech}>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="case-study-actions">
                    <a
                        className="case-btn primary"
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>زيارة المشروع</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                        </svg>
                    </a>
                    {project.github && (
                        <a
                            className="case-btn secondary"
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>الكود المصدري</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.17c-3.34.73-4.03-1.41-4.03-1.41-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.19.7.8.58C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        </a>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Project Card ───────────────────────────────────────────────
function ProjectCard({ project, onClick, index }) {
    return (
        <motion.article
            className={`showcase-card ${project.featured ? "featured" : ""}`}
            style={{ "--project-accent": project.color }}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
            whileHover={{ y: -8 }}
            onClick={() => onClick(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick(project)}
            aria-label={`عرض تفاصيل مشروع ${project.title}`}
        >
            {/* Glow accent */}
            <div className="card-glow" />

            {/* Browser frame preview */}
            <div className="card-preview">
                <BrowserMockup url={project.href.replace("https://", "")} color={project.color}>
                    <img src={project.images[0]} alt={project.imageAlt} loading="lazy" />
                </BrowserMockup>
            </div>

            {/* Content */}
            <div className="card-content">
                <div className="card-meta">
                    <span className="card-category">{project.category}</span>
                    <span className="card-subtitle">{project.subtitle}</span>
                </div>
                <h3 className="card-title">{project.title}</h3>
                <p className="card-description">{project.problem}</p>

                {/* Quick stats */}
                <div className="card-stats">
                    {project.stats.slice(0, 2).map((stat) => (
                        <div className="card-stat" key={stat.label}>
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Tech tags */}
                <div className="card-tech">
                    {project.technologies.slice(0, 3).map((tech) => (
                        <span className="card-tag" key={tech}>
                            {tech}
                        </span>
                    ))}
                    {project.technologies.length > 3 && (
                        <span className="card-tag more">+{project.technologies.length - 3}</span>
                    )}
                </div>

                {/* CTA */}
                <div className="card-cta">
                    <span>عرض دراسة الحالة</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </motion.article>
    );
}

// ─── Main Showcase Component ────────────────────────────────────
function ProjectShowcase() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedProject, setSelectedProject] = useState(null);

    const filteredProjects =
        activeCategory === "all"
            ? PROJECTS
            : PROJECTS.filter((p) => p.categoryEn === activeCategory);

    const handleOpen = useCallback((project) => setSelectedProject(project), []);
    const handleClose = useCallback(() => setSelectedProject(null), []);

    return (
        <section className="project-showcase-section" id="projects">
            {/* Section Header */}
            <motion.div
                className="showcase-header"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true }}
            >
                <span className="showcase-eyebrow">أعمال مختارة</span>
                <h2>مشاريع تبني نمواً قابلاً للقياس</h2>
                <p className="showcase-lead">
                    كل مشروع يبدأ بمشكلة حقيقية وينتهي بنتائج ملموسة. اضغط على أي مشروع
                    لاستكشاف القصة الكاملة.
                </p>
            </motion.div>

            {/* Category Filters */}
            <motion.div
                className="showcase-filters"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
            >
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.key}
                        className={`filter-btn ${activeCategory === cat.key ? "active" : ""}`}
                        onClick={() => setActiveCategory(cat.key)}
                    >
                        {cat.label}
                    </button>
                ))}
            </motion.div>

            {/* Project Grid */}
            <div className="showcase-grid">
                <AnimatePresence mode="wait">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={handleOpen}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Case Study Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <CaseStudyModal project={selectedProject} onClose={handleClose} />
                )}
            </AnimatePresence>
        </section>
    );
}

export default ProjectShowcase;
