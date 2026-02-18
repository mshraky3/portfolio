import React, { useState, useEffect, useRef } from "react";
import "./HeaderStyle/iam.css"

const roles = ["تصميم تجربة المستخدم", "تطوير الواجهات الخلفية", "بناء مواقع متكاملة", "تحسين محركات البحث"];

function IAM() {
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
    <div style={{ flex: 0.5, padding: 5, textAlign: 'center', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', fontSize: '2rem', lineHeight: 1 }}>
      <span style={{ display: 'inline-block', whiteSpace: 'nowrap', fontWeight: 'bold', position: 'relative' }}>
        {currentText}
        <span style={{
          content: "''",
          display: 'inline-block',
          width: 5,
          height: '1.2em',
          background: 'currentColor',
          marginInlineStart: 6,
          animation: 'blink 1s infinite',
          position: 'absolute',
          right: -12,
          top: 0
        }} />
      </span>
    </div>
  )
}

export default IAM;