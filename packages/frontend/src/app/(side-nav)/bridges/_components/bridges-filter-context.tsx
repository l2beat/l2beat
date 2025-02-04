'use client'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { CommonBridgesEntry } from '~/server/features/bridges/get-common-bridges-entry'

export type BridgesFilterContextValue = {
  validatedBy?: string
  type?: string
}

type MutableBridgesFilterContextValue = BridgesFilterContextValue & {
  set: (value: Partial<BridgesFilterContextValue>) => void
  reset: () => void
}

const BridgesFilterContext = createContext<
  MutableBridgesFilterContextValue | undefined
>(undefined)

const defaultValues: BridgesFilterContextValue = {
  type: undefined,
  validatedBy: undefined,
}

export function useBridgesFilterValues() {
  const context = useContext(BridgesFilterContext)
  if (!context) {
    throw new Error(
      'useBridgesFilterValues must be used within a BridgesFilterContextProvider',
    )
  }
  return context
}

export function useOptionalBridgesFilterValues() {
  const context = useContext(BridgesFilterContext)
  return context
}

export function useBridgesFilter() {
  const filters = useBridgesFilterValues()

  const filter = useCallback(
    ({ filterable }: CommonBridgesEntry) => {
      return (
        (!filters.type || filters.type === filterable.type) &&
        (!filters.validatedBy || filters.validatedBy === filterable.validatedBy)
      )
    },
    [filters],
  )

  return filter
}

export function BridgesFilterContextProvider({
  children,
}: { children: React.ReactNode }) {
  const [value, setValue] = useState<BridgesFilterContextValue>(defaultValues)

  const set = useCallback(
    (newValue: Partial<BridgesFilterContextValue>) => {
      setValue((prev) => ({ ...prev, ...newValue }))
    },
    [setValue],
  )

  const reset = useCallback(() => setValue(defaultValues), [setValue])

  const contextValue = useMemo(
    () => ({ ...value, set, reset }),
    [value, set, reset],
  )

  return (
    <BridgesFilterContext.Provider value={contextValue}>
      {children}
    </BridgesFilterContext.Provider>
  )
}
