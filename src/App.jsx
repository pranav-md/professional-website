import { Routes, Route } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Writing from './components/Writing'
import Contact from './components/Contact'
import FlashGame from './components/FlashGame'

function Portfolio() {
  return (
    <div className="bg-bg min-h-screen">
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Writing />
        <Contact />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/game" element={<FlashGame />} />
    </Routes>
  )
}
