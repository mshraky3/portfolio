import React from "react";
import "./projects.css";
import Button from '@mui/material/Button';
import { motion } from "framer-motion";

const PROJECTS = [
  {
    wrapperClass: "project",
    initialX: -100,
    delay: 0.4,
    title: "Project 1",
    description:
      "SQB is a digital learning platform that directly connects medical candidates preparing for the Saudi Medical Licensing Examination (SMLE) and Prometric exams with a vast question bank — featuring over 5,000 meticulously curated multiple-choice questions and detailed performance analytics.",
    href: "https://www.smle-question-bank.com",
    technologies: ["React", "Postgres"]
  },
  {
    wrapperClass: "project two",
    initialX: 100,
    delay: 0.6,
    title: "Project 2",
    description:
      "Herfa is a quick and simple platform that connects you with skilled workers whenever and wherever you need them, without registration or an account. Whether you need a plumber, electrician, cleaner, or any other service provider, Herfa helps you find the right worker near you with just a few clicks.",
    href: "https://hirfa-react.vercel.app",
    technologies: ["React", "Postgres"]
  },
  {
    wrapperClass: "project three",
    initialX: -100,
    delay: 0.8,
    title: "Earth Footprint",
    description:
      "Earth Footprint is a comprehensive environmental consulting platform that directly connects clients with specialized services through a modern React/Vite frontend with bilingual support and Framer Motion animations. The Express.js backend features intelligent email management with Nodemailer, automated Google Maps review scraping via Apify integration with 24-hour caching and rate limiting, and optimized performance through advanced compression, minification, and code splitting. The platform serves as a complete digital ecosystem for environmental consulting services across Saudi Arabia, combining automated data management, intelligent communication systems, and modern web technologies for seamless client experiences.",
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
        <h1>Some of Our Projects</h1>
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
                <Button>View</Button>
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
