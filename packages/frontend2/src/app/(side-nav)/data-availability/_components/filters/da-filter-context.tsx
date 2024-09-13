'use client'
import { notUndefined } from '@l2beat/shared-pure'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'

export type DaFilterContextValue = {
  layerType?: string
}

export type MutableDaFilterContextValue = DaFilterContextValue & {
  isEmpty: boolean
  set: (value: Partial<DaFilterContextValue>) => void
  reset: () => void
}

const DaFilterContext = createContext<MutableDaFilterContextValue | undefined>(
  undefined,
)

const defaultValues: DaFilterContextValue = {
  layerType: undefined,
}

export function useDaFilterValues() {
  const context = useContext(DaFilterContext)
  if (!context) {
    throw new Error(
      'useDaFilterValues must be used within a DaFilterContextProvider',
    )
  }

  return context
}

export type CommonDaEntry = DaSummaryEntry | DaRiskEntry

export function useDaFilter() {
  const daFilters = useDaFilterValues()

  const filter = useCallback(
    (entry: CommonDaEntry) => {
      const checks = [
        daFilters.layerType !== undefined
          ? entry.layerType === daFilters.layerType
          : undefined,
      ].filter(notUndefined)
      return checks.length === 0 || checks.every(Boolean)
    },
    [daFilters],
  )

  return filter
}

export function DaFilterContextProvider({
  children,
}: { children: React.ReactNode }) {
  const [value, setValue] = useState<DaFilterContextValue>(defaultValues)

  const set = useCallback(
    (newValue: Partial<DaFilterContextValue>) => {
      setValue((prev) => ({ ...prev, ...newValue }))
    },
    [setValue],
  )

  const reset = useCallback(() => setValue(defaultValues), [setValue])

  const isEmpty = useMemo(() => {
    return (Object.keys(defaultValues) as (keyof typeof defaultValues)[]).every(
      (key) => value[key] === defaultValues[key],
    )
  }, [value])

  const contextValue = useMemo(
    () => ({ ...value, set, reset, isEmpty }),
    [value, set, reset, isEmpty],
  )

  return (
    <DaFilterContext.Provider value={contextValue}>
      {children}
    </DaFilterContext.Provider>
  )
}
