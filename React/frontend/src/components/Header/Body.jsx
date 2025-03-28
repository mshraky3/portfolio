import React, { useEffect } from "react";
import "./HeaderStyle/Body.css";
import Button from '@mui/material/Button';
import logo from "./images/test-me.png";
import IAM from "./iam";
import Stats from "./Stats";

function Body({ language, setLanguage }) {



  const translations = {
    en: {
      title: "I'm Mahmoud.",
      buttonText: "GET IN TOUCH",
      specialties: "Specialties"
    },
    ar: {
      title: "أنا محمود.",
      buttonText: "تواصل معي",
      specialties: "تخصصاتي"
    },
    default: {
      title: "I'm Mahmoud.",
      buttonText: "GET IN TOUCH",
      specialties: "Specialties"
    }
  };

  const isArabic = language === 'ar';
  const currentTranslation = translations[language] || translations.default;

  return (
    <div className={`contener ${isArabic ? 'arabic' : ''}`} id="HOME">
      <div className="black">
        <div className="black-content">
          <div className="name">
            <h1>{currentTranslation.title}</h1>
          </div>
          <IAM isArabic={isArabic} />
          <div className="btn">
            <a href="https://wa.link/5zcep6">
              <Button>
                {currentTranslation.buttonText}
                <img
                  src="https://img.icons8.com/?size=100&id=biaPj0fC1TKb&format=png&color=ffffff"
                  loading="lazy"
                  style={{ marginLeft: isArabic ? '0' : '10px', marginRight: isArabic ? '10px' : '0' }}
                />
              </Button>
            </a>
          </div>
          <Stats isArabic={isArabic} />
        </div>
      </div>
      <div className="image">
        <img src={logo} className="profile-img" alt="Profile" loading="lazy" />
      </div>
      <div className="purple">
        <div className="icons">
          <div className="icon r">
            <img src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png" alt="React" />
          </div>
          <div className="icon">
            <img src="https://img.icons8.com/color-glass/96/bootstrap.png" alt="Bootstrap" loading="lazy" />
          </div>
          <div className="icon">
            <img src="https://img.icons8.com/fluency/96/node-js.png" alt="Node.js" loading="lazy" />
          </div>
          <div className="icon">
            <img src="https://img.icons8.com/color/96/postgreesql.png" alt="PostgreSQL" loading="lazy"/>
          </div>
          <div className="icon a">
            <img height="100" src="https://img.icons8.com/pastel-glyph/100/FFFFFF/down.png" alt="Down Arrow" loading="lazy" />
          </div>
          <div className="icon">
            <p>{currentTranslation.specialties}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;