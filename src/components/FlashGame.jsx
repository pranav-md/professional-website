import { useState, useRef, useCallback } from 'react'

const TOTAL_NUMBERS = 10
const INITIAL_QUOTA = 4

function useHoldButton(onQuickRelease, onHoldComplete, disabled) {
  const pressStartRef = useRef(null)
  const holdTimerRef = useRef(null)

  const cancel = useCallback(() => {
    clearTimeout(holdTimerRef.current)
    pressStartRef.current = null
  }, [])

  const startPress = useCallback((e) => {
    if (disabled) return
    e.preventDefault()
    pressStartRef.current = performance.now()

    const HOLD_MS = 1000

    holdTimerRef.current = setTimeout(() => {
      if (pressStartRef.current !== null) {
        cancel()
        onHoldComplete()
      }
    }, HOLD_MS)
  }, [disabled, cancel, onHoldComplete])

  const endPress = useCallback(() => {
    if (!pressStartRef.current) return
    const elapsed = performance.now() - pressStartRef.current
    cancel()
    if (elapsed < 1000) {
      onQuickRelease()
    }
  }, [cancel, onQuickRelease])

  return { startPress, endPress }
}

function NumberBox({ number, selected, onToggle, flying, flyStyle, settling }) {
  return (
    <button
      onClick={flying ? undefined : onToggle}
      className="number-box"
      data-selected={selected}
      data-flying={flying}
      data-settling={settling}
      style={flying ? flyStyle : undefined}
      aria-pressed={selected}
    >
      {number}
    </button>
  )
}

function HoldButton({ disabled, onStart, onEnd, label }) {
  return (
    <button
      className="hold-btn"
      data-disabled={disabled}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchStart={onStart}
      onTouchEnd={onEnd}
      disabled={disabled}
    >
      <span className="hold-btn-label">{label}</span>
    </button>
  )
}

function Confetti({ count = 80 }) {
  const pieces = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      color: ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#10b981', '#3b82f6'][Math.floor(Math.random() * 6)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 720,
    }))
  )

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.current.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--rot-start': `${p.rotation}deg`,
            '--rot-end': `${p.rotation + p.rotSpeed}deg`,
          }}
        />
      ))}
    </div>
  )
}

function generateFlyStyle() {
  const directions = [
    { x: -120 - Math.random() * 200, y: -80 - Math.random() * 150 },
    { x: 120 + Math.random() * 200, y: -80 - Math.random() * 150 },
    { x: -150 - Math.random() * 180, y: 100 + Math.random() * 120 },
    { x: 150 + Math.random() * 180, y: 100 + Math.random() * 120 },
    { x: (Math.random() - 0.5) * 100, y: -200 - Math.random() * 150 },
  ]
  const d = directions[Math.floor(Math.random() * directions.length)]
  const rot = (Math.random() - 0.5) * 540
  return {
    '--fly-x': `${d.x}px`,
    '--fly-y': `${d.y}px`,
    '--fly-rot': `${rot}deg`,
  }
}

const PHASE = {
  PLAYING: 'playing',
  ANIMATING: 'animating',
  SETTLING: 'settling',
  CELEBRATION: 'celebration',
}

