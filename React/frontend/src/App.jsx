import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from './components/Header/Header';
import Services from './components/Services/Services';
import Projects from './components/Projects/Projects';
import About from './components/About/About';
import Contact from './components/contact/Contact';
import './App.css';

function App() {
  const [language, setLanguage] = useState(navigator.language.startsWith('ar') ? 'ar' : 'en');

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const isArabic = language === 'ar';
  const title = isArabic ? "محمود الشراكي - مطور ويب في المملكة العربية السعودية" : "Mahmoud Alshraky - Web Developer in KSA";
  const description = isArabic ? "محمود الشراكي هو مطور ويب في المملكة العربية السعودية متخصص في تصميم وبناء تطبيقات الويب باستخدام React و Express و PostgreSQL." : "Mahmoud Alshraky is a web developer in Saudi Arabia (KSA) specializing in designing and building web applications using React, Express, and PostgreSQL.";
  const keywords = isArabic ? "مطور ويب, مبرمج, السعودية, المملكة العربية السعودية, مطور React, مطور full stack, محمود الشراكي, تصميم مواقع, برمجة مواقع" : "web developer, programmer, KSA, Saudi Arabia, React developer, full stack developer, Mahmoud Alshraky, web design, web programming";
  const siteUrl = "https://your-website-url.com"; // Placeholder

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mahmoud Alshraky",
    "url": siteUrl,
    "image": `${siteUrl}/me.png`,
    "jobTitle": "Web Developer",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA"
    },
    "sameAs": [
      "https://www.instagram.com/m_alshraky/",
      "https://github.com/mshraky3",
      "https://wa.link/5zcep6"
    ]
  };

  return (
    <HelmetProvider>
      <Helmet>
        <html lang={language} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Mahmoud Alshraky" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${siteUrl}/me.png`} />
        <meta property="og:url" content={siteUrl} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={`${siteUrl}/me.png`} />
        <meta property="twitter:url" content={siteUrl} />

        {/* Internationalization */}
        <link rel="alternate" hreflang="en" href={`${siteUrl}?lang=en`} />
        <link rel="alternate" hreflang="ar" href={`${siteUrl}?lang=ar`} />
        <link rel="alternate" hreflang="x-default" href={siteUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Header setLanguage={handleLanguageChange} language={language} />
      <Projects language={language} />
      <About language={language} />
      <Services language={language} />
      <Contact language={language} />
    </HelmetProvider>
  );
}

export default App;