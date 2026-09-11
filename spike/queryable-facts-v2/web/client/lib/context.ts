import { createContext, useContext } from 'react'
import type { RelationRecord, RunInfo } from '../../shared/types'

export type Screen = 1 | 2 | 3

export interface AppCtx {
  runId: string
  run: RunInfo
  relation: (name: string) => RelationRecord | undefined
  /** Shows the proof of an atom (text form) in the proof drawer. */
  why: (atom: string, ask?: string) => void
  /** Goes to the rules screen focused on a relation. */
  showRelation: (name: string) => void
  /** Goes to the inputs screen focused on a unit. */
  showUnit: (slug: string) => void
}

export const AppContext = createContext<AppCtx | undefined>(undefined)

export function useApp(): AppCtx {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('no run in context')
  return ctx
}

/** Sections whose relations are naming or tree-walking helpers: folded in proofs unless asked. */
export function isPlumbing(rec: RelationRecord | undefined): boolean {
  if (!rec) return false
  return /^1[acdj]\./.test(rec.section)
}
