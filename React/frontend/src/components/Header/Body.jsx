import React, { useEffect, useRef, useState } from "react"; 
import "./HeaderStyle/Body.css";
import Button from '@mui/material/Button';
import stage0 from "./images/stage_0.png";
import stage1 from "./images/stage_1.png";
import stage2 from "./images/stage_2.png";
import stage3 from "./images/stage_3.png";
import stage4 from "./images/stage_4.png";
import stage5 from "./images/stage_5.png";
import stage6 from "./images/stage_6.png";
import IAM from "./iam";
import Stats from "./Stats";
import { motion } from "framer-motion";

const CTA_LABEL = "تواصل معنا";
const SPECIALTIES_LABEL = "مجالات التخصص";

const STAGE_FRAMES = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];

function Body() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const animationTimeout = useRef(null);
  const stageRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const preloaders = STAGE_FRAMES.map((src, idx) => {
      const img = new Image();
      img.src = src;
      if (idx === 0) {
        img.onload = () => {
          if (isMounted) setImageLoaded(true);
        };
      }
      return img;
    });

    return () => {
      isMounted = false;
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
      preloaders.forEach(img => {
        img.onload = null;
      });
    };
  }, []);

  useEffect(() => {
    stageRef.current = currentStage;
  }, [currentStage]);

  const animateToStage = (direction) => {
    const targetIndex = direction === "forward" ? STAGE_FRAMES.length - 1 : 0;
    const step = direction === "forward" ? 1 : -1;

    if (
      (direction === "forward" && stageRef.current >= targetIndex) ||
      (direction === "reverse" && stageRef.current <= targetIndex)
    ) {
      return;
    }

    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }

    const tick = () => {
      stageRef.current = Math.min(
        STAGE_FRAMES.length - 1,
        Math.max(0, stageRef.current + step)
      );
      setCurrentStage(stageRef.current);

      if (stageRef.current === targetIndex) {
        animationTimeout.current = null;
        return;
      }

      animationTimeout.current = setTimeout(tick, 120);
    };

    animationTimeout.current = setTimeout(tick, 120);
  };

  const handleImageClick = () => {
    const direction = stageRef.current === 0 ? "forward" : "reverse";
    animateToStage(direction);
  };

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
            جارٍ التحميل...
          </div>
        )}
        <motion.img 
          src={STAGE_FRAMES[currentStage]} 
          className="profile-img" 
          alt="صورة محمود الشراكي" 
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{ 
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          onLoad={() => setImageLoaded(true)}
          onHoverStart={() => animateToStage("forward")}
          onHoverEnd={() => animateToStage("reverse")}
          onClick={handleImageClick}
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
            <p>{SPECIALTIES_LABEL}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Body;