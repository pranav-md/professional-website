import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { experience } from '../data/content'

function CompanyLogo({ domain, company }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={`${company} logo`}
      onError={() => setFailed(true)}
      className="w-6 h-6 rounded object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  )
}

function ExperienceItem({ item, index }) {
  return (
    <motion.div
      className="exp-item relative pl-8 md:pl-12 pb-12 last:pb-4 group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Timeline node */}
      <div className="absolute left-0 top-2.5 w-2 h-2 rounded-full border border-accent transition-colors duration-300 group-hover:bg-accent" />

      {/* Company + logo */}
      <div className="flex items-center gap-3 mb-1">
        {item.logoDomain && (
          <CompanyLogo domain={item.logoDomain} company={item.company} />
        )}
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="exp-link font-mono text-xs tracking-widest uppercase text-accent font-medium">
            {item.company}
          </span>
          <span className="font-mono text-xs text-muted">{item.location}</span>
        </div>
      </div>

      {/* Role */}
      <h3
        className="font-display text-primary mb-1 leading-tight"
        style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)' }}
      >
        {item.role}
      </h3>

      {/* Period */}
      <p className="font-mono text-muted mb-3" style={{ fontSize: '0.7rem' }}>
        {item.period} &middot; {item.duration}
      </p>

      {/* Bullets */}
      <ul className="space-y-2 mb-3">
        {item.bullets.map((b, i) => (
          <li
            key={i}
            className="font-mono text-primary leading-relaxed flex gap-3"
            style={{ fontSize: 'clamp(0.78rem, 1.2vw, 0.88rem)' }}
          >
            <span className="text-muted mt-0.5 shrink-0">–</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Stack */}
      <div className="flex flex-wrap gap-2">
        {item.stack.map((s) => (
          <span
            key={s}
            className="font-mono text-muted border border-rule px-2 py-0.5"
            style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}
          >
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="snap-section">
      {/* Sticky header */}
      <div className="section-header-sticky px-4 md:px-20 lg:px-32 pt-8 md:pt-10">
        <SectionHeader num="02" title="Experience" />
      </div>

      {/* Scrollable timeline */}
      <div className="section-scroll px-4 md:px-20 lg:px-32 pb-16">
        <div className="relative max-w-2xl">
          {/* Vertical accent line */}
          <div
            className="absolute left-[3px] top-0 bottom-0 w-px"
            style={{ background: 'var(--color-accent)', opacity: 0.25 }}
          />
          {experience.map((item, i) => (
            <ExperienceItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
