import { Helmet, HelmetProvider } from "react-helmet-async";
import Header from "./components/Header/Header";
import Services from "./components/Services/Services";
import ProjectShowcase from "./components/Projects/ProjectShowcase";
import About from "./components/About/About";
import Contact from "./components/contact/Contact";
import Benefits from "./components/Benefits/Benefits";
import Resume from "./components/Resume/Resume";
import "./App.css";

const TITLE = "محمود الشراكي | تصميم وتطوير مواقع";
const DESCRIPTION =
  "مطور ويب Full-Stack متخصص في بناء مواقع احترافية وأنظمة مؤسسية بتقنيات React وNode.js وPostgreSQL. أداء عالٍ وتجربة مستخدم مدروسة.";
const KEYWORDS =
  "محمود الشراكي, مطور ويب, Full-Stack Developer, تصميم مواقع, تطوير مواقع, React, Node.js, PostgreSQL, أنظمة مؤسسية, تجربة مستخدم";
const SITE_URL = "https://alshraky.com"; // TODO: update to your actual domain

const PERSON_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mahmoud Alshraky",
  url: SITE_URL,
  image: `${SITE_URL}/name_logo.png`,
  jobTitle: "Web Developer",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SA",
  },
  sameAs: ["https://github.com/mshraky3", "https://wa.link/5zcep6"],
};

const WEBSITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "alshraky",
  url: SITE_URL,
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
  name: "alshraky",
  url: SITE_URL,
  logo: `${SITE_URL}/name_logo.png`,
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
      <ProjectShowcase />
      <About />
      <Benefits />
      <Services />
      <Resume />
      <Contact />
    </HelmetProvider>
  );
}

export default App;
