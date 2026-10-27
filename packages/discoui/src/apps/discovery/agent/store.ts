import { create } from 'zustand'
import type { BoardEvent } from '../panel-board/boardApi'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { usePanelStore } from '../store/panel-store'
import type { AgentViewEvent } from './viewStore'

export interface AgentCodeMatch {
  sourceIndex: number
  sourceName: string
  offset: number
  line: number
  contract?: string
}

export interface AgentCode extends AgentCodeMatch {
  address: string
  length: number
  others: AgentCodeMatch[]
}

export interface AgentStep {
  note: string
  paths: string[][]
  nodes: string[]
  select?: string
  code?: AgentCode
}

export interface AgentShow {
  type: 'show'
  id: string
  project: string
  steps: AgentStep[]
  // Sent to a tab that connects after the show, so it must not navigate.
  replay?: boolean
}

export type AgentEvent =
  | AgentShow
  | AgentViewEvent
  | BoardEvent
  | { type: 'clear' }
  | { type: 'discard'; id: string }

export type AgentView = 'path' | 'graph'

// Kept apart from the researcher's own highlighting. Steps do select their
// contract, so the selection from before the agent is put back on dismiss,
// unless the researcher picked something else meanwhile.
export interface AgentFocus {
  // Changes with every step shown, so views can react once per step.
  key: string
  project: string
  step: AgentStep
  stepIndex: number
  stepCount: number
  nodes: ReadonlySet<string>
}

interface State {
  show: AgentShow | undefined
  focus: AgentFocus | undefined
  view: AgentView
  // The note covers the top of the full graph, so fitting leaves it room.
  noteHeightPx: number
  // The step the full graph was last fitted to. A step is fitted once, so
  // the researcher can pan away, and zooming to one contract claims it.
  graphFittedKey: string | undefined
  selectionBefore: string[] | undefined
  // What the agent selected last, to tell it from the researcher's picks.
  agentSelection: string | undefined
  start: (show: AgentShow) => void
  goToStep: (index: number) => void
  setView: (view: AgentView) => void
  setNoteHeight: (heightPx: number) => void
  selectForAgent: (address: string) => void
  clear: () => void
}

export const useAgentStore = create<State>((set, get) => ({
  show: undefined,
  focus: undefined,
  view: 'path',
  noteHeightPx: 0,
  graphFittedKey: undefined,
  selectionBefore: undefined,
  agentSelection: undefined,
  start: (show) =>
    set((state) => ({
      show,
      focus: toFocus(show, 0),
      view: 'path',
      selectionBefore:
        state.show === undefined
          ? usePanelStore.getState().selected
          : state.selectionBefore,
    })),
  goToStep: (index) => {
    const show = get().show
    if (show === undefined || index < 0 || index >= show.steps.length) {
      return
    }
    set({ focus: toFocus(show, index) })
  },
  setView: (view) => set({ view }),
  setNoteHeight: (noteHeightPx) => set({ noteHeightPx }),
  selectForAgent: (address) => {
    usePanelStore.getState().select([address])
    set({ agentSelection: address })
  },
  clear: () => {
    const { selectionBefore, agentSelection } = get()
    const selected = usePanelStore.getState().selected
    const untouched = selected.length === 1 && selected[0] === agentSelection
    if (selectionBefore !== undefined && untouched) {
      usePanelStore.getState().select(selectionBefore)
    }
    set({
      show: undefined,
      focus: undefined,
      selectionBefore: undefined,
      agentSelection: undefined,
    })
  },
}))

// Closing the agent in one tab closes it everywhere, and a reload won't bring
// it back.
export function dismissAgent() {
  useAgentStore.getState().clear()
  fetch('/api/agent/clear', { method: 'POST' }).catch((error) =>
    console.warn('Agent dismiss not sent', { error }),
  )
}

// Fits the full graph to contracts the agent points at, below its note.
// Selecting centers the selected node at the old scale on the next frame, and
// a note that just appeared is measured after that frame's layout, so the fit
// waits two frames.
export function fitGraphTo(ids: ReadonlySet<string>) {
  useAgentStore.setState({
    graphFittedKey: useAgentStore.getState().focus?.key,
  })
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      useNodeStore
        .getState()
        .fitToNodes(ids, useAgentStore.getState().noteHeightPx),
    ),
  )
}

export function toFocus(show: AgentShow, stepIndex: number): AgentFocus {
  const step = show.steps[stepIndex]
  if (step === undefined) {
    throw new Error('Step out of range')
  }
  return {
    key: `${show.id}:${stepIndex}`,
    project: show.project,
    step,
    stepIndex,
    stepCount: show.steps.length,
    nodes: focusedContracts(step),
  }
}

// A step that only points at code still focuses the contract it shows.
function focusedContracts(step: AgentStep): Set<string> {
  const shown = new Set([...step.paths.flat(), ...step.nodes])
  if (shown.size > 0) {
    return shown
  }
  return new Set([step.select ?? step.code?.address ?? []].flat())
}
