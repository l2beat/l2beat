import { create } from 'zustand'
import { executeDiscover, executeMatchFlat } from '../api/api'

interface CommandState {
  inFlight: boolean
  stream?: EventSource

  chain?: string
  devMode: boolean
}

interface TerminalState {
  output: string
  command: CommandState
  addOutput: (text: string) => void
  clear: () => void

  setChain: (chain: string) => void
  setDevMode: (devMode: boolean) => void

  killCommand: () => void
  matchFlat: (project: string, address: string) => Promise<void>
  matchProject: (project: string, address: string) => Promise<void>
  discover: (project: string) => Promise<void>
}

export const useTerminalStore = create<TerminalState>((set) => ({
  output: '',
  command: {
    inFlight: false,
    devMode: false,
  },
  addOutput: (text) => set((state) => ({ output: state.output + text })),
  clear: () => set({ output: '' }),

  setChain: (chain: string) =>
    set((state) => ({ command: { ...state.command, chain } })),
  setDevMode: (devMode: boolean) =>
    set((state) => ({ command: { ...state.command, devMode } })),

  killCommand: () =>
    set((state) => {
      state.command.stream?.close()
      return {
        command: { ...state.command, stream: undefined, inFlight: false },
      }
    }),
  matchFlat: async (project: string, address: string) => {
    executeStreaming(set, () => executeMatchFlat(project, address, 'templates'))
  },
  matchProject: async (project: string, address: string) => {
    executeStreaming(set, () => executeMatchFlat(project, address, 'projects'))
  },
  discover: async (project: string) =>
    set((state) => {
      const chain = state.command.chain
      if (chain === undefined) {
        return {}
      }

      executeStreaming(set, () =>
        executeDiscover(project, chain, state.command.devMode),
      )

      return {}
    }),
}))

async function executeStreaming(
  set: (
    update: (state: TerminalState) => TerminalState | Partial<TerminalState>,
  ) => void,
  cmd: () => EventSource,
) {
  try {
    let stream: EventSource | undefined
    set((state) => {
      const { command } = state
      if (command.chain === undefined) {
        return state
      }

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
    }

    // This is a known quirk of the SSE protocol - normal completion and
    // errors both go through the error handler
    stream.onerror = () => {
      stream?.close()
      set((state) => ({
        command: { ...state.command, stream: undefined, inFlight: false },
      }))
    }
  } catch (error) {
    console.log('Catch error', error)
    set((state) => ({ output: state.output + `Error: ${error}` }))
    set((state) => ({
      command: { ...state.command, stream: undefined, inFlight: false },
    }))
  }
}
