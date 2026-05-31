import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const paragraphs = [
  "Software engineer with 6.9 years building distributed systems and full-stack products. I specialize in the Scala ecosystem — Akka, Tapir, FS2, Cats Effect — and have shipped production systems that run at scale across telecom, edtech, and legaltech.",
  "I care about systems that are correct before they are fast, and fast before they are clever. Backend-heavy by nature, comfortable owning the full stack when the product demands it.",
  "Currently at Thoughtworks, working on AI-augmented SDLC tooling for one of India's largest telecom companies. Previously at PowerSchool and KeyValue, where I led feature delivery, mentored engineers, and built microservice architectures from the ground up.",
]

export default function About() {
  return (
    <section id="about" className="snap-section">
      {/* Sticky header */}
      <div className="section-header-sticky px-4 md:px-20 lg:px-32 pt-8 md:pt-10">
        <SectionHeader num="01" title="About" />
      </div>

      {/* Scrollable body */}
      <div className="section-scroll px-4 md:px-20 lg:px-32 pb-16">
        <div className="max-w-2xl space-y-6">
          {paragraphs.map((text, i) => (
            <motion.p
              key={i}
              className="font-mono text-primary leading-relaxed"
              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}
