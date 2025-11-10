import "./Services.css";
import { motion } from "framer-motion";

const SERVICES = [
  {
    title: "تصميم واجهات المواقع",
    description:
      "نصمم صفحات واضحة وسهلة التصفح تجعل الزائر يفهم عروضك خلال ثوانٍ، مع ألوان وصور تعكس هوية نشاطك ببساطة.",
    bulletPoints: ["شرح الخدمة أو المنتج بلغة مباشرة", "تنظيم كل قسم بحيث يقود للخطوة التالية", "إبراز وسائل التواصل بشكل واضح"],
    icon: "https://img.icons8.com/cotton/100/web-design--v1.png"
  },
  {
    title: "تطوير الواجهات الأمامية",
    description:
      "نحوّل التصميم إلى موقع يعمل بسلاسة على الجوال والكمبيوتر، مع أزرار وروابط تستجيب فورًا لطلبات المستخدم.",
    bulletPoints: ["سرعة تحميل ممتازة حتى مع الإنترنت البطيء", "تجربة مريحة على كل الشاشات", "سهولة إضافة صفحات أو تعديل المحتوى لاحقًا"],
    icon: "https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/70/external-ui-design-digital-nomad-tanah-basah-glyph-tanah-basah.png"
  },
  {
    title: "إدارة البيانات والتكاملات",
    description:
      "نبني الجزء الخفي من الموقع ليحفظ بيانات العملاء بأمان، ويرسل الطلبات والرسائل تلقائيًا، ويتصل بالأدوات التي تعتمد عليها.",
    bulletPoints: ["حماية بيانات العملاء واسترجاعها بسهولة", "لوحات متابعة توضح الأرقام المهمة", "ربط الموقع مع أنظمة الدفع والتسويق"],
    icon: "https://img.icons8.com/ios/100/database--v1.png"
  }
];

function Services() {
  return (
    <motion.section
      className="services-section"
      id="SERVICES"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="services-header"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        viewport={{ once: true }}
      >
        <span className="services-eyebrow">حزمة متكاملة</span>
        <h2>من الفكرة إلى الإطلاق بخبرة واحدة</h2>
        <p>
          خدماتنا تُغطي كل ما تحتاجه علامتك الرقمية: استراتيجية واضحة، تجربة مستخدم مقنعة، بنية تقنية
          قابلة للتوسع. كل ذلك بتنفيذ فريق واحد يعرف كيف يوحّد التصميم والتطوير.
        </p>
      </motion.div>

      <div className="services-grid">
        {SERVICES.map((service, index) => (
          <motion.article
            key={service.title}
            className="service-card"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 + index * 0.12 }}
            viewport={{ once: true, amount: 0.35 }}
            whileHover={{ y: -8 }}
          >
            <div className="service-card-body">
              <span className="service-step">{String(index + 1).padStart(2, "0")}</span>
              <div className="service-icon">
                <img src={service.icon} alt={service.title} loading="lazy" />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.bulletPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="service-card-accent" />
          </motion.article>
        ))}
      </div>

      <motion.div
        className="services-cta"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <p>هل تحتاج لخطة تنفيذ تناسب مشروعك؟</p>
        <a className="services-link" href="https://wa.link/5zcep6">
          احجز مكالمة استشارية
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M8 5h11v11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 17 18.5 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </motion.div>
    </motion.section>
  );
}

export default Services;