import React from "react";
import "./projects.css";
import Button from '@mui/material/Button';

const translations = {
  en: {
    title: "Some of My Projects",
    project1Title: "Project 1",
    project1Text: "Harfa is a quick and simple platform that connects you with skilled workers whenever and wherever you need them, without registration or an account. Whether you need a plumber, electrician, cleaner, or any other service provider, Harfa helps you find the right worker near you with just a few clicks.",
    project2Title: "Project 2",
    project2Text: "Dash is a digital platform that connects real estate project owners directly with engineering offices and contractors through displaying publications and instant chat.",
    project3Title: "Project 3",
    project3Text: "wsm is a digital marketing platform specialized in analyzing user data to provide the best marketing strategies suitable for them.",
    view: "View",
    react: "React",
    postgres: "Postgres",
  },
  ar: {
    title: "بعض المشاريع",
    project1Title: "مشروع 1",
    project1Text: "تطبيق ملاحظات منظم للملاحظات مع مساحة تخزين، مصمم للبساطة والكفاءة.",
    project2Title: "مشروع 2",
    project2Text: " 'داش'  هي منصة رقمية تربط اصحاب المشاريع العقارية مباشرة معا المكاتب الهندسية و المقاولين من خلال عرض المنشورات و الدردشة الفورية",
    project3Title: "مشروع 3",
    project3Text: " وسم هي منصة تسويق رقمي متخصصة في تحليل بيانات المستخدمين لاعطاء افضل استراتيجيات التسويق المناسبه لهم",
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
              <a href="https://hirfa-react.vercel.app">
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