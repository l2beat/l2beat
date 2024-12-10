import { useQuery, useQueryClient } from '@tanstack/react-query'
import ansiHTML from 'ansi-html'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { executeDiscover, executeMatchFlat, getProject } from '../api/api'
import { usePanelStore } from '../store/store'
import { useTerminalStore } from './store'

ansiHTML.setColors({
  reset: ['F0D8BD', '1D1816'], // [fg, bg]
  black: '000000',
  red: 'FB4A35',
  green: '9DDE6C',
  yellow: 'FABD30',
  blue: '8B8BE8',
  magenta: 'a73db5',
  cyan: '1c92a8',
  lightgrey: 'D3D3D3',
  darkgrey: 'A9A9A9',
})

export function TerminalPanel() {
  const queryClient = useQueryClient()
  const { project } = useParams()
  const [discoveryChain, setDiscoveryChain] = useState<string | undefined>(
    undefined,
  )
  const [devMode, setDevMode] = useState(false)
  const abortControllerRef = useRef<AbortController>()
  const outputRef = useRef<HTMLDivElement>(null)
  const { output, isRunning, addOutput, setIsRunning, clear } =
    useTerminalStore()
  const selectedAddress = usePanelStore((state) => state.selected)

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

  async function executeCommandWithStreaming(cmd: () => EventSource) {
    if (isRunning) return
    clear()
    setIsRunning(true)

    try {
      const eventSource = cmd()
      abortControllerRef.current = new AbortController()

      eventSource.onmessage = (event) => {
        const encoded = event.data.toString()
        const text = encoded.replace(/\\n/g, '\n')
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

  async function handleExecute() {
    if (!project || !discoveryChain) return
    await executeCommandWithStreaming(() =>
      executeDiscover(project, discoveryChain, devMode),
    )
  }

  async function handleMatchTemplates() {
    if (!project || !discoveryChain || !selectedAddress) return
    await executeCommandWithStreaming(() =>
      executeMatchFlat(project, selectedAddress, 'templates'),
    )
  }

  async function handleMatchProjects() {
    if (!project || !discoveryChain || !selectedAddress) return
    await executeCommandWithStreaming(() =>
      executeMatchFlat(project, selectedAddress, 'projects'),
    )
  }

  return (
    <div className="flex h-full flex-col p-2 text-sm">
      <div className="sticky top-0 mb-2 flex flex-wrap items-center gap-2">
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
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={devMode}
            onChange={(e) => setDevMode(e.target.checked)}
            className="h-4 w-4 appearance-none rounded border border-coffee-200 bg-coffee-800 checked:bg-autumn-300"
          />
          <span className="text-xs">--dev</span>
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExecute}
            disabled={isRunning}
            className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
          >
            Run discovery
          </button>
          <div className="h-6 w-px bg-coffee-600" />
          <button
            onClick={handleMatchTemplates}
            disabled={isRunning || !selectedAddress}
            className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
          >
            Match templates
          </button>
          <button
            onClick={handleMatchProjects}
            disabled={isRunning || !selectedAddress}
            className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
          >
            Match projects
          </button>
        </div>
      </div>
      <div
        ref={outputRef}
        className="flex-1 overflow-auto whitespace-pre bg-coffee-900 p-2 font-mono text-gray-300"
        dangerouslySetInnerHTML={{
          __html: ansiHTML(output),
        }}
      />
    </div>
  )
}
