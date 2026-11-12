import { create } from 'zustand'
import {
  executeDiscover,
  executeDownloadAllShapes,
  executeFindMinters,
  executeMatchFlat,
} from '../../../api/api'

export type CommandName =
  | 'discovery'
  | 'templateMatch'
  | 'projectMatch'
  | 'shapeDownload'
  | 'minterSearch'

interface CommandState {
  inFlight: boolean
  name?: CommandName
  stream?: EventSource
  settle?: (ok: boolean) => void

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
      state.command.settle?.(false)
      return {
        command: {
          ...state.command,
          stream: undefined,
          settle: undefined,
          inFlight: false,
          name: undefined,
        },
      }
    }),
  matchFlat: (project: string, address: string) => {
    void executeStreaming(get, set, 'templateMatch', () =>
      executeMatchFlat(project, address, 'templates'),
    )
  },
  matchProject: (project: string, address: string) => {
    void executeStreaming(get, set, 'projectMatch', () =>
      executeMatchFlat(project, address, 'projects'),
    )
  },
  downloadAllShapes: () => {
    void executeStreaming(get, set, 'shapeDownload', () =>
      executeDownloadAllShapes(),
    )
  },
  discover: (project: string): Promise<boolean> => {
    return executeStreaming(get, set, 'discovery', () =>
      executeDiscover(project, get().command.devMode),
    )
  },
  findMinters: (address: string) => {
    void executeStreaming(get, set, 'minterSearch', () =>
      executeFindMinters(address),
    )
  },
}))

function executeStreaming(
  get: () => TerminalState,
  set: (
    update: (state: TerminalState) => TerminalState | Partial<TerminalState>,
  ) => void,
  name: CommandName,
  cmd: () => EventSource,
) {
  return new Promise<boolean>((resolve) => {
    if (get().command.inFlight) {
      resolve(false)
      return
    }

    try {
      let stream: EventSource | undefined
      let exitCode: number | undefined

      set((state) => {
        const { command } = state

        const newCommand = {
          ...command,
          stream: cmd(),
          settle: resolve,
          inFlight: true,
          name,
        }
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
          command: {
            ...state.command,
            stream: undefined,
            settle: undefined,
            inFlight: false,
            name: undefined,
          },
        }))
        // Exit code 0 means success, anything else is failure
        // If no exit code was captured, assume failure
        resolve(exitCode === 0)
      }
    } catch (error) {
      set((state) => ({ output: state.output + `Error: ${error}` }))
      set((state) => ({
        command: {
          ...state.command,
          stream: undefined,
          settle: undefined,
          inFlight: false,
          name: undefined,
        },
      }))
      resolve(false)
    }
  })
}
