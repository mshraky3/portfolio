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
              timeoutRef.current = setTimeout(cycleText, 20); // 200ms for typing
            } else {
              setIsTyping(false);
              timeoutRef.current = setTimeout(cycleText, 180); // 1.8 seconds delay before erasing
            }
          } else {
            if (currentText.length > 0) {
              setCurrentText((prev) => prev.slice(0, -1));
              timeoutRef.current = setTimeout(cycleText, 100); // 100ms for erasing
            } else {
              setIsTyping(true);
              setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
            }
          }
        };
    
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current); // Clear previous timeout if any
        }
    
        timeoutRef.current = setTimeout(cycleText, isTyping ? 200 : 180); // Initial start
    
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