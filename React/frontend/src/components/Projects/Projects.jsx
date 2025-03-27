import React from "react";
import "./projects.css";
import Button from '@mui/material/Button';

const translations = {
  en: {
    title: "Some of My Projects",
    project1Title: "Project 1",
    project1Text: "Keeper-App is a React front-end note organizer with Express API and PostgreSQL storage, designed for simplicity and efficiency.",
    project2Title: "Project 2",
    project2Text: "Dash is a digital platform that connects real estate project owners directly with engineering offices and contractors through displaying publications and instant chat.",
    project3Title: "Project 3",
    project3Text: "wsm is a digital marketing platform specialized in analyzing user data to provide the best marketing strategies suitable for them.",
    view: "View",
    react: "React",
    postgres: "Postgres",
  },
  ar: {
    title: "بعض مشاريعي",
    project1Title: "مشروع 1",
    project1Text: " Keeper-App هو تطبيق ملاحظات بواجهة مستخدم React مع API Express وتخزين PostgreSQL، مصمم للبساطة والكفاءة.",
    project2Title: "مشروع 2",
    project2Text: "داش هيا منصة رقمية تربط اصحاب المشاريع العقارية مباشرة معا المكتاب الهندسية و المقاولين من خلال عرض المنشورات و الدردشة الفورية",
    project3Title: "مشروع 3",
    project3Text: " وسم هيا منصة تسويق رقمي متخخصه في تحليل بيانات المستخدمين لاعطاء افضل استراتيجات التسويق المناسبه لهم",
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
              <a href="https://keeper-front-end-theta.vercel.app/">
                <Button>{t('view')}</Button>
              </a>
            </div>
          </div>
          <div className="projectType">
            <Button>React</Button>
            <Button>postgres</Button>
          </div>
        </div>
        <div className="project two">
          <div className="projectCard">
            <h1 className="projectCardTitle">{t('project2Title')}</h1>
            <div className="projectCardText">{t('project2Text')}</div>
            <div className="projectCardButton">
            <a href="https://github.com/mshraky3/ShureArchitects">
                <Button>{t('view')}</Button>
              </a>
            </div>
          </div>
          <div className="projectType ">
            <Button>Express</Button>
            <Button>postgres</Button>
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
            <Button>postgres</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;