export default function FlashGame() {
  const [boxes, setBoxes] = useState(() => Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1))
  const [selected, setSelected] = useState(new Set())
  const [quota, setQuota] = useState(INITIAL_QUOTA)
  const [pass, setPass] = useState(1)
  const [phase, setPhase] = useState(PHASE.PLAYING)
  const [flyingIds, setFlyingIds] = useState(new Set())
  const [flyStyles, setFlyStyles] = useState({})
  const [settlingIds, setSettlingIds] = useState(new Set())
  const [magicNumber, setMagicNumber] = useState(null)

  const reset = useCallback(() => {
    setBoxes(Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1))
    setSelected(new Set())
    setQuota(INITIAL_QUOTA)
    setPass(1)
    setPhase(PHASE.PLAYING)
    setFlyingIds(new Set())
    setFlyStyles({})
    setSettlingIds(new Set())
    setMagicNumber(null)
  }, [])

  const toggleBox = useCallback((num) => {
    if (phase !== PHASE.PLAYING) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(num)) {
        next.delete(num)
      } else if (next.size < quota) {
        next.add(num)
      }
      return next
    })
  }, [phase, quota])

  const triggerStep = useCallback((keepSelected) => {
    // keepSelected=true → deep press: keep selected, fly unselected
    // keepSelected=false → quick press: keep unselected, fly selected
    const toFly = boxes.filter(n => keepSelected ? !selected.has(n) : selected.has(n))
    const toKeep = boxes.filter(n => keepSelected ? selected.has(n) : !selected.has(n))

    const styles = {}
    toFly.forEach(n => { styles[n] = generateFlyStyle() })

    setPhase(PHASE.ANIMATING)
    setFlyingIds(new Set(toFly))
    setFlyStyles(styles)

    // After fly animation (600ms), remove them and settle
    setTimeout(() => {
      setFlyingIds(new Set())
      setFlyStyles({})
      setBoxes(toKeep)
      setSelected(new Set())

      if (toKeep.length === 1) {
        setMagicNumber(toKeep[0])
        setPhase(PHASE.CELEBRATION)
        return
      }

      setPhase(PHASE.SETTLING)
      setSettlingIds(new Set(toKeep))
      setQuota(q => Math.max(q - 1, 1))
      setPass(p => p + 1)

      setTimeout(() => {
        setSettlingIds(new Set())
        setPhase(PHASE.PLAYING)
      }, 500)
    }, 650)
  }, [boxes, selected])

  const onQuickRelease = useCallback(() => triggerStep(false), [triggerStep])
  const onHoldComplete = useCallback(() => triggerStep(true), [triggerStep])

  const canPress = phase === PHASE.PLAYING && selected.size === quota

  const { startPress, endPress } = useHoldButton(
    onQuickRelease,
    onHoldComplete,
    !canPress,
  )

  return (
    <>
      <style>{GAME_CSS}</style>
      <div className="game-root">
        {phase === PHASE.CELEBRATION ? (
          <div className="celebration">
            <Confetti />
            <div className="magic-reveal">
              <div className="magic-number">{magicNumber}</div>
              <div className="magic-title">✨ Your Magic Number is {magicNumber} ✨</div>
              <div className="magic-sub">The universe has chosen.</div>
              <button className="play-again-btn" onClick={reset}>Play Again</button>
            </div>
          </div>
        ) : (
          <>
            {/* HUD */}
            <div className="hud">
              <div className="hud-info">
                <span className="hud-pass">Pass {pass}</span>
                <span className="hud-select">Select <strong>{quota}</strong> numbers</span>
                <span className="hud-count">{selected.size} / {quota} selected</span>
              </div>
              <button className="retry-btn" onClick={reset}>↺ Retry</button>
            </div>

            {/* Grid */}
            <div className="boxes-grid">
              {boxes.map(n => (
                <NumberBox
                  key={n}
                  number={n}
                  selected={selected.has(n)}
                  onToggle={() => toggleBox(n)}
                  flying={flyingIds.has(n)}
                  flyStyle={flyStyles[n]}
                  settling={settlingIds.has(n)}
                />
              ))}
            </div>

            {/* NEXT STEP */}
            <div className="btn-area">
              <HoldButton
                disabled={!canPress}
                onStart={startPress}
                onEnd={endPress}
                label="NEXT STEP"
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

const GAME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.game-root {
  min-height: 100vh;
  background: #f8f8fb;
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 40px;
  position: relative;
  overflow: hidden;
}

/* HUD */
.hud {
  width: 100%;
  max-width: 560px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
}
.hud-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hud-pass {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
}
.hud-select {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}
.hud-select strong {
  color: #6366f1;
}
.hud-count {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}
.retry-btn {
  background: none;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  font-family: inherit;
}
.retry-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: #eef2ff;
}

/* Grid */
.boxes-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  max-width: 560px;
  width: 100%;
  margin-bottom: 40px;
}
@media (max-width: 480px) {
  .boxes-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; }
}

