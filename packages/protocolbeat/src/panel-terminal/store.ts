import { create } from 'zustand'

interface TerminalState {
  output: string
  isRunning: boolean
  addOutput: (text: string) => void
  setIsRunning: (running: boolean) => void
  clear: () => void
}

export const useTerminalStore = create<TerminalState>((set) => ({
  output: '',
  isRunning: false,
  addOutput: (text) => set((state) => ({ output: state.output + text })),
  setIsRunning: (running) => set({ isRunning: running }),
  clear: () => set({ output: '' }),
}))
