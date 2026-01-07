import { create } from 'zustand'
import {
  executeDiscover,
  executeDownloadAllShapes,
  executeFindMinters,
  executeMatchFlat,
  executeGeneratePermissionsReport,
  executeFetchFunds,
  executeGenerateCallGraph,
} from '../../../api/api'

interface CommandState {
  inFlight: boolean
  stream?: EventSource

  devMode: boolean
}

interface TerminalState {
  output: string
  command: CommandState
  addOutput: (text: string) => void
  clear: () => void

  setDevMode: (devMode: boolean) => void

  killCommand: () => void
  matchFlat: (project: string, address: string) => void
  matchProject: (project: string, address: string) => void
  discover: (project: string) => Promise<boolean>
  downloadAllShapes: () => void
  findMinters: (address: string) => void
  generatePermissionsReport: (project: string) => void
  fetchFunds: (project: string) => void
  generateCallGraph: (project: string) => void
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  output: '',
  command: {
    inFlight: false,
    devMode: false,
  },
  addOutput: (text) => set((state) => ({ output: state.output + text })),
  clear: () => set({ output: '' }),

  setDevMode: (devMode: boolean) =>
    set((state) => ({ command: { ...state.command, devMode } })),

  killCommand: () =>
    set((state) => {
      state.command.stream?.close()
      return {
        command: { ...state.command, stream: undefined, inFlight: false },
      }
    }),
  matchFlat: (project: string, address: string) => {
    executeStreaming(get, set, () =>
      executeMatchFlat(project, address, 'templates'),
    )
  },
  matchProject: (project: string, address: string) => {
    executeStreaming(get, set, () =>
      executeMatchFlat(project, address, 'projects'),
    )
  },
  downloadAllShapes: () => {
    executeStreaming(get, set, () => executeDownloadAllShapes())
  },
  discover: (project: string): Promise<boolean> => {
    return executeStreaming(get, set, () =>
      executeDiscover(project, get().command.devMode),
    )
  },
  findMinters: (address: string) => {
    executeStreaming(get, set, () => executeFindMinters(address))
  },
  generatePermissionsReport: (project: string) => {
    executeStreaming(set, () => executeGeneratePermissionsReport(project))
  },
  fetchFunds: (project: string) => {
    executeStreaming(set, () => executeFetchFunds(project))
  },
  generateCallGraph: (project: string) => {
    executeStreaming(set, () => executeGenerateCallGraph(project))
  },
}))

function executeStreaming(
  get: () => TerminalState,
  set: (
    update: (state: TerminalState) => TerminalState | Partial<TerminalState>,
  ) => void,
  cmd: () => EventSource,
) {
  return new Promise<boolean>((resolve, reject) => {
    if (get().command.inFlight) {
      return
    }

    try {
      let stream: EventSource | undefined
      let exitCode: number | undefined

      set((state) => {
        const { command } = state

        const newCommand = { ...command, stream: cmd(), inFlight: true }
        stream = newCommand.stream
        return { command: newCommand }
      })

      if (stream === undefined) {
        return
      }

      set((state) => ({
        output: '',
        command: { ...state.command, inFlight: true },
      }))

      stream.onmessage = (event) => {
        const encoded = event.data.toString()
        const text = encoded.replace(/\\n/g, '\n')
        const toAdd = text.endsWith('\n') ? text : text + '\n'
        set((state) => ({ output: state.output + toAdd }))

        // Parse exit code from command output
        const exitCodeMatch = text.match(/Process exited with code (\d+)/)
        if (exitCodeMatch) {
          exitCode = Number.parseInt(exitCodeMatch[1], 10)
        }
      }

      // This is a known quirk of the SSE protocol - normal completion and
      // errors both go through the error handler
      stream.onerror = () => {
        stream?.close()
        set((state) => ({
          command: { ...state.command, stream: undefined, inFlight: false },
        }))
        // Exit code 0 means success, anything else is failure
        // If no exit code was captured, assume failure
        resolve(exitCode === 0)
      }
    } catch (error) {
      console.log('Catch error', error)
      set((state) => ({ output: state.output + `Error: ${error}` }))
      set((state) => ({
        command: { ...state.command, stream: undefined, inFlight: false },
      }))
      reject(error)
    }
  })
}
