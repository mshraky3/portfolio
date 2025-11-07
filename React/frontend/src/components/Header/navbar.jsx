import React, { useState, useEffect } from "react";
import "./HeaderStyle/navbar.css";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "#HOME", label: "HOME" },
  { href: "#SERVICES", label: "SERVICES" },
  { href: "#benefits", label: "BENEFITS" },
  { href: "#projects", label: "PROJECTS" },
  { href: "#aboutSection", label: "ABOUT US" },
  { href: "#ContactMe", label: "CONTACT" }
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.div 
        className="logo" 
        id="logo"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img
          src="/logo.png"
          alt="alshraky logo"
          height="40"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{ display: 'block' }}
        />
      </motion.div>

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
          alt="menu"
          loading="lazy"
        />
      </motion.div>

      <motion.div 
        className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <motion.a 
            key={href}
            href={href}
            onClick={closeMenu}
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {label}
          </motion.a>
        ))}
      </motion.div>

      <div className="middle-text">
        {NAV_LINKS.map(({ href, label }) => (
          <motion.span
            key={href}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <a href={href}>{label}</a>
          </motion.span>
        ))}
      </div>

      <motion.div 
        className="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <a href="https://wa.link/5zcep6">
          <button className={isScrolled ? 'scrolled-button' : ''}>
            Let's Talk
          </button>
        </a>
      </motion.div>
    </motion.nav>
  );
}

export default Navbar;