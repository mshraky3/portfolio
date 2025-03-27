import React, { useState, useEffect } from "react";
import "./HeaderStyle/stats.css";

function Stats() {
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    // Detect browser language on component mount
    const userLanguage = navigator.language || navigator.userLanguage;
    setIsArabic(userLanguage.startsWith('ar'));
  }, []);

  // Translations
  const translations = {
    en: {
      projects: "projects",
      jobs: "jobs",
      years: "years"
    },
    ar: {
      projects: "مشاريع",
      jobs: "وظائف",
      years: "سنوات خبرة"
    }
  };

  return (
    <div className={`stats ${isArabic ? 'rtl' : ''}`}>
      <div className="info">
        20+
        <span>{isArabic ? translations.ar.projects : translations.en.projects}</span>
      </div>
      <div className="info">
        3+
        <span>{isArabic ? translations.ar.jobs : translations.en.jobs}</span>
      </div>
      <div className="info">
        2+
        <span>{isArabic ? translations.ar.years : translations.en.years}</span>
      </div>
    </div>
  );
}

export default Stats;