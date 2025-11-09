import React from 'react';
import { motion } from 'framer-motion';
import './Benefits.css';

const BENEFIT_ITEMS = [
  {
    title: 'كن ظاهرًا في نتائج البحث',
    text:
      'بنية محسّنة لمحركات البحث وسرعة تحميل عالية ترفع ترتيبك للكلمات المفتاحية الأهم لنشاطك.'
  },
  {
    title: 'ابنِ الثقة بسرعة',
    text:
      'كل صفحة مصممة بتجربة مستخدم واضحة، وشواهد اجتماعية، وهوية بصرية متسقة تعزز المصداقية.'
  },
  {
    title: 'حوّل الزوار إلى عملاء',
    text:
      'دعوات تفاعل محسّنة وتدفقات سهلة تقلل الاحتكاك وتحوّل الاهتمام إلى فرص حقيقية على كل الأجهزة.'
  },
  {
    title: 'استجب لكل الأجهزة',
    text:
      'تصاميم مرنة تتكيف مع الجوال والأجهزة اللوحية وسطح المكتب دون التأثير على الأداء.'
  },
  {
    title: 'توسع بثقة',
    text:
      'بنية React وExpress القابلة للصيانة تضمن إطلاق ميزات جديدة بسرعة وبدون توقف.'
  }
];

const BENEFIT_HIGHLIGHTS = [
  {
    value: '٧ أيام',
    label: 'إطلاق أولي',
    caption: 'متوسط بدء المشاريع'
  },
  {
    value: '٣×',
    label: 'زيادة التحويل',
    caption: 'بعد تحسين التجربة'
  },
  {
    value: '٩٩٪',
    label: 'تقييم الأداء',
    caption: 'تركيز على مؤشرات الويب الحيوية'
  }
];

function Benefits() {
  return (
    <motion.section
      id="benefits"
      className="benefits-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="benefits-inner">
        <motion.div
          className="benefits-header"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="benefits-eyebrow">لماذا يهم الأمر</span>
          <h2>فوائد تحسين تصميم موقعك</h2>
          <p className="lead">
            الموقع المركز يجذب جمهورك ويقنعه ويحوّله. إليك ما تحققه عندما يعمل التصميم والهندسة بتناغم:
          </p>
        </motion.div>

        <motion.div
          className="benefits-highlights"
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
        >
          <span className="highlight-title">أرقام سريعة</span>
          <div className="highlight-grid">
            {BENEFIT_HIGHLIGHTS.map((item, idx) => (
              <div className="highlight-item" key={idx}>
                <span className="highlight-value">{item.value}</span>
                <span className="highlight-label">{item.label}</span>
                <span className="highlight-caption">{item.caption}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="benefits-grid">
          {BENEFIT_ITEMS.map((item, idx) => (
            <motion.div
              key={item.title}
              className="benefit-card"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="card-accent">
                <span>{String(idx + 1).padStart(2, '0')}</span>
              </div>
              <div className="card-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="benefits-cta"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h4>جاهز للانطلاق؟</h4>
          <p>
            دعنا نبني موقعًا عالي التحويل بتصميم وتطوير احترافيين يعكسان قوة علامتك.
          </p>
          <div className="cta-actions">
          <a href="#ContactMe" className="btn secondary">تواصل معنا</a>
            <a href="#SERVICES" className="btn primary">استعرض الخدمات</a>

          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Benefits;


