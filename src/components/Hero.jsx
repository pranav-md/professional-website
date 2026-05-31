import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { links } from '../data/content'

const SUBTITLE = 'Full-Stack Engineer. Scala. Distributed systems.'

const nameCharsLine1 = 'Pranav'.split('')
const nameCharsLine2 = 'M. Dev'.split('')

const charVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.045, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), 900)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!started) return
    if (typed.length >= SUBTITLE.length) return
    const t = setTimeout(() => setTyped(SUBTITLE.slice(0, typed.length + 1)), 38)
    return () => clearTimeout(t)
  }, [started, typed])

  return (
    <section
      id="hero"
      className="snap-section pl-4 md:pl-20 lg:pl-32 pr-4 md:pr-12 justify-center"
    >
      {/* Name */}
      <div className="overflow-hidden">
        <h1
          className="font-display leading-none tracking-tight text-primary block"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
        >
          {nameCharsLine1.map((char, i) => (
            <motion.span
              key={`l1-${i}`}
              custom={i}
              variants={charVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </h1>
        <h1
          className="font-display leading-none tracking-tight text-primary block"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
        >
          {nameCharsLine2.map((char, i) => (
            <motion.span
              key={`l2-${i}`}
              custom={nameCharsLine1.length + i}
              variants={charVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Subtitle typewriter */}
      <motion.div
        className="mt-6 md:mt-8 font-mono text-muted"
        style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        {typed}
        <span className="cursor-blink text-accent ml-0.5">_</span>
      </motion.div>

      {/* Bottom-left: location */}
      <motion.div
        className="absolute bottom-8 left-4 md:left-20 lg:left-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <span
          className="font-mono text-muted"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
          }}
        >
          Bengaluru, India
        </span>
      </motion.div>

      {/* Bottom-right: social links */}
      <motion.div
        className="absolute bottom-8 right-4 md:right-12 flex gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        {[
          { label: 'GH', href: links.github },
          { label: 'LI', href: links.linkedin },
          { label: 'X', href: links.x },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted hover:text-accent transition-colors duration-200 underline-offset-4 hover:underline"
          >
            {label}
          </a>
        ))}
      </motion.div>

      {/* Bottom separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'var(--color-rule)' }}
      />
    </section>
  )
}
