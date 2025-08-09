import React from "react";
import "./projects.css";
import Button from '@mui/material/Button';

const translations = {
  en: {
    title: "Some of My Projects",
    project1Title: "Project 1",
    project1Text: "SQB is a digital learning platform that directly connects medical candidates preparing for the Saudi Medical Licensing Examination (SMLE) and Prometric exams with a vast question bank — featuring over 5,000 meticulously curated multiple-choice questions and detailed performance analytics.",
    project2Title: "Project 2",
    project2Text: "Herfa is a quick and simple platform that connects you with skilled workers whenever and wherever you need them, without registration or an account. Whether you need a plumber, electrician, cleaner, or any other service provider, Herfa helps you find the right worker near you with just a few clicks.",
    project3Title: "Project 3",
    project3Text: "wsm is a digital marketing platform specialized in analyzing user data to provide the best marketing strategies suitable for them.",
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
    project3Title: "مشروع 3",
    project3Text: "وسم هي منصة تسويق رقمي متخصصة في تحليل بيانات المستخدمين لإعطاء أفضل استراتيجيات التسويق المناسبة لهم.",
    view: "عرض",
    react: "React",
    postgres: "Postgres",
  },
};

function Projects({ language }) {
  const t = (key) => translations[language][key];

  return (
    <>
      <div className="projects" id="projects">
        <div className="projectsTitle">
          <h1>{t('title')}</h1>
        </div>
        <div className="project">
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
        </div>
        <div className="project two">
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
        </div>
        <div className="project three">
          <div className="projectCard">
            <h1 className="projectCardTitle">{t('project3Title')}</h1>
            <div className="projectCardText">{t('project3Text')}</div>
            <div className="projectCardButton">
              <a href="https://inland-andeee-muhmodalshraky-925f3577.koyeb.app/">
                <Button>{t('view')}</Button>
              </a>
            </div>
          </div>
          <div className="projectType">
            <Button>EJS</Button>
            <Button>Postgres</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
