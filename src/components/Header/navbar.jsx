import React, { useState, useEffect } from "react";
import "./HeaderStyle/navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Define the scroll event handler
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

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      {/* Logo on the left */}
      <div className="logo">alshraky<span>.</span></div>
      {/* Five words in the middle */}
      <div className="middle-text">
        <span>HOME</span>
        <span><a href="#servicesContent">SERVICES</a></span>
        <span>PROJECTS</span>
        <span>ABOUT ME</span>
        <span>CONTACT</span>
      </div>
      {/* Button on the right */}
      <div className="button">
       <a href="https://wa.link/5zcep6"> <button className={isScrolled ? 'scrolled-button' : ''}>Let's Talk</button></a>
      </div>
    </nav>
  );
}

export default Navbar;