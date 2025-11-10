import React from "react";
import img from "./me.png";
import "./About.css";
import { motion } from "framer-motion";

const ABOUT_TITLE = "من نحن";
const ABOUT_BODY = "نصنع تجارب ويب عالية الأداء.";
const ABOUT_DETAIL = "نرافق مشاريعك من الفكرة حتى الإطلاق، مع تجربة مستخدم مدروسة وبنية React وExpress وPostgreSQL موثوقة وسهلة التوسع والتحسين.";
const SOCIAL_LINKS = [
  {
    href: "https://github.com/mshraky3",
    img: "https://img.icons8.com/fluency/40/github.png",
    alt: "شعار GitHub"
  },
  {
    href: "https://wa.link/5zcep6",
    img: "https://img.icons8.com/ios-glyphs/40/whatsapp.png",
    alt: "شعار واتساب"
  }
];

function About() {
    return (
        <motion.div 
            className="aboutSection" 
            id="aboutSection"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <motion.div 
                className="aboutImageSection"
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
            >
                <motion.div 
                    className="aboutCurcle"
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 10 }}
                >
                    <img src={img} alt="صورة محمود الشراكي" loading="lazy" />
                </motion.div>
            </motion.div>
            <motion.div 
                className="aboutText"
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
            >
                <motion.div 
                    className="aboutTextTitle"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                >
                    {ABOUT_TITLE}
                </motion.div>
                <motion.div 
                    className="aboutTextBody"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                >
                    {ABOUT_BODY}
                </motion.div>
                <motion.div 
                    className="aboutTextDeilt"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    viewport={{ once: true }}
                >
                    {ABOUT_DETAIL}
                </motion.div>
                <motion.div 
                    className="aboutTexticons"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    viewport={{ once: true }}
                >
                    {SOCIAL_LINKS.map(({ href, img: src, alt }) => (
                      <a key={href} href={href} target="_blank" rel="noreferrer">
                        <img width="40" height="40" src={src} alt={alt} loading="lazy" />
                      </a>
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default About;