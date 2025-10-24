import React, { useEffect, useState } from "react"; 
import "./HeaderStyle/Body.css";
import Button from '@mui/material/Button';
import logo from "./images/test-me.png";
import IAM from "./iam";
import Stats from "./Stats";
import { motion } from "framer-motion";

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
    <motion.div 
      className={`contener ${isArabic ? 'arabic' : ''}`} 
      id="HOME"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="black">
        <div className="black-content">
          <motion.div 
            className="name"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1>{currentTranslation.title}</h1>
          </motion.div>
          <IAM isArabic={isArabic} />
          <motion.div 
            className="btn"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
          </motion.div>
          <Stats isArabic={isArabic} />
        </div>
      </div>
      <motion.div 
        className="image"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
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
        <motion.img 
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
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.div>
      <motion.div 
        className="purple"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="icons">
          <motion.div 
            className="icon r"
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png" 
              alt="React logo" 
              width="48"
              height="48"
              loading="lazy"
            />
          </motion.div>
          <motion.div 
            className="icon"
            whileHover={{ scale: 1.2, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src="https://img.icons8.com/color-glass/48/bootstrap.png" 
              alt="Bootstrap logo" 
              width="48"
              height="48"
              loading="lazy" 
            />
          </motion.div>
          <motion.div 
            className="icon"
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src="https://img.icons8.com/fluency/48/node-js.png" 
              alt="Node.js logo" 
              width="48"
              height="48"
              loading="lazy" 
            />
          </motion.div>
          <motion.div 
            className="icon"
            whileHover={{ scale: 1.2, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src="https://img.icons8.com/color/48/postgreesql.png" 
              alt="PostgreSQL logo" 
              width="48"
              height="48"
              loading="lazy"
            />
          </motion.div>
          <motion.div 
            className="icon a"
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <img 
              height="50" 
              width="50"
              src="https://img.icons8.com/pastel-glyph/50/FFFFFF/down.png" 
              alt="Down arrow icon" 
              loading="lazy" 
            />
          </motion.div>
          <motion.div 
            className="icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p>{currentTranslation.specialties}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Body;