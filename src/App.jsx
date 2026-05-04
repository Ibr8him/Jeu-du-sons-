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
  // État audio (ancien système)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [clickCount, setClickCount] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [intervalMs, setIntervalMs] = useState(3200)
  const [isPressed, setIsPressed] = useState(false)

  // État du jeu (nouveau système)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameState, setGameState] = useState('idle') // idle, playing, guessing, answered
  const [options, setOptions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [correctAnswer, setCorrectAnswer] = useState(-1)

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

  // Générer les options de réponse selon le niveau
  const generateOptions = useCallback(
    (correctIndex) => {
      const choicesCount = level === 1 ? 3 : level === 2 ? 5 : 8
      const selectedIndices = new Set([correctIndex])
      
      while (selectedIndices.size < choicesCount) {
        const randomIndex = Math.floor(Math.random() * soundPaths.length)
        if (randomIndex !== correctIndex) {
          selectedIndices.add(randomIndex)
        }
      }
      
      return Array.from(selectedIndices).sort(() => Math.random() - 0.5)
    },
    [level],
  )

  // Vérifier la réponse et mettre à jour le score
  const handleAnswer = useCallback(
    (selectedIndex) => {
      const correct = selectedIndex === currentIndex
      setSelectedAnswer(selectedIndex)
      setIsCorrect(correct)
      setGameState('answered')
      
      if (correct) {
        const newScore = score + 10
        setScore(newScore)
        
        // Augmenter le niveau tous les 50 points
        const newLevel = Math.floor(newScore / 50) + 1
        if (newLevel > level) {
          setLevel(newLevel)
        }
      } else {
        setScore(Math.max(0, score - 5))
      }
    },
    [score, currentIndex, level],
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
          setGameState('playing')
          setSelectedAnswer(null)
          setIsCorrect(null)
          
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

  // Quand le son se termine, afficher les options
  useEffect(() => {
    if (!isPlaying && currentIndex >= 0 && gameState === 'playing') {
      const optionsList = generateOptions(currentIndex)
      setOptions(optionsList)
      setCorrectAnswer(currentIndex)
      setGameState('guessing')
    }
  }, [isPlaying, currentIndex, gameState, generateOptions])

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

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-item {
          text-align: center;
        }

        .header-item span {
          display: block;
          color: #9bb0dc;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .header-item strong {
          display: block;
          color: #7c5cff;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .game-message {
          text-align: center;
          margin: 16px 0;
          min-height: 28px;
          font-weight: 600;
          font-size: 1rem;
          animation: messageSlide 300ms ease;
        }

        .game-message.correct {
          color: #4ade80;
        }

        .game-message.incorrect {
          color: #f87171;
        }

        .options-grid {
          display: grid;
          gap: 12px;
          margin: 24px 0;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }

        .option-button {
          padding: 14px 16px;
          border-radius: 14px;
          border: 2px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: #eef2ff;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 200ms ease;
          overflow: hidden;
          position: relative;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .option-button:hover:not(:disabled) {
          border-color: rgba(124, 92, 255, 0.5);
          background: rgba(124, 92, 255, 0.1);
          transform: translateY(-2px);
        }

        .option-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .option-button.correct {
          border-color: #4ade80;
          background: rgba(74, 222, 128, 0.15);
          color: #4ade80;
          animation: correctPulse 600ms ease;
        }

        .option-button.incorrect {
          border-color: #f87171;
          background: rgba(248, 113, 113, 0.15);
          color: #f87171;
          animation: incorrectShake 600ms ease;
        }

        .replay-button {
          width: 100%;
          padding: 12px 24px;
          margin-top: 16px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #7c5cff, #3b50ff);
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 200ms ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .replay-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(124, 92, 255, 0.3);
        }

        .replay-button:active {
          transform: scale(0.95);
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes correctPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes incorrectShake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          75% {
            transform: translateX(6px);
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
        <h1>🎮 Devine le son</h1>
        
        {/* En-tête avec score et niveau */}
        <div className="header">
          <div className="header-item">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <div className="header-item">
            <span>Niveau</span>
            <strong>{level}</strong>
          </div>
          <div className="header-item">
            <span>Choix à faire</span>
            <strong>{level === 1 ? 3 : level === 2 ? 5 : 8}</strong>
          </div>
        </div>

        <p className="subtitle">Écoute le son, puis clique sur la bonne réponse. +10 points si correct, -5 si incorrect.</p>

        {/* Bouton de lecture */}
        <button
          className={`play-button ${isPressed ? 'pressed' : ''}`}
          type="button"
          onClick={() => playRandomSound()}
          disabled={gameState === 'guessing' || gameState === 'answered'}
        >
          <span>{isPlaying ? 'Playing...' : 'Clique ici'}</span>
          <div className="pulse" />
        </button>

        <div className="status">
          <strong>{isPlaying ? 'Écoute le son...' : 'Prêt à jouer'}</strong>
        </div>

        {/* Message du jeu (Correct/Faux) */}
        {isCorrect !== null && (
          <div className={`game-message ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✅ Correct !' : '❌ Faux...'}
          </div>
        )}

        {/* Afficher les options de réponse */}
        {gameState === 'guessing' || gameState === 'answered' ? (
          <>
            <div className="options-grid">
              {options.map((index) => (
                <button
                  key={index}
                  className={`option-button ${
                    selectedAnswer === index && isCorrect ? 'correct' : ''
                  } ${selectedAnswer === index && isCorrect === false ? 'incorrect' : ''}`}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  {soundFiles[index].replace(/\.mp3$/i, '').replace(/[-_]/g, ' ')}
                </button>
              ))}
            </div>

            {/* Bouton rejouer après avoir répondu */}
            {gameState === 'answered' && (
              <button className="replay-button" onClick={() => {
                setGameState('idle')
                playRandomSound()
              }}>
                Rejouer →
              </button>
            )}
          </>
        ) : null}

        <div className="meta">
          <div className="meta-item">
            <span>Nombre de clics</span>
            <strong>{clickCount}</strong>
          </div>
          <div className="meta-item">
            <span>Prochain niveau à</span>
            <strong>{Math.ceil((level * 50) / 10) * 10} pts</strong>
          </div>
          <div className="meta-item">
            <span>Progression</span>
            <strong>{score % 50}/{50}</strong>
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
