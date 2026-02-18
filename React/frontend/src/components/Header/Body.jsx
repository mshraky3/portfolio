import React from "react";
import "./HeaderStyle/Body.css";
import Button from '@mui/material/Button';
import Stats from "./Stats";
import { motion } from "framer-motion";
import ProfileModel from "./ProfileModel";

const CTA_LABEL = "تواصل الآن";

function Body() {
  return (
    <motion.div
      className="contener"
      id="HOME"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="black">
        <div className="black-content">
          <motion.div
            className="hero-intro"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="hero-name">محمود الشراكي</h1>
            <p className="hero-role">Software Engineer</p>
            <p className="hero-subtitle">أحوّل أفكارك إلى مواقع وأنظمة تعمل بكفاءة وتجذب عملاءك</p>
          </motion.div>
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

                <img
                  src="https://img.icons8.com/?size=50&id=biaPj0fC1TKb&format=png&color=ffffff"
                  alt="أيقونة سهم"
                  loading="lazy"
                  style={{ marginRight: 10, transform: 'scaleX(-1)' }}
                />

                {CTA_LABEL}
              </Button>
            </a>
          </motion.div>
          <Stats />
        </div>
      </div>
      <motion.div
        className="image"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <div className="profile-img">
          <ProfileModel />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Body;