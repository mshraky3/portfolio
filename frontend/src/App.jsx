import { Helmet, HelmetProvider } from "react-helmet-async";
import Nav from "./components/Nav/Nav";
import Hero from "./components/Hero/Hero";
import Proof from "./components/Proof/Proof";
import Work from "./components/Work/Work";
import NeuroLink from "./components/NeuroLink/NeuroLink";
import Experience from "./components/Experience/Experience";
import About from "./components/About/About";
import Contact, { Footer } from "./components/contact/Contact";
import { TITLE } from "./data/content";

// All <head> metadata (description, Open Graph, JSON-LD, canonical) lives in
// index.html, generated from src/data/content.js at build time, so crawlers get
// it without running JavaScript. Helmet only sets what the app must own.
export default function App() {
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
        <Work
          id="work"
          group="prod"
          title="Systems in production"
          lead="The systems I have built and run. Open Technical details under any of them for the routes, tables and files behind it."
        />
        <NeuroLink />
        <Work
          id="sites"
          group="sites"
          title="Sites and tools"
          lead="Work delivered to clients, and a tool I built for people in my own field."
        />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </HelmetProvider>
  );
}
