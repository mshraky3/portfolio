import React, { useEffect } from "react";
import "./Contact.css";
import Form from "./Form";

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
      <div className="ContactMe" id="ContactMe">
        <div className="ContactDetai">
          <div className="ContactForm">
            <div className="ContactFormHeader">
              <div className="ContactFormTitle">{translate('contactTitle')}</div>
              <div className="ContactFormSubtitle">{translate('contactSubtitle')}</div>
            </div>
            <div className="ContactFormText">
              {translate('contactText')}
            </div>
            <Form />
          </div>
          <div className="ContactInfo">
            <div className="ContactInfoItem">
              <div className="ContactIcon">
                <img width="40" height="40" src="https://img.icons8.com/ios/40/phone--v1.png" alt="phone--v1" />
              </div>
              <div className="ContactInfoText">
                <strong>{translate('phone')}</strong>
                <p>+966 582 619 119</p>
              </div>
            </div>
            <div className="ContactInfoItem">
              <div className="ContactIcon">
                <img width="30" height="30" src="https://img.icons8.com/ios/40/new-post--v1.png" alt="new-post--v1" />
              </div>
              <div className="ContactInfoText">
                <strong>{translate('mail')}</strong>
                <p>muhmodalshraky3@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="Footer">
          <hr className="br" />
          {translate('footer').replace('{date}', date)}
        </div>
      </div>
    </>
  );
}

export default Contact;