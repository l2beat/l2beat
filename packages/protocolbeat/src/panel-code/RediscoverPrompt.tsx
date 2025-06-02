import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useTerminalStore } from '../panel-terminal/store'

export interface RediscoverPromptProps {
  chain: string
}

export function RediscoverPrompt({ chain }: RediscoverPromptProps) {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const queryClient = useQueryClient()
  const { command, discover, setChain, setDevMode } = useTerminalStore()

  return (
    <div className="flex h-1/3 flex-col items-center justify-center gap-4 border border-coffee-500 bg-coffee-900 px-8 py-6 text-center">
      <div className="font-medium text-coffee-100 text-xl">
        No source for this contract
      </div>
      <div className="text-coffee-300 text-sm">
        Unable to find the flat file with source code.
        <br />
        Rediscovering should fix this issue.
      </div>
      <button
        className="mt-2 rounded bg-autumn-300 px-6 py-2 font-medium text-black transition-colors hover:bg-autumn-300 disabled:opacity-50"
        onClick={() => {
          setChain(chain)
          setDevMode(true)
          discover(project).then(() => {
            queryClient.invalidateQueries({
              queryKey: ['projects', project],
            })
          })
        }}
        disabled={command.inFlight}
      >
        Rediscover contract
      </button>
    </div>
  )
}
