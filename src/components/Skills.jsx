import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { skills } from '../data/content'

const row1 = skills.slice(0, Math.ceil(skills.length / 2))
const row2 = skills.slice(Math.ceil(skills.length / 2))

function MarqueeRow({ items, direction = 'left' }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className={direction === 'left' ? 'marquee-left inline-flex' : 'marquee-right inline-flex'}>
        {doubled.map((skill, i) => (
          <span
            key={i}
            className="font-mono text-primary inline-flex items-center"
            style={{ fontSize: 'clamp(1.2rem, 3vw, 2.2rem)', marginRight: 'clamp(2rem, 5vw, 4rem)' }}
          >
            {skill}
            <span className="text-accent ml-4 md:ml-8 opacity-40" style={{ fontSize: '0.5em' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="snap-section">
      {/* Sticky header */}
      <div className="section-header-sticky px-4 md:px-20 lg:px-32 pt-8 md:pt-10">
        <SectionHeader num="03" title="Skills" />
      </div>

      {/* Marquee — vertically centered in remaining space */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <motion.div
          className="marquee-container space-y-4 md:space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <MarqueeRow items={row1} direction="left" />
          <MarqueeRow items={row2} direction="right" />
        </motion.div>
      </div>
    </section>
  )
}
