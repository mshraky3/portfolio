import React, { useEffect } from "react";
import "./Contact.css";
import Form from "./Form";
import { motion } from "framer-motion";

// Define translations
const translations = {
  en: {
    contactTitle: "GET IN TOUCH",
    contactSubtitle: "Let's Discuss Projects",
    contactText: "Get in touch with us for any kind of help. We are here to give you the best and also here to help you to find your projects.",
    phone: "Phone",
    mail: "Mail",
    footer: "© {date} copyright all rights reserved"
  },
  ar: {
    contactTitle: "اتصل بنا",
    contactSubtitle: "دعنا نناقش المشاريع",
    contactText: "اتصل بنا لأي نوع من المساعدة. نحن هنا لنقدم لك الأفضل ومساعدتك في العثور على مشاريعك.",
    phone: "هاتف",
    mail: "بريد إلكتروني",
    footer: "© {date} جميع الحقوق محفوظة"
  }
};

function Contact({ language }) {
  const date = new Date().getFullYear();
  const translate = (key) => {
    return translations[language]?.[key] || translations.en[key];
  };

  return (
    <>
      <motion.div 
        className="ContactMe" 
        id="ContactMe"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="ContactDetai">
          <motion.div 
            className="ContactForm"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="ContactFormHeader"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="ContactFormTitle">{translate('contactTitle')}</div>
              <div className="ContactFormSubtitle">{translate('contactSubtitle')}</div>
            </motion.div>
            <motion.div 
              className="ContactFormText"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {translate('contactText')}
            </motion.div>
            <Form />
          </motion.div>
          <motion.div 
            className="ContactInfo"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="ContactInfoItem"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, x: 10 }}
            >
              <motion.div 
                className="ContactIcon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <img width="40" height="40" src="https://img.icons8.com/ios/40/phone--v1.png" alt="Phone Icon" />
              </motion.div>
              <div className="ContactInfoText">
                <strong>{translate('phone')}</strong>
                <p>+966 582 619 119</p>
              </div>
            </motion.div>
            <motion.div 
              className="ContactInfoItem"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, x: 10 }}
            >
              <motion.div 
                className="ContactIcon"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.6 }}
              >
                <img width="30" height="30" src="https://img.icons8.com/ios/40/new-post--v1.png" alt="Email Icon" />
              </motion.div>
              <div className="ContactInfoText">
                <strong>{translate('mail')}</strong>
                <p>muhmodalshraky3@gmail.com</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="Footer"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
        >
          <hr className="br" />
          {translate('footer').replace('{date}', date)}
        </motion.div>
      </motion.div>
    </>
  );
}

export default Contact;