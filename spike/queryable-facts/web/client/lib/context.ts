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
  relation?: string
  factRef?: RowRef
  derivedRelation?: string
  /** Step 3 filters: facts that came from one AST node / one source line. */
  filterNodeId?: number
  filterLine?: number
  /** Step 4: scroll to the card of this relation. */
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
