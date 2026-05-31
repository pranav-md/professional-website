import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { links } from '../data/content'

const socialLinks = [
  { label: 'GitHub', href: links.github },
  { label: 'LinkedIn', href: links.linkedin },
  { label: 'X', href: links.x },
  { label: 'Medium', href: links.medium },
]

export default function Contact() {
  return (
    <section id="contact" className="snap-section">
      {/* Sticky header */}
      <div className="section-header-sticky px-4 md:px-20 lg:px-32 pt-8 md:pt-10">
        <SectionHeader num="05" title="Contact" />
      </div>

      {/* Content — vertically centered in remaining space */}
      <div className="flex-1 flex flex-col justify-center px-4 md:px-20 lg:px-32 pb-16">
        <div className="max-w-2xl">
          <motion.a
            href={`mailto:${links.email}`}
            className="block font-mono text-primary hover:text-accent transition-colors duration-300 break-all"
            style={{ fontSize: 'clamp(1.1rem, 3vw, 2rem)' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
          >
            {links.email}
          </motion.a>

          <motion.div
            className="flex flex-wrap gap-6 mt-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {socialLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-muted hover:text-accent transition-colors duration-200 underline underline-offset-4"
                style={{ fontSize: '0.85rem' }}
              >
                {label}
              </a>
            ))}
          </motion.div>

          <motion.p
            className="font-mono text-muted mt-20"
            style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            PRANAV M. DEV &mdash; {new Date().getFullYear()}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
