import React, { useEffect } from "react";
import "./About.css";
import img from "./me.png";
import { motion } from "framer-motion";

function About({ language }) {

    const translations = {
        en: {
            aboutTitle: "About - Mahmoud Alshraky",
            headline: "Get a website that will make a lasting impression on your audience!!",
            bio: "My name is Mahmoud Alshraky, and I am a web developer specializing in designing and building web applications. I have hands-on experience with modern technologies such as React, Express, and PostgreSQL, which allows me to create dynamic, efficient, and scalable solutions tailored to meet your needs."
        },
        ar: {
            aboutTitle: "محمود الشراكي - عني",
            headline: "احصل على موقع ويب سيترك انطباعًا دائمًا لدى جمهورك!!",
            bio: `
            أنا محمود الشراكي, مطور ويب متخصص في تصميم وبناء التطبيقات الويب. لدي خبرة عملية في التقنيات الحديثة  
             مما يمكنني من إنشاء حلول ديناميكية وفعالة وقابلة للتطوير مصممة خصيصًا لتلبية احتياجاتك.`
        }
    };

    const isArabic = language === 'ar';
    const currentTranslation = translations[language] || translations.en;

    return (
        <motion.div 
            className={`aboutSection ${isArabic ? 'arabic' : ''}`} 
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
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <img src={img} alt={isArabic ? "صورة الملف الشخصي لمحمود الشراكي" : "Mahmoud Alshraky profile picture"} loading="lazy" />
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
                    <h4>{currentTranslation.aboutTitle}</h4>
                </motion.div>
                <motion.div 
                    className="aboutTextBody"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                >
                    <p>{currentTranslation.headline}</p>
                </motion.div>
                <motion.div 
                    className="aboutTextDeilt"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    viewport={{ once: true }}
                >
                    <p>{currentTranslation.bio}</p>
                </motion.div>
                <motion.div 
                    className="aboutTexticons"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    viewport={{ once: true }}
                >
                    <motion.a 
                        href="https://www.instagram.com/m_alshraky/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <img width="40" height="40" src="https://img.icons8.com/material-two-tone/100/instagram-new.png" alt="Instagram logo" loading="lazy" />
                    </motion.a>
                    <motion.a 
                        href="https://github.com/mshraky3" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <img width="40" height="40" src="https://img.icons8.com/fluency/40/github.png" alt="GitHub logo" loading="lazy" />
                    </motion.a>
                    <motion.a 
                        href="https://wa.link/5zcep6" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <img width="40" height="40" src="https://img.icons8.com/ios-glyphs/40/whatsapp.png" alt="WhatsApp logo" loading="lazy" />
                    </motion.a>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default About;