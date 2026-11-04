import { v as z } from '@l2beat/validate'
import { create } from 'zustand'

const agentStepSchema = z.object({
  note: z.string(),
  // The code contract first: the code panel shows the first selected one.
  select: z.array(z.string()),
  code: z
    .object({
      address: z.string(),
      sourceIndex: z.number(),
      offset: z.number(),
      length: z.number(),
    })
    .optional(),
})
export type AgentStep = z.infer<typeof agentStepSchema>

const agentShowSchema = z.object({
  type: z.literal('show'),
  id: z.string(),
  project: z.string(),
  steps: z.array(agentStepSchema),
})
export type AgentShow = z.infer<typeof agentShowSchema>

export const agentEventSchema = z.union([
  agentShowSchema,
  z.object({ type: z.literal('clear') }),
])
export type AgentEvent = z.infer<typeof agentEventSchema>

interface State {
  show: AgentShow | undefined
  index: number
  start: (show: AgentShow) => void
  goTo: (index: number) => void
  clear: () => void
}

export const useAgentStore = create<State>((set, get) => ({
  show: undefined,
  index: 0,
  start: (show) => set({ show, index: 0 }),
  goTo: (index) => {
    const show = get().show
    if (show !== undefined && isStepIndex(index, show.steps.length)) {
      set({ index })
    }
  },
  clear: () => set({ show: undefined, index: 0 }),
}))

export function isStepIndex(index: number, stepCount: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < stepCount
}
