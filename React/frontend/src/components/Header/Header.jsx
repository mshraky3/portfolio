import React from 'react';
import Navbar from './navbar';
import Body from "./Dody";

function Header({ setLanguage, language }) {
  return (
    <>
      <Navbar setLanguage={setLanguage} />
      <Body language={language} setLanguage={setLanguage} />
    </>
  );
}

export default Header;