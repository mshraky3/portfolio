import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from './components/Header/Header';
import Services from './components/Services/Services';
import Projects from './components/Projects/Projects';
import About from './components/About/About';
import Contact from './components/contact/Contact';
import Benefits from './components/Benefits/Benefits';
import './App.css';

const TITLE = "Alshraky .";
const DESCRIPTION = "alshraky is a web design and development studio building fast, beautiful, conversion‑focused websites with performance-first engineering.";
const KEYWORDS = "alshraky, web design, web development, agency, frontend, performance, seo, branding";
const SITE_URL = "https://your-website-url.com"; // Placeholder

const PERSON_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mahmoud Alshraky",
  "url": SITE_URL,
  "image": `${SITE_URL}/name_logo.png`,
  "jobTitle": "Web Developer",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "SA"
  },
  "sameAs": [
    "https://github.com/mshraky3",
    "https://wa.link/5zcep6"
  ]
};

const WEBSITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "alshraky",
  "url": SITE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

const FAQ_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why does your business need a website?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A website improves Google visibility, builds credibility, and converts visitors into customers."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between web design and web development?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Design focuses on look and UX, while development builds functionality, performance, and security."
      }
    }
  ]
};

const ORGANIZATION_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "alshraky",
  "url": SITE_URL,
  "logo": `${SITE_URL}/name_logo.png`,
  "sameAs": [
    "https://github.com/mshraky3",
    "https://www.instagram.com/m_alshraky/",
    "https://wa.link/5zcep6"
  ]
};

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <html lang="en" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content={KEYWORDS} />
        <meta name="author" content="Mahmoud Alshraky" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={`${SITE_URL}/name_logo.png`} />
        <meta property="og:url" content={SITE_URL} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={TITLE} />
        <meta property="twitter:description" content={DESCRIPTION} />
        <meta property="twitter:image" content={`${SITE_URL}/name_logo.png`} />
        <meta property="twitter:url" content={SITE_URL} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(PERSON_STRUCTURED_DATA)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(WEBSITE_STRUCTURED_DATA)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(FAQ_STRUCTURED_DATA)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(ORGANIZATION_STRUCTURED_DATA)}
        </script>
      </Helmet>
      <Header />
      <Projects />
      <About />
      <Benefits />
      <Services />
      <Contact />
    </HelmetProvider>
  );
}

export default App;