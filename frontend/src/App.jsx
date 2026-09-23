import { Helmet, HelmetProvider } from "react-helmet-async";
import Nav from "./components/Nav/Nav";
import Hero from "./components/Hero/Hero";
import Proof from "./components/Proof/Proof";
import Systems from "./components/Systems/Systems";
import Sites from "./components/Sites/Sites";
import Experience from "./components/Experience/Experience";
import About from "./components/About/About";
import Contact, { Footer } from "./components/contact/Contact";
import Reactions from "./components/Reactions/Reactions";
import { trackVisit } from "./utils/api";
import { useEffect } from "react";
import { TITLE } from "./data/content";

// All <head> metadata (description, Open Graph, JSON-LD, canonical) lives in
// index.html, generated from src/data/content.js at build time, so crawlers get
// it without running JavaScript. Helmet only sets what the app must own.
export default function App() {
  useEffect(() => trackVisit(), []);
  return (
    <HelmetProvider>
      <Helmet>
        <html lang="en" dir="ltr" />
        <title>{TITLE}</title>
      </Helmet>
      <a className="skip-link" href="#work">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Proof />
        <Systems />
        <Sites />
        <Experience />
        <About />
        <Contact />
        <Reactions />
      </main>
      <Footer />
    </HelmetProvider>
  );
}
