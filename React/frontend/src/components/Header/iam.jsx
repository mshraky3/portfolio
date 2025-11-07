import React, { useState, useEffect, useRef } from "react";
import "./HeaderStyle/iam.css"

const roles = ["front end", "backend", "full stack", "React developer"];

function IAM(){
      const [currentText, setCurrentText] = useState("");
      const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
      const [isTyping, setIsTyping] = useState(true);
      const timeoutRef = useRef(null);
      useEffect(() => {
        const cycleText = () => {
          const currentRole = roles[currentRoleIndex];
    
          if (isTyping) {
            if (currentText.length < currentRole.length) {
              setCurrentText((prev) => prev + currentRole[prev.length]);
              timeoutRef.current = setTimeout(cycleText, 20);
            } else {
              setIsTyping(false);
              timeoutRef.current = setTimeout(cycleText, 180);
            }
          } else {
            if (currentText.length > 0) {
              setCurrentText((prev) => prev.slice(0, -1));
              timeoutRef.current = setTimeout(cycleText, 100);
            } else {
              setIsTyping(true);
              setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
            }
          }
        };
    
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
    
        timeoutRef.current = setTimeout(cycleText, isTyping ? 200 : 180);
    
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }, [currentRoleIndex, isTyping, currentText]);

    return (
        <div className="im">
        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          I am {currentText}
        </span>
      </div>
    )
}

export default IAM;