import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { executeCommand, getProject } from '../api/api'
import { useTerminalStore } from './store'

export function TerminalPanel() {
  const queryClient = useQueryClient()
  const { project } = useParams()
  const [discoveryChain, setDiscoveryChain] = useState<string | undefined>(
    undefined,
  )
  const abortControllerRef = useRef<AbortController>()
  const outputRef = useRef<HTMLDivElement>(null)
  const { output, isRunning, addOutput, setIsRunning, clear } =
    useTerminalStore()

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const getProjectResponse = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const chains = getProjectResponse.data?.chains ?? []

  useEffect(() => {
    clear()
  }, [])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      abortControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    if (chains[0] && !discoveryChain) {
      setDiscoveryChain(chains[0].name)
    }
  }, [chains, discoveryChain])

  async function handleExecute() {
    if (!project || !discoveryChain || isRunning) return
    clear()
    setIsRunning(true)

    try {
      const eventSource = executeCommand('discover', project, discoveryChain)
      abortControllerRef.current = new AbortController()

      eventSource.onmessage = (event) => {
        const text = event.data.toString()
        addOutput(text.endsWith('\n') ? text : text + '\n')
      }

      // This is a known quirk of the SSE protocol - normal completion and
      // errors both go through the error handler
      eventSource.onerror = () => {
        eventSource.close()
        setIsRunning(false)
        queryClient.invalidateQueries({ queryKey: ['projects', project] })
      }

      abortControllerRef.current.signal.addEventListener('abort', () => {
        eventSource.close()
      })
    } catch (error) {
      addOutput(`Error: ${error}`)
      setIsRunning(false)
    }
  }

  return (
    <div className="flex h-full flex-col p-2 text-sm">
      <div className="sticky top-0 mb-2 flex gap-2">
        <select
          value={discoveryChain}
          onChange={(e) => setDiscoveryChain(e.target.value)}
          className="border bg-coffee-800 p-1 font-bold text-xs uppercase"
        >
          {chains.map((chain, i) => (
            <option key={i} value={chain.name}>
              {chain.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleExecute}
          disabled={isRunning}
          className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
        >
          Run discovery
        </button>
      </div>
      <div
        ref={outputRef}
        className="flex-1 overflow-auto whitespace-pre bg-black p-2 font-mono text-gray-300"
      >
        {output}
      </div>
    </div>
  )
}
