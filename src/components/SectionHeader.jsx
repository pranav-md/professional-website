import { motion } from 'framer-motion'

export default function SectionHeader({ num, title }) {
  return (
    <motion.div
      className="flex items-baseline gap-4 mb-12 md:mb-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="font-display text-accent opacity-60" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
        {num}
      </span>
      <h2
        className="font-mono font-normal tracking-widest uppercase text-muted"
        style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', letterSpacing: '0.25em' }}
      >
        {title}
      </h2>
    </motion.div>
  )
}
