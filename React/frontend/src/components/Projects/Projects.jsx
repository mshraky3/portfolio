import React from "react";
import "./projects.css";
import Button from '@mui/material/Button';
import { motion } from "framer-motion";

const PROJECTS = [
  {
    wrapperClass: "project",
    initialX: -100,
    delay: 0.4,
    title: "منصة بنك أسئلة SMLE",
    description:
      "منصة SQB التعليمية تربط المرشحين لاختبار الترخيص المهني السعودي وامتحانات برومترك ببنك أسئلة يضم أكثر من 5000 سؤال متعدد الاختيارات مع تحليلات أداء تفصيلية تساعدهم على تتبع التقدم بثقة.",
    href: "https://www.smle-question-bank.com",
    technologies: ["React", "Postgres"]
  },
  {
    wrapperClass: "project two",
    initialX: 100,
    delay: 0.6,
    title: "منصة حِرفة للخدمات",
    description:
      "حِرفة هي منصة سريعة وسهلة تربطك مباشرة بالعمالة الماهرة دون الحاجة لإنشاء حساب. بضغطة واحدة يمكنك العثور على السباك أو الكهربائي أو عامل الصيانة الأقرب إليك في أي وقت.",
    href: "https://hirfa-react.vercel.app",
    technologies: ["React", "Postgres"]
  },
  {
    wrapperClass: "project three",
    initialX: -100,
    delay: 0.8,
    title: "منصة الأثر البيئي",
    description:
      "منصة الأثر البيئي توفر تجربة متكاملة للاستشارات البيئية بواجهة React/Vite ثنائية اللغة ورسوميات متحركة، مع خادم Express.js يدير المراسلات، ويجمع تقييمات خرائط Google تلقائيًا، ويطبق أفضل ممارسات الأداء لتقديم تجربة سلسة للعملاء في جميع أنحاء السعودية.",
    href: "https://erthfc.com/",
    technologies: ["React", "Express.js", "Apify"]
  }
];

function Projects() {
  return (
    <motion.div 
      className="projects" 
      id="projects"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="projectsTitle"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h1>نماذج من مشاريعنا</h1>
      </motion.div>

      {PROJECTS.map(({ wrapperClass, initialX, delay, title, description, href, technologies }) => (
        <motion.div 
          key={title}
          className={wrapperClass}
          initial={{ x: initialX, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="projectCard">
            <h1 className="projectCardTitle">{title}</h1>
            <div className="projectCardText">{description}</div>
            <div className="projectCardButton">
              <a href={href}>
                <Button>عرض المشروع</Button>
              </a>
            </div>
          </div>
          <div className="projectType">
            {technologies.map((tech) => (
              <Button key={tech}>{tech}</Button>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Projects;
