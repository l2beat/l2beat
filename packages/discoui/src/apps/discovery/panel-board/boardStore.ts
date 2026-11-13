import { create } from 'zustand'
import type { ApiAgentBoard } from '../../../api/types'

interface State {
  board: ApiAgentBoard | undefined
  set: (board: ApiAgentBoard | undefined) => void
}

// The agent writes the board and the tab only draws it: the server keeps
// it and sends it again after a reload.
export const useBoardStore = create<State>((set) => ({
  board: undefined,
  set: (board) => set({ board }),
}))
