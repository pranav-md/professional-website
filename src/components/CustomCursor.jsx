import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const onEnter = () => setHovered(true)
    const onLeave = () => setHovered(false)
    const targets = document.querySelectorAll('a, button, [data-cursor]')
    targets.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    return () => {
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  })

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-accent mix-blend-difference hidden md:block"
      animate={{
        x: pos.x - (hovered ? 20 : 6),
        y: pos.y - (hovered ? 20 : 6),
        width: hovered ? 40 : 12,
        height: hovered ? 40 : 12,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.5 }}
    />
  )
}
