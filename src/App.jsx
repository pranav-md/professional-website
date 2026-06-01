import { useEffect, useState } from 'react'
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

function useRoute() {
  const getRoute = () => window.location.hash.replace(/^#\/?/, '') || ''
  const [route, setRoute] = useState(getRoute)
  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

export default function App() {
  const route = useRoute()
  if (route === 'game') return <FlashGame />
  return <Portfolio />
}
