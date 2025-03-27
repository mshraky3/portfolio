import { useState } from 'react';
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

  return (
    <>
      <Header setLanguage={handleLanguageChange} language={language} />
      <Projects language={language} />
      <About language={language} />
      <Services language={language} />
      <Contact language={language} />
    </>
  );
}

export default App;