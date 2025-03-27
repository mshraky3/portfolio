import React, { useState, useEffect } from "react";
import "./HeaderStyle/navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu visibility

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add the event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <div className="logo" id="logo">
        alshraky<span>.</span>
      </div>

      {/* Hamburger Menu Button for Small Screens */}
      <div className="menu-icon" onClick={toggleMenu}>
        <img width="40" height="40" src="https://img.icons8.com/ios-filled/40/C850F2/menu--v1.png" alt="menu--v1" />      </div>

      {/* Dropdown Menu for Small Screens */}
      <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
        <a href="#HOME">HOME</a>
        <a href="#SERVICES">SERVICES</a>
        <a href="#projects">PROJECTS</a>
        <a href="#aboutSection">ABOUT ME</a>
        <a href="#ContactMe">CONTACT</a>
      </div>

      {/* Middle Text (Visible on Larger Screens) */}
      <div className="middle-text">
        <span><a href="#HOME">HOME</a></span>
        <span><a href="#SERVICES">SERVICES</a></span>
        <span><a href="#projects">PROJECTS</a></span>
        <span><a href="#aboutSection">ABOUT ME</a></span>
        <span><a href="#ContactMe">CONTACT</a></span>
      </div>

      {/* Button on the Right */}
      <div className="button">
        <a href="https://wa.link/5zcep6">
          <button className={isScrolled ? 'scrolled-button' : ''}>Let's Talk</button>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;