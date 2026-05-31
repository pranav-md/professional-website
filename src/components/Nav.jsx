import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const sections = [
  { num: '00', label: 'Hero', id: 'hero' },
  { num: '01', label: 'About', id: 'about' },
  { num: '02', label: 'Experience', id: 'experience' },
  { num: '03', label: 'Skills', id: 'skills' },
  { num: '04', label: 'Writing', id: 'writing' },
  { num: '05', label: 'Contact', id: 'contact' },
]

export default function Nav() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { root: document.body, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <motion.nav
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
    >
      {sections.map(({ num, id }) => (
        <a
          key={id}
          href={`#${id}`}
          className="group flex items-center gap-3"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <span
            className={`font-mono text-xs transition-colors duration-200 ${
              active === id ? 'text-accent' : 'text-muted'
            } group-hover:text-accent`}
          >
            {num}
          </span>
          <span
            className={`block h-px transition-all duration-300 ${
              active === id ? 'w-8 bg-accent' : 'w-3 bg-muted'
            } group-hover:w-8 group-hover:bg-accent`}
          />
        </a>
      ))}
    </motion.nav>
  )
}
