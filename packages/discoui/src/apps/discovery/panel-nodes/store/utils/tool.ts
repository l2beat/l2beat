import type { State, Tool } from '../State'

// Holding space borrows the hand tool without leaving the selection tool, so
// releasing the key goes straight back to selecting.
export function effectiveTool(state: Pick<State, 'tool' | 'input'>): Tool {
  return state.input.spacePressed ? 'hand' : state.tool
}
