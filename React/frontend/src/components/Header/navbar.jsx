import React, { useState, useEffect } from "react";
import "./HeaderStyle/navbar.css";

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
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isArabic ? 'arabic' : ''}`}>
      {/* Logo - remains the same as it's a name */}
      <div className="logo" id="logo">
        alshraky<span>.</span>
      </div>

      {/* Hamburger Menu Button */}
      <div className="menu-icon" onClick={toggleMenu}>
        <img
          width="40"
          height="40"
          src="https://img.icons8.com/ios-filled/40/C850F2/menu--v1.png"
          alt={isArabic ? "قائمة" : "menu"}
        />
      </div>

      {/* Dropdown Menu */}
      <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
        <a href="#HOME">{t('home')}</a>
        <a href="#SERVICES">{t('services')}</a>
        <a href="#projects">{t('projects')}</a>
        <a href="#aboutSection">{t('about')}</a>
        <a href="#ContactMe">{t('contact')}</a>
        <a onClick={switchLanguage}>{t('switchLang')}</a> {/* Language switch button in dropdown */}
      </div>

      {/* Middle Text */}
      <div className="middle-text">
        <span><a href="#HOME">{t('home')}</a></span>
        <span><a href="#SERVICES">{t('services')}</a></span>
        <span><a href="#projects">{t('projects')}</a></span>
        <span><a href="#aboutSection">{t('about')}</a></span>
        <span><a href="#ContactMe">{t('contact')}</a></span>
        <span className="language-switcher"><a onClick={switchLanguage}>{t('switchLang')}</a></span>
      </div>

      {/* Button */}
      <div className="button">
        <a href="https://wa.link/5zcep6">
          <button className={isScrolled ? 'scrolled-button' : ''}>
            {t('letsTalk')}
          </button>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;