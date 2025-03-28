import React, { useEffect } from "react";
import "./About.css";
import img from "./me.png";

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
        <div className={`aboutSection ${isArabic ? 'arabic' : ''}`} id="aboutSection">
            <div className="aboutImageSection">
                <div className="aboutCurcle">
                    <img src={img} alt={isArabic ? "صورة الملف الشخصي" : "Profile"} loading="lazy" />
                </div>
            </div>
            <div className="aboutText">
                <div className="aboutTextTitle"><h4>{currentTranslation.aboutTitle}</h4></div>
                <div className="aboutTextBody"><p>{currentTranslation.headline}</p></div>
                <div className="aboutTextDeilt"><p>{currentTranslation.bio}</p></div>
                <div className="aboutTexticons">
                    <a href="https://www.instagram.com/m_alshraky/" target="_blank" rel="noopener noreferrer">
                        <img width="40" height="40" src="https://img.icons8.com/material-two-tone/100/instagram-new.png" alt={isArabic ? "انستجرام" : "instagram"} loading="lazy" />
                    </a>
                    <a href="https://github.com/mshraky3" target="_blank" rel="noopener noreferrer">
                        <img width="40" height="40" src="https://img.icons8.com/fluency/40/github.png" alt={isArabic ? "جيت هاب" : "github"} loading="lazy" />
                    </a>
                    <a href="https://wa.link/5zcep6" target="_blank" rel="noopener noreferrer">
                        <img width="40" height="40" src="https://img.icons8.com/ios-glyphs/40/whatsapp.png" alt={isArabic ? "واتساب" : "whatsapp"} loading="lazy" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default About;