import "./Services.css";
import { motion } from "framer-motion";

const SERVICES = [
  {
    title: "تطوير Full-Stack",
    description:
      "أبني تطبيقات ويب متكاملة من الواجهة حتى السيرفر. React في الأمام وNode.js + Express في الخلف، مع قواعد بيانات PostgreSQL مصممة للتوسع.",
    highlights: ["React 19 + Vite", "REST API مع Express", "PostgreSQL + Neon Serverless"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    title: "أنظمة مؤسسية",
    description:
      "أصمم أنظمة إدارة متقدمة بصلاحيات متعددة المستويات، لوحات تحكم تفاعلية، تقارير PDF/Excel عربية، وإشعارات آلية مجهزة لبيئات العمل الحقيقية.",
    highlights: ["RBAC متعدد الفروع", "تقارير PDF عربية", "لوحات تحكم + إشعارات"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 8h4" />
        <path d="M7 11h2" />
      </svg>
    ),
  },
  {
    title: "قواعد بيانات وأداء",
    description:
      "أصمم هياكل بيانات علائقية محسّنة مع فهارس استراتيجية وتخزين مؤقت ذكي، لضمان استجابة سريعة حتى مع آلاف السجلات والعمليات المتزامنة.",
    highlights: ["25+ جدول علائقي", "Caching + فهارس مركّبة", "Serverless Deployment"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    title: "تكاملات وأتمتة",
    description:
      "أربط تطبيقك مع خدمات خارجية مثل بوابات الدفع، Google Maps، أنظمة البريد، التخزين السحابي، وWeb Scraping. كل شيء يعمل تلقائيًا بدون تدخل.",
    highlights: ["Google Maps API", "Nodemailer + Blob Storage", "Apify Web Scraping"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

const TECH_STACK = [
  { name: "React", color: "#61DAFB" },
  { name: "Node.js", color: "#339933" },
  { name: "Express", color: "#FFFFFF" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Vercel", color: "#FFFFFF" },
  { name: "JWT", color: "#D63AFF" },
  { name: "Vite", color: "#646CFF" },
  { name: "Three.js", color: "#FFFFFF" },
];

function Services() {
  return (
    <motion.section
      className="services-section"
      id="SERVICES"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="services-header"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        viewport={{ once: true }}
      >
        <span className="services-eyebrow">ماذا أقدّم</span>
        <h2>خدمات تطوير متكاملة</h2>
        <p>
          أتعامل مع المشروع من كل الزوايا: التصميم، البرمجة، قاعدة البيانات، والنشر.
          التركيز دائمًا على حل المشكلة الفعلية بأبسط وأقوى طريقة ممكنة.
        </p>
      </motion.div>

      <div className="services-grid">
        {SERVICES.map((service, index) => (
          <motion.article
            key={service.title}
            className="service-card"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 + index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -8 }}
          >
            <div className="service-card-body">
              <div className="service-card-top">
                <span className="service-step">{String(index + 1).padStart(2, "0")}</span>
                <div className="service-icon">
                  {service.icon}
                </div>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-highlights">
                {service.highlights.map((item) => (
                  <span className="service-highlight" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="service-card-accent" />
          </motion.article>
        ))}
      </div>

      {/* Tech Stack Bar */}
      <motion.div
        className="tech-stack-bar"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <span className="tech-stack-label">التقنيات الأساسية</span>
        <div className="tech-stack-list">
          {TECH_STACK.map((tech) => (
            <motion.span
              key={tech.name}
              className="tech-stack-item"
              style={{ "--tech-color": tech.color }}
              whileHover={{ scale: 1.1, y: -3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {tech.name}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="services-cta"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <p>عندك فكرة مشروع؟ خلنا نتكلم عنها.</p>
        <a className="services-link" href="https://wa.link/5zcep6">
          تواصل عبر واتساب
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M8 5h11v11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 17 18.5 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </motion.div>
    </motion.section>
  );
}

export default Services;