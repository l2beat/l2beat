import { useQuery, useQueryClient } from '@tanstack/react-query'
import ansiHTML from 'ansi-html'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
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
  const outputRef = useRef<HTMLDivElement>(null)
  const {
    output,
    command,
    matchFlat,
    matchProject,
    discover,
    clear,
    setChain,
    setDevMode,
  } = useTerminalStore()
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
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    if (chains[0] && !command.chain) {
      setChain(chains[0].name)
    }
  }, [chains, command.chain])

  return (
    <div className="flex h-full flex-col p-2 text-sm">
      <div className="sticky top-0 mb-2 flex flex-wrap items-center gap-2">
        <select
          value={command.chain}
          onChange={(e) => setChain(e.target.value)}
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
            checked={command.devMode}
            onChange={(e) => setDevMode(e.target.checked)}
            className="h-4 w-4 appearance-none rounded border border-coffee-200 bg-coffee-800 checked:bg-autumn-300"
          />
          <span className="text-xs">--dev</span>
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              discover(project).then(() => {
                queryClient.invalidateQueries({
                  queryKey: ['projects', project],
                })
              })
            }}
            disabled={command.inFlight}
            className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
          >
            Run discovery
          </button>
          <div className="h-6 w-px bg-coffee-600" />
          <button
            onClick={() => {
              if (selectedAddress !== undefined) {
                matchFlat(project, selectedAddress)
              }
            }}
            disabled={command.inFlight}
            className="bg-autumn-300 px-4 py-1 text-black disabled:opacity-50"
          >
            Match templates
          </button>
          <button
            onClick={() => {
              if (selectedAddress !== undefined) {
                matchProject(project, selectedAddress)
              }
            }}
            disabled={command.inFlight}
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
