import { useCallback, useEffect, useRef, useState } from 'react'

const soundFiles = [
  '67_SQlv2Xv.mp3',
  'aller-ftg.mp3',
  'among-us-role-reveal-sound.mp3',
  'arretez-denvoyer-les-messages-les-gens-sont-en-train-de-dormir.mp3',
  'ca-va-peter_nR3IwZJ.mp3',
  'coucou-tu-veux-voir-ma-bite_0LuNrh3.mp3',
  'dry-fart.mp3',
  'fahhhhhhhhhhhhhh.mp3',
  'fortnite-default-dance-bass-boosted.mp3',
  'indian-song.mp3',
  'jment-bats-les-couilles.mp3',
  'no-batidao-sonnerie-tel.mp3',
  'ouille-aie.mp3',
  'ouvre-la-porte.mp3',
  'reveil-byilhan.mp3',
  'ton-telephone-est-entrain-de-sonner.mp3',
  'tu-touche-a-ma-sensibilite.mp3',
  'va-dormir-la.mp3',
  'vine-boom.mp3',
  'une-souris-verte.mp3',
  'pantalon-dauphin.mp3',
  'y2mate_DO1kVeR.mp3',
  'img_0181-online-audio-converter.mp3',
  
  
]

const soundPaths = soundFiles.map((name) => `/Sons/${name}`)

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [clickCount, setClickCount] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [intervalMs, setIntervalMs] = useState(3200)
  const [isPressed, setIsPressed] = useState(false)

  const audioRefs = useRef([])
  const pressTimeout = useRef(null)

  useEffect(() => {
    audioRefs.current = soundPaths.map((src) => {
      const audio = new Audio(src)
      audio.preload = 'auto'
      audio.volume = 0.95
      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => console.warn('Impossible de charger le son', src)
      return audio
    })

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause()
        audio.src = ''
      })
      audioRefs.current = []
      if (pressTimeout.current) {
        clearTimeout(pressTimeout.current)
      }
    }
  }, [])

  const chooseNextIndex = useCallback(
    (previousIndex) => {
      if (soundPaths.length <= 1) return 0
      let nextIndex = previousIndex
      while (nextIndex === previousIndex) {
        nextIndex = Math.floor(Math.random() * soundPaths.length)
      }
      return nextIndex
    },
    [],
  )

  const playRandomSound = useCallback(
    ({ auto = false } = {}) => {
      if (!audioRefs.current.length) return

      const nextIndex = chooseNextIndex(currentIndex)
      const audio = audioRefs.current[nextIndex]
      if (!audio) return

      audio.pause()
      audio.currentTime = 0

      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setCurrentIndex(nextIndex)
          if (!auto) {
            setClickCount((value) => value + 1)
          }
          setIsPressed(true)
          if (pressTimeout.current) {
            clearTimeout(pressTimeout.current)
          }
          pressTimeout.current = setTimeout(() => setIsPressed(false), 160)
        })
        .catch((error) => {
          console.warn('Impossible de jouer le son', error)
          setIsPlaying(false)
        })
    },
    [chooseNextIndex, currentIndex],
  )

  useEffect(() => {
    if (!autoPlay) return undefined
    const intervalId = setInterval(() => playRandomSound({ auto: true }), intervalMs)
    return () => clearInterval(intervalId)
  }, [autoPlay, intervalMs, playRandomSound])

  useEffect(() => {
    if (!autoPlay) return
    playRandomSound({ auto: true })
  }, [autoPlay, playRandomSound])

  const currentSoundLabel =
    currentIndex >= 0
      ? soundFiles[currentIndex].replace(/\.mp3$/i, '').replace(/[-_]/g, ' ')
      : 'Aucun son encore joué'

  return (
    <div className="app-shell">
      <style>{`
        :root {
          color-scheme: dark;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #05070f;
          color: #eef2ff;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .app-shell {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          background: radial-gradient(circle at top, rgba(141, 192, 255, 0.18), transparent 24%),
            radial-gradient(circle at 20% 10%, rgba(255, 120, 198, 0.12), transparent 16%),
            linear-gradient(180deg, #05070f 0%, #090d17 48%, #0f151f 100%);
        }

        .card {
          width: min(560px, 100%);
          padding: 32px;
          border-radius: 32px;
          background: rgba(12, 18, 34, 0.88);
          box-shadow: 0 32px 80px rgba(2, 13, 35, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(18px);
        }

        .card h1 {
          margin: 0 0 12px;
          font-size: clamp(2rem, 3.4vw, 3rem);
          letter-spacing: -0.04em;
        }

        .subtitle {
          margin: 0 0 24px;
          color: #9bb0dc;
          line-height: 1.45;
        }

        .play-button {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          border: none;
          outline: none;
          cursor: pointer;
          background: linear-gradient(180deg, #7c5cff 0%, #3b50ff 100%);
          color: white;
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          display: grid;
          place-items: center;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
          box-shadow: 0 24px 60px rgba(124, 92, 255, 0.28);
        }

        .play-button:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .play-button.pressed {
          transform: scale(0.92);
          box-shadow: 0 18px 44px rgba(124, 92, 255, 0.36);
        }

        .play-button::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.08);
        }

        .pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          opacity: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 45%);
          animation: pulse 1.8s infinite;
          pointer-events: none;
        }

        .status {
          margin-top: 24px;
          text-align: center;
          color: #a0b0db;
          font-weight: 600;
        }

        .status strong {
          color: #ffffff;
        }

        .meta {
          margin-top: 28px;
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .meta-item {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 18px;
          padding: 16px 18px;
          min-height: 88px;
        }

        .meta-item span {
          display: block;
          color: #9bb0dc;
          font-size: 0.88rem;
          margin-bottom: 8px;
        }

        .meta-item strong {
          display: block;
          color: #f8fbff;
          font-size: 1.15rem;
          line-height: 1.3;
        }

        .controls {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          align-items: center;
        }

        .toggle {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          color: #eef2ff;
        }

        .toggle input {
          width: 44px;
          height: 24px;
          appearance: none;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          position: relative;
          outline: none;
          transition: background 180ms ease;
        }

        .toggle input:checked {
          background: linear-gradient(90deg, #5c7fef, #8a5dff);
        }

        .toggle input::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          transition: transform 180ms ease;
        }

        .toggle input:checked::after {
          transform: translateX(20px);
        }

        .slider {
          width: 100%;
          max-width: 260px;
          display: grid;
          gap: 8px;
          text-align: left;
        }

        .slider input[type='range'] {
          width: 100%;
          accent-color: #7c5cff;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.12;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.05;
          }
        }

        @media (max-width: 540px) {
          .card {
            padding: 24px;
          }

          .play-button {
            width: 190px;
            height: 190px;
          }

          .meta {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="card">
        <h1>Soundboard TikTok</h1>
        <p className="subtitle">Clique sur le gros bouton pour jouer un son aléatoire, sans répéter le même deux fois de suite.</p>

        <button
          className={`play-button ${isPressed ? 'pressed' : ''}`}
          type="button"
          onClick={() => playRandomSound()}
        >
          <span>{isPlaying ? 'Playing...' : 'Clique ici'}</span>
          <div className="pulse" />
        </button>

        <div className="status">
          <strong>{isPlaying ? currentSoundLabel : 'Prêt à jouer'}</strong>
        </div>

        <div className="meta">
          <div className="meta-item">
            <span>Nombre de clics</span>
            <strong>{clickCount}</strong>
          </div>
          <div className="meta-item">
            <span>Son actuel</span>
            <strong>{currentIndex >= 0 ? currentSoundLabel : 'Aucun son'}</strong>
          </div>
          <div className="meta-item">
            <span>Auto-play</span>
            <strong>{autoPlay ? `Toutes les ${intervalMs / 1000}s` : 'Désactivé'}</strong>
          </div>
          <div className="meta-item">
            <span>Nombre de pistes</span>
            <strong>{soundFiles.length}</strong>
          </div>
        </div>

        <div className="controls">
          <label className="toggle">
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(event) => setAutoPlay(event.target.checked)}
            />
            Auto-play
          </label>
          <div className="slider">
            <span>Intervalle automatique : {intervalMs / 1000}s</span>
            <input
              type="range"
              min="2000"
              max="7000"
              step="500"
              value={intervalMs}
              onChange={(event) => setIntervalMs(Number(event.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
