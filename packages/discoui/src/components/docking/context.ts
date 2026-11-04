import { createContext, useContext } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import type { DockingStore } from './store'
import { assert } from './tree'

export type DockingHook = UseBoundStore<StoreApi<DockingStore>>

const DockingContext = createContext<DockingHook | null>(null)

export const DockingProvider = DockingContext.Provider

export function useDockingHook(): DockingHook {
  const hook = useContext(DockingContext)
  assert(hook !== null, 'useDockingHook called outside <Docking>')
  return hook
}
