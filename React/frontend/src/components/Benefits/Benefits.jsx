import React from 'react';
import { motion } from 'framer-motion';
import './Benefits.css';

const BENEFIT_ITEMS = [
  {
    title: 'تواجد دائم على مدار الساعة',
    text:
      'موقعك يجعل نشاطك متاحًا لعملائك في أي وقت ومن أي مكان، حتى خارج ساعات الدوام أو حدود المتجر الفعلي.'
  },
  {
    title: 'مصداقية وهوية واضحة',
    text:
      'واجهة احترافية بمعلومات دقيقة وآراء العملاء تؤكد جودة خدماتك وتمنح الزائرين ثقة أكبر في التعامل معك.'
  },
  {
    title: 'جذب عملاء جدد تلقائيًا',
    text:
      'تحسين محركات البحث والمحتوى المستهدف يجلب زيارات مؤهلة باستمرار دون الحاجة لحملات مكلفة طوال الوقت.'
  },
  {
    title: 'قناة تواصل وتحويل مباشرة',
    text:
      'نماذج تواصل، أزرار واتساب، ومتاجر إلكترونية تدفع الزائر للخطوة التالية بسرعة وتقلل الفاقد من الفرص.'
  },
  {
    title: 'قابلية للنمو والتطوير',
    text:
      'يمكنك إضافة خدمات، حجز مواعيد، أو تكاملات مع أنظمة الدفع والتسويق لاحقًا دون البدء من جديد.'
  }
];

const BENEFIT_HIGHLIGHTS = [
  {
    value: '88%',
    label: 'يحكمون على المصداقية',
    caption: 'انطباعهم الأول يأتي من موقعك'
  },
  {
    value: '24/7',
    label: 'خدمة العملاء',
    caption: 'قناة مفتوحة دائمًا دون تكلفة إضافية'
  },
  {
    value: '70%',
    label: 'يفضلون الشركات المتصلة',
    caption: 'وجود رقمي يسبق المنافسين'
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
          <h2>لماذا يحتاج عملك إلى موقع إلكتروني</h2>
          <p className="lead">
            الموقع الاحترافي هو نقطة الالتقاء الأولى بين علامتك وجمهورك. هو بطاقة التعريف، قناة التسويق،
            ومركز التحويل الذي يدعم نموك مهما كان حجم نشاطك.
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
            دعنا نضع موقعًا واضحًا وجذابًا يعرّف بعملك ويحوّل الزيارات إلى طلبات وخدمات فعلية.
          </p>
          <div className="cta-actions">
            <a href="#ContactMe" className="btn secondary">تواصل معي</a>
            <a href="#SERVICES" className="btn primary">استعرض الخدمات</a>

          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Benefits;


