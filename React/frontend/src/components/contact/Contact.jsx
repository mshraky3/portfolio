import React from "react";
import "./Contact.css";
import Form from "./Form";
import { motion } from "framer-motion";

const CONTACT_COPY = {
  title: "تواصل معي",
  subtitle: "خلنا نناقش مشروعك",
  text: "يسعدني الاستماع إلى فكرتك أو سؤالك. اختر الطريقة الأنسب لك وسأعود إليك في أقرب وقت.",
  phone: "الهاتف",
  mail: "البريد الإلكتروني",
  footer: "© {date} جميع الحقوق محفوظة"
};

function Contact() {
  const date = new Date().getFullYear();

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
              <div className="ContactFormTitle">{CONTACT_COPY.title}</div>
              <div className="ContactFormSubtitle">{CONTACT_COPY.subtitle}</div>
            </motion.div>
            <motion.div
              className="ContactFormText"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {CONTACT_COPY.text}
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
              whileHover={{ scale: 1.05, x: -10 }}
            >

              <div className="ContactInfoText">
                <strong>{CONTACT_COPY.phone}</strong>
                <p>0582619119</p>
              </div>
              <motion.div
                className="ContactIcon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <img width="40" height="40" src="https://img.icons8.com/ios/40/phone--v1.png" alt="أيقونة الهاتف" />
              </motion.div>
            </motion.div>

            <motion.div
              className="ContactInfoItem"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, x: -10 }}
            >

              <div className="ContactInfoText">
                <strong>{CONTACT_COPY.mail}</strong>
                <p>muhmodalshraky3@gmail.com</p>
              </div>
              <motion.div
                className="ContactIcon"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.6 }}
              >
                <img width="30" height="30" src="https://img.icons8.com/ios/40/new-post--v1.png" alt="أيقونة البريد الإلكتروني" />
              </motion.div>
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
          {CONTACT_COPY.footer.replace('{date}', date)}
        </motion.div>
      </motion.div>
    </>
  );
}

export default Contact;