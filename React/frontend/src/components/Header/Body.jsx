import React, { useEffect, useState } from "react"; 
import "./HeaderStyle/Body.css";
import Button from '@mui/material/Button';
import logo from "./images/test-me.png";
import IAM from "./iam";
import Stats from "./Stats";

function Body({ language, setLanguage }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the main profile image
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = logo;
  }, []);

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
                  src="https://img.icons8.com/?size=50&id=biaPj0fC1TKb&format=png&color=ffffff"
                  alt="arrow icon"
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
        {!imageLoaded && (
          <div className="image-placeholder" style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}>
            Loading...
          </div>
        )}
        <img 
          src={logo} 
          className="profile-img" 
          alt="Mahmoud Alshraky profile picture" 
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{ 
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="purple">
        <div className="icons">
          <div className="icon r">
            <img 
              src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png" 
              alt="React logo" 
              width="48"
              height="48"
              loading="lazy"
            />
          </div>
          <div className="icon">
            <img 
              src="https://img.icons8.com/color-glass/48/bootstrap.png" 
              alt="Bootstrap logo" 
              width="48"
              height="48"
              loading="lazy" 
            />
          </div>
          <div className="icon">
            <img 
              src="https://img.icons8.com/fluency/48/node-js.png" 
              alt="Node.js logo" 
              width="48"
              height="48"
              loading="lazy" 
            />
          </div>
          <div className="icon">
            <img 
              src="https://img.icons8.com/color/48/postgreesql.png" 
              alt="PostgreSQL logo" 
              width="48"
              height="48"
              loading="lazy"
            />
          </div>
          <div className="icon a">
            <img 
              height="50" 
              width="50"
              src="https://img.icons8.com/pastel-glyph/50/FFFFFF/down.png" 
              alt="Down arrow icon" 
              loading="lazy" 
            />
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