/* Number Box */
.number-box {
  aspect-ratio: 1;
  border-radius: 16px;
  border: none;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: transform 0.18s cubic-bezier(.34,1.56,.64,1),
              box-shadow 0.18s ease,
              background 0.18s ease,
              color 0.18s ease;
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 0 0 1.5px rgba(0,0,0,0.06);
  outline: none;
}
.number-box:hover:not([data-flying="true"]) {
  box-shadow: 0 4px 16px rgba(99,102,241,0.18), 0 0 0 1.5px rgba(99,102,241,0.25);
  transform: translateY(-2px) scale(1.03);
}
.number-box[data-selected="true"] {
  background: #6366f1;
  color: #ffffff;
  box-shadow: inset 0 3px 8px rgba(0,0,0,0.22), inset 0 1px 3px rgba(0,0,0,0.15),
              0 0 0 2px #6366f1;
  transform: scale(0.93);
}
.number-box[data-selected="true"]:hover {
  transform: scale(0.93);
  background: #5457e8;
}

/* Fly animation */
@keyframes fly-off {
  0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
  60%  { opacity: 0.6; }
  100% { transform: translate(var(--fly-x), var(--fly-y)) rotate(var(--fly-rot)) scale(0.4); opacity: 0; }
}
.number-box[data-flying="true"] {
  animation: fly-off 0.6s cubic-bezier(.4,0,.2,1) forwards;
  pointer-events: none;
}

/* Settle animation */
@keyframes settle-in {
  0%   { transform: scale(0.7) translateY(12px); opacity: 0; }
  70%  { transform: scale(1.06) translateY(-3px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
.number-box[data-settling="true"] {
  animation: settle-in 0.45s cubic-bezier(.34,1.56,.64,1) forwards;
}

/* HOLD button */
.btn-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.hold-btn {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: none;
  background: #6366f1;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: background 0.2s, opacity 0.2s, transform 0.15s;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.hold-btn[data-disabled="true"] {
  opacity: 0.35;
  cursor: not-allowed;
  background: #9ca3af;
}
.hold-btn:not([data-disabled="true"]):hover {
  background: #5457e8;
}
.hold-btn-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  pointer-events: none;
}

/* Celebration */
.celebration {
  position: fixed;
  inset: 0;
  background: #0f0f1a;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  overflow: hidden;
}
.magic-reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 10;
  text-align: center;
  padding: 24px;
}
@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 20px #6366f1, 0 0 60px #6366f1, 0 0 100px #6366f1; transform: scale(1); }
  50%       { text-shadow: 0 0 40px #6366f1, 0 0 100px #a5b4fc, 0 0 160px #6366f1; transform: scale(1.06); }
}
.magic-number {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(100px, 20vw, 180px);
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  animation: pulse-glow 2s ease-in-out infinite;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.magic-title {
  font-size: clamp(18px, 4vw, 28px);
  font-weight: 700;
  color: #e0e7ff;
  animation: fade-up 0.6s 0.2s both;
}
.magic-sub {
  font-size: 16px;
  color: #818cf8;
  font-weight: 500;
  animation: fade-up 0.6s 0.4s both;
}
.play-again-btn {
  margin-top: 12px;
  padding: 14px 36px;
  border-radius: 50px;
  border: 2px solid #6366f1;
  background: transparent;
  color: #a5b4fc;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  animation: fade-up 0.6s 0.6s both;
}
.play-again-btn:hover {
  background: #6366f1;
  color: #fff;
}

/* Confetti */
.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
@keyframes confetti-fall {
  0%   { transform: translateY(-10%) rotate(var(--rot-start)); opacity: 1; }
  80%  { opacity: 0.8; }
  100% { transform: translateY(110vh) rotate(var(--rot-end)); opacity: 0; }
}
.confetti-piece {
  position: absolute;
  top: 0;
  border-radius: 2px;
  animation: confetti-fall linear infinite;
}
`
