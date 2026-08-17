import React from "react";
import "./Contact.css";
import Form from "./Form";
import { motion } from "framer-motion";

const CONTACT_COPY = {
  title: "تواصل معي",
  subtitle: "خلنا نناقش مشروعك",
  text: "يسعدني الاستماع إلى فكرتك أو سؤالك. التأخير قد يفقدك فرصًا مهتمة — أرسل الآن وسأعود إليك سريعًا.",
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
                <p>alshraky3@gmail.com</p>
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
          <a
            href="#ContactMe"
            className="signature-contact-btn"
            aria-label="تواصل مباشر"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', margin: '1.2rem 0', padding: '0.4em 1em', background: 'linear-gradient(90deg, #6a1b9a 60%, #8e24aa 100%)', color: '#fff', borderRadius: '2em', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', boxShadow: '0 2px 8px rgba(106,27,154,0.08)', transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s', cursor: 'pointer', border: 'none', outline: 'none', willChange: 'transform' }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #8e24aa 60%, #6a1b9a 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #6a1b9a 60%, #8e24aa 100%)'}
          >
            <span role="img" aria-label="Contact">✉️</span> تواصل مباشر
          </a>
          <hr className="br" />
          {CONTACT_COPY.footer.replace('{date}', date)}
        </motion.div>
      </motion.div>
    </>
  );
}

export default Contact;