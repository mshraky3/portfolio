import { useEffect } from 'react';
import "./Services.css";
import { motion } from "framer-motion";

const translations = {
  en: {
    servicesTitle: "Services",
    mainTitle: "Get a powerful website that delivers results with all-in-one solution",
    webDesignTitle: "Web Design",
    webDesignDetail: "Say goodbye to the hassle of managing multiple providers and get an all-in-one website solution that covers design, development, and content creation",
    frontEndDevelopmentTitle: "Front-End Development",
    frontEndDevelopmentDetail: "Say goodbye to complex front-end challenges and get a seamless, user-friendly web experience built with modern technologies and best practices",
    databaseTitle: "Database",
    databaseDetail: "Effortlessly manage data with robust databases, ensuring seamless integration, security, and scalability for your web applications"
  },
  ar: {
    servicesTitle: "الخدمات",
    mainTitle: "احصل على موقع إلكتروني قوي يحقق النتائج مع حل شامل",
    webDesignTitle: "تصميم المواقع الإلكترونية",
    webDesignDetail: "ودع متاعب إدارة مزودي الخدمة المتعددين واستمتع بحل شامل للموقع الإلكتروني يغطي التصميم والتطوير وإنشاء المحتوى",
    frontEndDevelopmentTitle: "تطوير الواجهة الأمامية",
    frontEndDevelopmentDetail: "ودع التحديات المعقدة للواجهة الأمامية واستمتع بتجربة ويب سلسة ومريحة للمستخدم تم بناؤها باستخدام التقنيات الحديثة وأفضل الممارسات",
    databaseTitle: "قاعدة البيانات",
    databaseDetail: "ادارة البيانات بسهولة مع قواعد بيانات قوية، مما يضمن تكاملًا سلسًا وأمانًا وقابلية للتوسع لتطبيقات الويب الخاصة بك"
  }
};

function Services({ language }) {

  const translate = (key) => {
    return translations[language]?.[key] || translations.en[key];
  };

  return (
    <motion.div 
      className='servicesContenr' 
      id='SERVICES'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h1 
        className='servicestitle'
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {translate('servicesTitle')}
      </motion.h1>
      <div className='cntent'>
        <motion.div 
          className='text'
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h1 className='title'></h1>
          <p>{translate('mainTitle')}</p>
        </motion.div>
        <div className='Services'>
          <motion.div 
            className='serves'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <motion.img 
              width="70" 
              height="70" 
              src="https://img.icons8.com/cotton/100/web-design--v1.png" 
              alt="Web Design Icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
            <div className='nameD'>
              <h1 className='servicesName'>{translate('webDesignTitle')}</h1>
              <p className='detil'>{translate('webDesignDetail')}</p>
            </div>
          </motion.div>
          <motion.div 
            className='serves'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <motion.img 
              width="70" 
              height="70" 
              src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/70/external-ui-design-digital-nomad-tanah-basah-glyph-tanah-basah.png" 
              alt="Front-End Development Icon"
              whileHover={{ rotate: -360 }}
              transition={{ duration: 0.6 }}
            />
            <div className='nameD'>
              <h1 className='servicesName'>{translate('frontEndDevelopmentTitle')}</h1>
              <p className='detil'>{translate('frontEndDevelopmentDetail')}</p>
            </div>
          </motion.div>
          <motion.div 
            className='serves'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <motion.img 
              width="70" 
              height="70" 
              src="https://img.icons8.com/ios/100/database--v1.png" 
              alt="Database Icon"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
            />
            <div className='nameD'>
              <h1 className='servicesName'>{translate('databaseTitle')}</h1>
              <p className='detil'>{translate('databaseDetail')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Services;