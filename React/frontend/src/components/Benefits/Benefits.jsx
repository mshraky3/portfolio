import React from 'react';
import { motion } from 'framer-motion';
import './Benefits.css';

const BENEFIT_ITEMS = [
  {
    title: 'Be found on Google',
    text:
      'SEO-friendly web design and fast web development help your site rank for keywords like web design, web development, and your local services.'
  },
  {
    title: 'Build trust and credibility',
    text:
      'A clean design, clear messaging, and real case studies increase conversions and make your brand memorable.'
  },
  {
    title: 'Get more leads and sales',
    text:
      'Optimized contact forms, WhatsApp CTAs, and performance-focused development convert visitors into customers.'
  },
  {
    title: 'Work on every device',
    text:
      'Responsive web design ensures your website looks great on phones, tablets, and desktops.'
  },
  {
    title: 'Scale as you grow',
    text:
      'Robust front-end and database choices keep your site fast, secure, and ready for more traffic.'
  }
];

const BENEFIT_HIGHLIGHTS = [
  {
    value: '7-day',
    label: 'Launch window',
    caption: 'Average project kickoff'
  },
  {
    value: '3×',
    label: 'Conversion lift',
    caption: 'After redesign roll-out'
  },
  {
    value: '99%',
    label: 'Lighthouse score',
    caption: 'Core Web Vitals focus'
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
          <span className="benefits-eyebrow">Web Design · UX Strategy</span>
          <h2>Benefits of a Website for Your Business</h2>
          <p className="subtitle">Why web design and web development matter</p>
          <p className="lead">
            A modern website builds trust, brings new customers, and drives revenue. Here is how professional web design and development help your business grow:
          </p>
        </motion.div>

        <motion.div
          className="benefits-highlights"
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
        >
          <span className="highlight-title">What you gain</span>
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
          <h4>Ready to start?</h4>
          <p>
            Let’s build a high-converting website with professional web design and web development.
          </p>
          <div className="cta-actions">
            <a href="#SERVICES" className="btn primary">See Services</a>
            <a href="#ContactMe" className="btn secondary">Contact Us</a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Benefits;


