import { useState } from 'react'
import Header from './components/Header/Header'
import Services from './components/Services/Services'
import Projects from './components/Projects/Projects'
import About from './components/About/About'
import Contact from './components/contact/Contact'
import './App.css'

function App() {
  return (
    <>
      <Header/>
      <Projects/>
      <About/>
      <Services/>
      <Contact/>
    </>
  )
}

export default App
