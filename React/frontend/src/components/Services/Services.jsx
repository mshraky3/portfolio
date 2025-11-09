import "./Services.css";
import Button from '@mui/material/Button';
import { motion } from "framer-motion";

function Services() {
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
        خدماتنا
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
          
          <p>احصل على موقع قوي يحقق النتائج مع حل متكامل من التصميم إلى الإطلاق</p>
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

            <div className='nameD'>
              <h1 className='servicesName'>تصميم واجهات المواقع</h1>
              <p className='detil'>ودّع التعامل مع مزودين متعددين، واستلم هوية رقمية متكاملة تعكس علامتك التجارية باحترافية وتدعم تجربة المستخدم من أول زيارة.</p>
            </div>
            <motion.img 
              width="70" 
              height="70" 
              src="https://img.icons8.com/cotton/100/web-design--v1.png" 
              alt="أيقونة تصميم مواقع"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
          <motion.div 
            className='serves'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
          >

            <div className='nameD'>
              <h1 className='servicesName'>تطوير الواجهات الأمامية</h1>
              <p className='detil'>نطوّر واجهات تفاعلية سلسة وسريعة الاستجابة باستخدام أحدث أطر العمل لضمان تجربة استخدام مميزة على جميع الأجهزة.</p>
            </div>
            <motion.img 
              width="70" 
              height="70" 
              src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/70/external-ui-design-digital-nomad-tanah-basah-glyph-tanah-basah.png" 
              alt="أيقونة تطوير الواجهات"
              whileHover={{ rotate: -360 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
          <motion.div 
            className='serves'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
          >

            <div className='nameD'>
              <h1 className='servicesName'>إدارة قواعد البيانات</h1>
              <p className='detil'>نصمم بنية بيانات آمنة وقابلة للتوسع مع تكامل سلس يضمن استقرار التطبيقات وحماية معلومات العملاء.</p>
            </div>
                        <motion.img 
              width="70" 
              height="70" 
              src="https://img.icons8.com/ios/100/database--v1.png" 
              alt="أيقونة قاعدة بيانات"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Services;