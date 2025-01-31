import { useEffect, useState } from 'react'

export const l2beatAsciiArt = `
██╗     ██████╗ ██████╗ ███████╗ █████╗ ████████╗
██║     ╚════██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝
██║      █████╔╝██████╔╝█████╗  ███████║   ██║   
██║     ██╔═══╝ ██╔══██╗██╔══╝  ██╔══██║   ██║   
███████╗███████╗██████╔╝███████╗██║  ██║   ██║   
╚══════╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝    
`

export function LoadingState() {
  const [frame, setFrame] = useState(0)
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)

  const messages = [
    'Initializing L2 protocols...',
    'Syncing blockchain data...',
    'Calculating TVS...',
    'Analyzing gas fees...',
    'Optimizing rollups...',
    'Verifying zero-knowledge proofs...',
    'Aggregating transaction data...',
    'Benchmarking scalability...',
    'Assessing interoperability...',
    'Evaluating security measures...',
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % 4)
      if (progress < 99) {
        setProgress((prevProgress) => prevProgress + 1)
      }
      if (progress % 20 === 0) {
        setMessageIndex((prevIndex) => {
          const nextIndex = Math.floor(Math.random() * messages.length)
          return nextIndex === prevIndex
            ? (nextIndex + 1) % messages.length
            : nextIndex
        })
      }
    }, 150)

    return () => clearInterval(intervalId)
  }, [progress, messages.length])

  const loadingBarWidth = 44 // Match the width of the ASCII art

  return (
    <div className="flex h-screen w-screen items-center justify-center font-mono text-orange-500">
      <div className="whitespace-pre-wrap">
        <pre className="mb-4">{l2beatAsciiArt}</pre>
        <div className="mb-2">
          Loading system components {['|', '/', '-', '\\'][frame]}
        </div>
        <div className="mb-2">
          [
          {new Array(loadingBarWidth)
            .fill('')
            .map((_, i) =>
              i < Math.floor(progress / (100 / loadingBarWidth)) ? '=' : ' ',
            )
            .join('')}
          ] {progress}%
        </div>
        <div className="text-xs">{messages[messageIndex]}</div>
      </div>
    </div>
  )
}
