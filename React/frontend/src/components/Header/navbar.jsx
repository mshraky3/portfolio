import React, { useState, useEffect } from "react";
import "./HeaderStyle/navbar.css";
import { motion } from "framer-motion";

function Navbar({ setLanguage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(false);

  const translations = {
    en: {
      home: "HOME",
      services: "SERVICES",
      projects: "PROJECTS",
      about: "ABOUT ME",
      contact: "CONTACT",
      letsTalk: "Let's Talk",
      switchLang: "العربية"
    },
    ar: {
      home: "الرئيسية",
      services: "الخدمات",
      projects: "المشاريع",
      about: "عني",
      contact: "اتصل",
      letsTalk: "لنتحدث",
      switchLang: "English"
    }
  };

  useEffect(() => {
    const detectedLanguage = navigator.language || navigator.userLanguage;
    if (detectedLanguage.startsWith('ar')) {
      setIsArabic(true);
    }

    // Scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchLanguage = () => {
    setIsArabic(!isArabic);
    setLanguage(isArabic ? 'en' : 'ar'); // Call the setLanguage function
  };

  // Get the current translation based on language
  const t = (key) => translations[isArabic ? 'ar' : 'en'][key];

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${isArabic ? 'arabic' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Logo - remains the same as it's a name */}
      <motion.div 
        className="logo" 
        id="logo"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        alshraky<span>.</span>
      </motion.div>

      {/* Hamburger Menu Button */}
      <motion.div 
        className="menu-icon" 
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/ios-filled/24/C850F2/menu--v1.png"
          alt={isArabic ? "قائمة" : "menu"}
          loading="lazy"
        />
      </motion.div>

      {/* Dropdown Menu */}
      <motion.div 
        className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0, 
          y: isMenuOpen ? 0 : -20 
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.a 
          href="#HOME"
          whileHover={{ x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {t('home')}
        </motion.a>
        <motion.a 
          href="#SERVICES"
          whileHover={{ x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {t('services')}
        </motion.a>
        <motion.a 
          href="#projects"
          whileHover={{ x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {t('projects')}
        </motion.a>
        <motion.a 
          href="#aboutSection"
          whileHover={{ x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {t('about')}
        </motion.a>
        <motion.a 
          href="#ContactMe"
          whileHover={{ x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {t('contact')}
        </motion.a>
        <motion.a 
          onClick={switchLanguage}
          whileHover={{ x: 10 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {t('switchLang')}
        </motion.a>
      </motion.div>

      {/* Middle Text */}
      <div className="middle-text">
        <motion.span
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <a href="#HOME">{t('home')}</a>
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <a href="#SERVICES">{t('services')}</a>
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <a href="#projects">{t('projects')}</a>
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <a href="#aboutSection">{t('about')}</a>
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <a href="#ContactMe">{t('contact')}</a>
        </motion.span>
        <motion.span 
          className="language-switcher"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <a onClick={switchLanguage}>{t('switchLang')}</a>
        </motion.span>
      </div>

      {/* Button */}
      <motion.div 
        className="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <a href="https://wa.link/5zcep6">
          <button className={isScrolled ? 'scrolled-button' : ''}>
            {t('letsTalk')}
          </button>
        </a>
      </motion.div>
    </motion.nav>
  );
}

export default Navbar;