import React from "react";
import "./projects.css";
import Button from '@mui/material/Button';
import { motion } from "framer-motion";

const translations = {
  en: {
    title: "Some of My Projects",
    project1Title: "Project 1",
    project1Text: "SQB is a digital learning platform that directly connects medical candidates preparing for the Saudi Medical Licensing Examination (SMLE) and Prometric exams with a vast question bank — featuring over 5,000 meticulously curated multiple-choice questions and detailed performance analytics.",
    project2Title: "Project 2",
    project2Text: "Herfa is a quick and simple platform that connects you with skilled workers whenever and wherever you need them, without registration or an account. Whether you need a plumber, electrician, cleaner, or any other service provider, Herfa helps you find the right worker near you with just a few clicks.",
    project3Title: "Earth Footprint",
    project3Text: "Earth Footprint is a comprehensive environmental consulting platform that directly connects clients with specialized services through a modern React /Vite frontend with bilingual support and Framer Motion animations. The Express.js backend features intelligent email management with Nodemailer, automated Google Maps review scraping via Apify integration with 24-hour caching and rate limiting, and optimized performance through advanced compression, minification, and code splitting. The platform serves as a complete digital ecosystem for environmental consulting services across Saudi Arabia, combining automated data management, intelligent communication systems, and modern web technologies for seamless client experiences.",
    view: "View",
    react: "React",
    postgres: "Postgres",
  },
  ar: {
    title: "بعض المشاريع",
    project1Title: "مشروع 1",
    project1Text: "منصة SQB التعليمية هي منصة رقمية تربط مباشرة المتقدمين لامتحان الترخيص الطبي السعودي (SMLE) وامتحانات برومترك مع بنك أسئلة ضخم يضم أكثر من 5000 سؤال اختيار من متعدد تم إعدادها بعناية، مع تحليلات أداء مفصلة.",
    project2Title: "مشروع 2",
    project2Text: "حِرفة هي منصة سريعة وبسيطة تربطك بالعمال المهرة وقتما وأينما احتجت إليهم، بدون تسجيل أو حساب. سواء كنت بحاجة إلى سباك أو كهربائي أو عامل نظافة أو أي مزود خدمة آخر، تساعدك حِرفة على العثور على العامل المناسب بالقرب منك ببضع نقرات فقط.",
    project3Title: "بصمة الأرض",
    project3Text: "بصمة الأرض هي منصة استشارية بيئية شاملة تربط العملاء مباشرة بالخدمات المتخصصة من خلال واجهة أمامية حديثة باستخدام React 19/Vite مع دعم ثنائي اللغة ورسوم متحركة Framer Motion. يحتوي الخادم الخلفي Express.js على إدارة ذكية للبريد الإلكتروني باستخدام Nodemailer، واستخراج تلقائي لمراجعات خرائط جوجل عبر تكامل Apify مع تخزين مؤقت لمدة 24 ساعة وتحديد معدل، وأداء محسن من خلال الضغط المتقدم والتقليل وتقسيم الكود. تعمل المنصة كنظام بيئي رقمي كامل لخدمات الاستشارات البيئية عبر المملكة العربية السعودية، تجمع بين إدارة البيانات الآلية وأنظمة التواصل الذكية وتقنيات الويب الحديثة لتجارب عملاء سلسة.",
    view: "عرض",
    react: "React",
    postgres: "Postgres",
  },
};

function Projects({ language }) {
  const t = (key) => translations[language][key];

  return (
    <>
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
          <h1>{t('title')}</h1>
        </motion.div>
        <motion.div 
          className="project"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="projectCard">
            <h1 className="projectCardTitle">{t('project1Title')}</h1>
            <div className="projectCardText">{t('project1Text')}</div>
            <div className="projectCardButton">
              <a href="https://www.smle-question-bank.com">
                <Button>{t('view')}</Button>
              </a>
            </div>
          </div>
          <div className="projectType">
            <Button>React</Button>
            <Button>Postgres</Button>
          </div>
        </motion.div>
        <motion.div 
          className="project two"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="projectCard">
            <h1 className="projectCardTitle">{t('project2Title')}</h1>
            <div className="projectCardText">{t('project2Text')}</div>
            <div className="projectCardButton">
              <a href="https://hirfa-react.vercel.app">
                <Button>{t('view')}</Button>
              </a>
            </div>
          </div>
          <div className="projectType ">
            <Button>React</Button>
            <Button>Postgres</Button>
          </div>
        </motion.div>
        <motion.div 
          className="project three"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="projectCard">
            <h1 className="projectCardTitle">{t('project3Title')}</h1>
            <div className="projectCardText">{t('project3Text')}</div>
            <div className="projectCardButton">
              <a href="https://erthfc.com/">
                <Button>{t('view')}</Button>
              </a>
            </div>
          </div>
          <div className="projectType">
            <Button>React </Button>
            <Button>Express.js</Button>
            <Button>Apify</Button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Projects;
