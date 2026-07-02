import { Helmet, HelmetProvider } from "react-helmet-async";
import Header from "./components/Header/Header";
import Services from "./components/Services/Services";
import ProjectShowcase from "./components/Projects/ProjectShowcase";
import About from "./components/About/About";
import Contact from "./components/contact/Contact";
import Resume from "./components/Resume/Resume";
import "./App.css";

const TITLE = "محمود الشراكي | مهندس برمجيات Full-Stack | React · Node.js · PostgreSQL";
const TITLE_EN = "Mahmoud Alshraky | Software Engineer | Full-Stack (React, Node.js, PostgreSQL)";
const DESCRIPTION =
  "مهندس برمجيات Full-Stack أبني أنظمة مؤسسية وتطبيقات عالية الأداء بتقنيات React وNode.js وPostgreSQL، بأساس هندسي في هياكل البيانات والخوارزميات وتصميم قواعد البيانات وبناء واجهات برمجة التطبيقات (REST APIs).";
const DESCRIPTION_EN =
  "Software Engineer building production-grade enterprise systems and full-stack applications with React, Node.js, and PostgreSQL. Grounded in data structures, algorithms, database design, and REST API architecture.";
const KEYWORDS =
  "محمود الشراكي, مهندس برمجيات, Software Engineer, Full-Stack Developer, Backend Developer, هياكل البيانات, خوارزميات, React, Node.js, PostgreSQL, Express.js, REST API, أنظمة مؤسسية, Mahmoud Alshraky, software engineer Saudi Arabia, full-stack engineer, computer science, Saudi Arabia";
const SITE_URL = "https://web-dev-seven-iota.vercel.app";

const PERSON_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mahmoud Alshraky",
  alternateName: "محمود الشراكي",
  url: SITE_URL,
  image: `${SITE_URL}/me.png`,
  jobTitle: "Software Engineer",
  description: DESCRIPTION_EN,
  email: "alshraky3@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SA",
    addressRegion: "Saudi Arabia",
  },
  knowsAbout: ["Software Engineering", "Data Structures", "Algorithms", "System Design", "Database Design", "React", "Node.js", "PostgreSQL", "Express.js", "JavaScript", "Python", "REST API"],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Qassim University",
  },
  sameAs: [
    "https://github.com/mshraky3",
    "https://www.linkedin.com/in/muhmod-alshraky-350b20318",
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
    "https://www.linkedin.com/in/muhmod-alshraky-350b20318",
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
        <meta name="google-site-verification" content="_D8kWKKjWX9kVbOg7WD19Qw9ifCGYer9F1cNlOY3c2I" />
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
        <meta property="og:image:alt" content="Mahmoud Alshraky - Software Engineer" />
        <meta property="og:url" content={SITE_URL} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@m_alshraky" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/me.png`} />
        <meta name="twitter:image:alt" content="Mahmoud Alshraky - Software Engineer" />
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
