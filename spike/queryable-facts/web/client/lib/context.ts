import { createContext, useContext } from 'react'
import type { AstNode } from '../../shared/types'
import type { Range, RowRef, RunIndex } from './run'

/** What the user is looking at; shared across steps so a click in one step can be followed in another. */
export interface Nav {
  step: number
  /** Range highlighted in the source pane. */
  range?: Range
  /** Line the source pane should scroll to; `nonce` forces a re-scroll to the same line. */
  line?: number
  nonce: number
  astNode?: AstNode
  /** Step 3: base relation being browsed, and the node whose rows are listed. */
  baseRelation?: string
  baseNodeId?: number
  baseLine?: number
  /** Step 4: concept relation being browsed, pinned row, and filters by node / line. */
  relation?: string
  factRef?: RowRef
  filterNodeId?: number
  filterLine?: number
  /** Step 6: derived relation being browsed. */
  derivedRelation?: string
  /** Steps 4/5: scroll to the card of this relation. */
  focusRelation?: string
}

export interface Ctx {
  index: RunIndex
  nav: Nav
  setNav: (patch: Partial<Nav>) => void
  /** Highlight a range in the source and scroll to it. */
  showRange: (range: Range | undefined) => void
  showId: (id: string) => void
}

export const RunContext = createContext<Ctx | undefined>(undefined)

export function useRun(): Ctx {
  const ctx = useContext(RunContext)
  if (!ctx) throw new Error('useRun outside RunContext')
  return ctx
}
