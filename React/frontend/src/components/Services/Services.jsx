import { useEffect } from 'react';
import "./Services.css";

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
    <div className='servicesContenr' id='SERVICES'>
      <h1 className='servicestitle'>{translate('servicesTitle')}</h1>
      <div className='cntent'>
        <div className='text'>
          <h1 className='title'></h1>
          <p>{translate('mainTitle')}</p>
        </div>
        <div className='Services'>
          <div className='serves'>
            <img width="70" height="70" src="https://img.icons8.com/cotton/100/web-design--v1.png" alt="web-design--v1" />
            <div className='nameD'>
              <h1 className='servicesName'>{translate('webDesignTitle')}</h1>
              <p className='detil'>{translate('webDesignDetail')}</p>
            </div>
          </div>
          <div className='serves'>
            <img width="70" height="70" src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/70/external-ui-design-digital-nomad-tanah-basah-glyph-tanah-basah.png" alt="external-ui-design-digital-nomad-tanah-basah-glyph-tanah-basah" />
            <div className='nameD'>
              <h1 className='servicesName'>{translate('frontEndDevelopmentTitle')}</h1>
              <p className='detil'>{translate('frontEndDevelopmentDetail')}</p>
            </div>
          </div>
          <div className='serves'>
            <img width="70" height="70" src="https://img.icons8.com/ios/100/database--v1.png" alt="database--v1" />
            <div className='nameD'>
              <h1 className='servicesName'>{translate('databaseTitle')}</h1>
              <p className='detil'>{translate('databaseDetail')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;