import React from "react"; 
import "./HeaderStyle/Body.css";
import Button from '@mui/material/Button';
import IAM from "./iam";
import Stats from "./Stats";
import { motion } from "framer-motion";
import ProfileModel from "./ProfileModel";

const CTA_LABEL = "تواصل معنا";
const SPECIALTIES_LABEL = "مجالات التخصص";

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
            className="name"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* brand logo removed from hero per request */}
          </motion.div>
          <IAM />
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
            <p>{SPECIALTIES_LABEL}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Body;