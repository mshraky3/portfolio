import React from "react";
import "./HeaderStyle/Body.css";
import { motion } from "framer-motion";

function Body() {
  return (
    <section className="hero" id="HOME">
      <div className="hero-noise" />
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />

      <div className="hero-content">
        <motion.div
          className="hero-available"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="pulse-dot" />
          <span>متاح للعمل </span>
        </motion.div>

        <motion.h1
          className="hero-name"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          محمود الشراكي
        </motion.h1>

        <motion.p
          className="hero-role"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          Full-Stack Engineer
        </motion.p>

        <motion.p
          className="hero-tagline"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          أبني أنظمة ويب قوية — من الفكرة حتى الإطلاق
        </motion.p>

        <motion.div
          className="hero-stats"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85 }}
        >
          <div className="hero-stat">
            <span className="stat-num">25+</span>
            <span className="stat-label">مشروع</span>
          </div>
          <span className="stat-sep" />
          <div className="hero-stat">
            <span className="stat-num">5+</span>
            <span className="stat-label">عملاء</span>
          </div>
          <span className="stat-sep" />
          <div className="hero-stat">
            <span className="stat-num">2+</span>
            <span className="stat-label">سنة خبرة</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-cta"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <a href="#projects" className="btn-gallery">
            استكشف أعمالي
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>
          <a href="https://wa.link/5zcep6" className="btn-contact" target="_blank" rel="noreferrer">
            تواصل معي
          </a>
        </motion.div>
      </div>

      <motion.div
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="scroll-track">
          <div className="scroll-thumb" />
        </div>
      </motion.div>
    </section>
  );
}

export default Body;