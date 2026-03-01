import React from "react";
import "./projects.css";
import { motion } from "framer-motion";

import smlePreview from "./projectsImgs/pro2.png";
import hirfaPreview from "./projectsImgs/mockuper.png";
import erthPreview from "./projectsImgs/wsm.png";
import lawPreview from "./projectsImgs/law.png";

const PROJECTS = [
  {
    category: "منصة تعليمية",
    title: "منصة بنك أسئلة SMLE",
    description:
      "حل متكامل لإدارة المحتوى التعليمي  لاختبار الترخيص المهني السعودي مع مكتبة تضم أكثر من 8000 سؤال، تحليلات أداء لحظية، ولوحات متابعة للمدربين.",
    impact: "أكثر من 8000 سؤال تفاعلي رفع معدل الإتقان 2.3× خلال أول ثلاثة أشهر من الإطلاق.",
    stats: [
      { value: "8000+", label: "عنصر تعلّمي" },
      { value: "94%", label: "رضا المستخدمين" }
    ],
    technologies: ["React", "Postgres", "Chart.js"],
    href: "https://www.smle-question-bank.com",
    image: smlePreview,
    imageAlt: "واجهة منصة بنك أسئلة SMLE",
    previewLabel: "SMLE Platform"
  },
  {
    category: "نظام مؤسسي",
    title: "نظام إدارة الموارد البشرية",
    description:
      "نظام HR متكامل لشركة رعاية صحية بأكثر من 600 موظف يشمل إدارة بيانات الموظفين، الرواتب، الحضور، النقل والحافلات، مع تقارير وإحصائيات ومراقبة مستمرة للبيانات.",
    impact: "توحيد بيانات 25+ فرع في نظام واحد وإلغاء التقارير اليدوية بالكامل.",
    stats: [
      { value: "25+", label: "فرع موحّد" },
      { value: "50+", label: "صفحة تفاعلية" }
    ],
    technologies: ["React", "Node.js", "Express.js", "PostgreSQL"],
    href: "",
    image: "/hr/Screenshot 2026-02-07 163928.jpg",
    imageAlt: "واجهة نظام إدارة الموارد البشرية",
    previewLabel: "HR Management System"
  },
  {
    category: "سوق خدمات",
    title: "منصة حِرفة للخدمات",
    description:
      "منصة تربط أصحاب المنازل مباشرة بالعمالة المتخصصة من دون حسابات مع واجهة مبسطة للعثور على أقرب فني خلال أقل من دقيقة.",
    impact: "رحلة حجز جديدة قللت وقت العثور على فني من 20 دقيقة إلى أقل من 3 دقائق.",
    stats: [
      { value: "3 دقائق", label: "متوسط الحجز" },
      { value: "65%", label: "زيادة التحويل" }
    ],
    technologies: ["React", "Postgres", "Supabase"],
    href: "https://hirfa-react.vercel.app",
    image: hirfaPreview,
    imageAlt: "واجهة منصة حِرفة للخدمات",
    previewLabel: "Hirfa Services"
  },
  {
    category: "استشارات أعمال",
    title: "منصة الأثر البيئي",
    description:
      "واجهة ثنائية اللغة مع تكاملات تلقائية مع خرائط Google وExpress.js لدعم طلبات الاستشارات البيئية ومتابعتها.",
    impact: "أتمتة جمع التقييمات رفعت معدل الطلبات المتكررة 1.8× وخفضت وقت الردود بنسبة 40%.",
    stats: [
      { value: "1.8×", label: "طلبات متكررة" },
      { value: "40%", label: "تسريع الاستجابة" }
    ],
    technologies: ["React", "Express.js", "Apify"],
    href: "https://erthfc.com/",
    image: erthPreview,
    imageAlt: "واجهة منصة الأثر البيئي",
    previewLabel: "Erth Environmental"
  },
  {
    category: "موقع قانوني",
    title: "موقع مكتب المحامي صالح الحيسوني",
    description:
      "موقع احترافي لمكتب محاماة يضم واجهة تفاعلية مع نموذج 3D، نظام تواصل متكامل، وتحسين شامل لمحركات البحث مع دعم كامل للعربية.",
    impact: "موقع متكامل بتقنيات حديثة رفع الظهور في محركات البحث وعزز ثقة العملاء المحتملين.",
    stats: [
      { value: "3D", label: "رسوميات تفاعلية" },
      { value: "SEO", label: "تحسين محركات البحث" }
    ],
    technologies: ["React 19", "Three.js", "Node.js", "Express.js", "Vite"],
    href: "https://www.alhisony.com/",
    image: lawPreview,
    imageAlt: "واجهة موقع مكتب المحامي صالح الحيسوني",
    previewLabel: "Alhisony Law"
  }
];

const CARD_ANIMATION = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 }
};

function Projects() {
  return (
    <motion.section
      className="projects-section"
      id="projects"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="projects-header"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        viewport={{ once: true }}
      >
        <span className="projects-eyebrow">أعمال مختارة</span>
        <h2>مشاريع تبني نمواً قابلاً للقياس</h2>
        <p className="projects-lead">
          كل مشروع نطلقه يبدأ بأهداف تجارية واضحة وينتهي بنتائج ملموسة. إليك عينة من حلول قمنا
          بتصميمها وتطويرها لرفع العائد على الاستثمار لعملائنا.
        </p>
      </motion.div>

      <div className="projects-showcase">
        {PROJECTS.map((project, index) => (
          <motion.article
            key={project.title}
            className="project-card"
            initial={CARD_ANIMATION.initial}
            whileInView={CARD_ANIMATION.whileInView}
            viewport={CARD_ANIMATION.viewport}
            transition={{ duration: 0.7, delay: 0.2 + index * 0.12 }}
            whileHover={{ y: -6 }}
          >
            <motion.figure
              className="project-hero"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="project-hero-frame">
                <img src={project.image} alt={project.imageAlt} loading="lazy" />
              </div>
              <figcaption>{project.previewLabel}</figcaption>
            </motion.figure>

            <div className="project-card-body">
              <span className="project-category">{project.category}</span>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <p className="project-impact">{project.impact}</p>
            </div>

            <div className="project-stats">
              {project.stats.map((stat) => (
                <div className="project-stat" key={stat.label}>
                  <span className="project-stat-value">{stat.value}</span>
                  <span className="project-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="project-card-footer">
              <div className="project-tags">
                {project.technologies.map((tech) => (
                  <span className="project-tag" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
              {project.href ? (
              <a
                className="project-link"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>اطّلع الآن</span>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  focusable="false"
                >
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
              ) : (
                <span className="project-link private-label">نظام خاص</span>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

export default Projects;
