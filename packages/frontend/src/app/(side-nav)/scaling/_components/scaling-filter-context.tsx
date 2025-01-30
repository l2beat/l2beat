'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { FilterableScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'

export type ScalingFilterContextValue = {
  rollupsOnly: boolean
  type?: string
  stack?: string
  stage?: string
  purpose?: string
  hostChain?: string
  daLayer?: string
  raas?: string
}

type MutableScalingFilterContextValue = ScalingFilterContextValue & {
  isEmpty: boolean
  set: (value: Partial<ScalingFilterContextValue>) => void
  reset: () => void
}

const ScalingFilterContext = createContext<
  MutableScalingFilterContextValue | undefined
>(undefined)

const defaultValues: ScalingFilterContextValue = {
  rollupsOnly: false,
  type: undefined,
  stack: undefined,
  stage: undefined,
  purpose: undefined,
  hostChain: undefined,
  daLayer: undefined,
  raas: undefined,
}

export function useScalingFilterValues() {
  const context = useContext(ScalingFilterContext)
  if (!context) {
    throw new Error(
      'useScalingFilterContext must be used within a ScalingFilterContextProvider',
    )
  }
  return context
}

export function useOptionalScalingFilterValues() {
  const context = useContext(ScalingFilterContext)
  return context
}

export function useScalingFilter() {
  const filters = useScalingFilterValues()
  const filter = useCallback(
    ({ filterable }: FilterableScalingEntry) => {
      if (!filterable) {
        // Ethereum
        return true
      }
      return (
        (!filters.rollupsOnly || filterable.isRollup) &&
        (!filters.type || filters.type === filterable.type) &&
        (!filters.stack || filters.stack === filterable.stack) &&
        (!filters.stage || filters.stage === filterable.stage) &&
        (!filters.purpose || filterable.purposes.includes(filters.purpose)) &&
        (!filters.hostChain || filters.hostChain === filterable.hostChain) &&
        (!filters.daLayer || filters.daLayer === filterable.daLayer) &&
        (!filters.raas || filters.raas === filterable.raas)
      )
    },
    [filters],
  )
  return filter
}

export function ScalingFilterContextProvider({
  children,
}: { children: React.ReactNode }) {
  const [value, setValue] = useState<ScalingFilterContextValue>(defaultValues)

  const set = useCallback(
    (newValue: Partial<ScalingFilterContextValue>) => {
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
    <ScalingFilterContext.Provider value={contextValue}>
      {children}
    </ScalingFilterContext.Provider>
  )
}
