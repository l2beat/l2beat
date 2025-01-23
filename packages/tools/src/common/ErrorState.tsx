import { l2beatAsciiArt } from './LoadingState'

export function ErrorState() {
  const loadingBarWidth = 44

  return (
    <div className="flex h-screen w-screen items-center justify-center font-mono text-red-500">
      <div className="whitespace-pre-wrap">
        <pre className="mb-4">{l2beatAsciiArt}</pre>
        <div className="mb-2 text-red-500">ERROR: System Malfunction</div>
        <div className="mb-2 text-red-500">
          [{new Array(loadingBarWidth).fill('X').join('')}]
        </div>
        <div className="break-words text-red-500 text-xs">
          Report this error to the L2BEAT team.
        </div>
      </div>
    </div>
  )
}
