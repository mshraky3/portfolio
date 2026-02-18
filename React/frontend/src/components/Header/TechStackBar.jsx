import React from "react";
import "./HeaderStyle/TechStackBar.css";

// Example tech stack icons (replace with your actual stack)
const techs = [
    { src: "https://img.icons8.com/color/48/000000/javascript.png", alt: "JavaScript" },
    { src: "https://img.icons8.com/color/48/000000/react-native.png", alt: "React" },
    { src: "https://img.icons8.com/color/48/000000/nodejs.png", alt: "Node.js" },
    { src: "https://img.icons8.com/color/48/000000/css3.png", alt: "CSS3" },
    { src: "https://img.icons8.com/color/48/000000/html-5.png", alt: "HTML5" },
    { src: "https://img.icons8.com/color/48/000000/mongodb.png", alt: "MongoDB" },
    { src: "https://img.icons8.com/color/48/postgreesql.png", alt: "PostgreSQL" },
];

export default function TechStackBar() {
    return (
        <div className="tech-stack-bar">
            <div className="tech-stack-icons">
                {techs.map((t, i) => (
                    <img key={i} src={t.src} alt={t.alt} title={t.alt} className="tech-icon" loading="lazy" />
                ))}
            </div>
            <div className="tech-stack-values">
                <span>أستخدم أحدث التقنيات لبناء حلول فعالة وسريعة</span>
            </div>
        </div>
    );
}