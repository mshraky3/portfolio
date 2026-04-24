import { Helmet, HelmetProvider } from "react-helmet-async";
import Header from "./components/Header/Header";
import Services from "./components/Services/Services";
import ProjectShowcase from "./components/Projects/ProjectShowcase";
import About from "./components/About/About";
import Contact from "./components/contact/Contact";
import Resume from "./components/Resume/Resume";
import "./App.css";

const TITLE = "محمود الشراكي | مطور ويب Full-Stack | تصميم وتطوير مواقع احترافية";
const TITLE_EN = "Mahmoud Alshraky | Full-Stack Web Developer | Professional Website Design";
const DESCRIPTION =
  "مطور ويب Full-Stack متخصص في بناء مواقع احترافية وأنظمة مؤسسية بتقنيات React وNode.js وPostgreSQL. أداء عالٍ وتجربة مستخدم مدروسة. خبرة في تصميم واجهات المستخدم وتطوير واجهات برمجة التطبيقات.";
const DESCRIPTION_EN =
  "Full-Stack Web Developer specializing in professional websites and enterprise systems using React, Node.js, and PostgreSQL. High performance and thoughtful UX. Expert in UI design and REST API development.";
const KEYWORDS =
  "محمود الشراكي, مطور ويب, Full-Stack Developer, تصميم مواقع, تطوير مواقع, React, Node.js, PostgreSQL, Express.js, أنظمة مؤسسية, تجربة مستخدم, Mahmoud Alshraky, web developer, website design, frontend developer, backend developer, Saudi Arabia";
const SITE_URL = "https://web-dev-seven-iota.vercel.app";

const PERSON_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mahmoud Alshraky",
  alternateName: "محمود الشراكي",
  url: SITE_URL,
  image: `${SITE_URL}/me.png`,
  jobTitle: "Full-Stack Web Developer",
  description: DESCRIPTION_EN,
  email: "alshraky3@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SA",
    addressRegion: "Saudi Arabia",
  },
  knowsAbout: ["React", "Node.js", "PostgreSQL", "Express.js", "JavaScript", "Web Development", "UI/UX Design"],
  sameAs: [
    "https://github.com/mshraky3",
    "https://www.instagram.com/m_alshraky/",
    "https://wa.link/5zcep6",
  ],
};

const WEBSITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mahmoud Alshraky — Portfolio",
  alternateName: "محمود الشراكي",
  url: SITE_URL,
  description: DESCRIPTION_EN,
  inLanguage: ["ar", "en"],
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const FAQ_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "لماذا يحتاج نشاطك التجاري إلى موقع إلكتروني؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "يساعد الموقع الإلكتروني في تحسين الظهور على Google، وبناء الثقة، وتحويل الزوار إلى عملاء.",
      },
    },
    {
      "@type": "Question",
      name: "ما الفرق بين تصميم المواقع وتطويرها؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "يركز التصميم على المظهر وتجربة المستخدم، بينما يهتم التطوير بالوظائف والأداء والحماية.",
      },
    },
  ],
};

const ORGANIZATION_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mahmoud Alshraky",
  alternateName: "محمود الشراكي",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/me.png`,
  description: DESCRIPTION_EN,
  email: "alshraky3@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SA",
  },
  sameAs: [
    "https://github.com/mshraky3",
    "https://www.instagram.com/m_alshraky/",
    "https://wa.link/5zcep6",
  ],
};

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <html lang="ar" dir="rtl" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content={KEYWORDS} />
        <meta name="author" content="Mahmoud Alshraky" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="geo.region" content="SA" />
        <meta name="geo.placename" content="Saudi Arabia" />
        <meta name="language" content="Arabic, English" />

        {/* Canonical */}
        <link rel="canonical" href={SITE_URL} />

        {/* Hreflang */}
        <link rel="alternate" hrefLang="ar" href={`${SITE_URL}/?lang=ar`} />
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/?lang=en`} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Mahmoud Alshraky" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={`${SITE_URL}/me.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Mahmoud Alshraky - Full-Stack Web Developer" />
        <meta property="og:url" content={SITE_URL} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/me.png`} />
        <meta name="twitter:image:alt" content="Mahmoud Alshraky - Full-Stack Web Developer" />
        <meta name="twitter:url" content={SITE_URL} />

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
      <ProjectShowcase />
      <Services />
      <About />
      <Resume />
      <Contact />
    </HelmetProvider>
  );
}

export default App;
