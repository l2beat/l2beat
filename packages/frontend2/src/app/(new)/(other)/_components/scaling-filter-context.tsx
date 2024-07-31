'use client'

import {
  type Layer2Provider,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type Stage,
} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'

export type ScalingFilterContextValue = {
  rollupsOnly: boolean
  excludeAssociatedTokens: boolean
  category?: ScalingProjectCategory
  stack?: Layer2Provider
  stage?: Stage
  purpose?: ScalingProjectPurpose
  hostChain?: string
  daLayer?: string
}

export type MutableScalingFilterContextValue = ScalingFilterContextValue & {
  set: (value: Partial<ScalingFilterContextValue>) => void
  reset: () => void
}

const ScalingFilterContext = createContext<
  MutableScalingFilterContextValue | undefined
>(undefined)

const defaultValues: ScalingFilterContextValue = {
  rollupsOnly: false,
  excludeAssociatedTokens: false,
  category: undefined,
  stack: undefined,
  stage: undefined,
  purpose: undefined,
  hostChain: undefined,
  daLayer: undefined,
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

export function useScalingFilter() {
  const scalingFilters = useScalingFilterValues()

  const filter = useCallback(
    (entry: CommonScalingEntry) => {
      const checks = [
        scalingFilters.rollupsOnly !== false
          ? entry.category.includes('Rollup')
          : undefined,
        scalingFilters.category !== undefined
          ? entry.category === scalingFilters.category
          : undefined,
        scalingFilters.stack !== undefined
          ? entry.provider === scalingFilters.stack
          : undefined,
        scalingFilters.stage !== undefined
          ? entry.type === 'layer2'
            ? entry.stage?.stage === scalingFilters.stage
            : false
          : undefined,
        scalingFilters.purpose !== undefined
          ? entry.purposes.some((purpose) => purpose === scalingFilters.purpose)
          : undefined,
        scalingFilters.hostChain !== undefined
          ? scalingFilters.hostChain === 'Ethereum'
            ? entry.type === 'layer2'
            : entry.type === 'layer3' &&
              entry.hostChain === scalingFilters.hostChain
          : undefined,
      ].filter(notUndefined)
      return checks.length === 0 || checks.every(Boolean)
    },
    [scalingFilters],
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

  const contextValue = useMemo(
    () => ({ ...value, set, reset }),
    [value, set, reset],
  )

  return (
    <ScalingFilterContext.Provider value={contextValue}>
      {children}
    </ScalingFilterContext.Provider>
  )
}
