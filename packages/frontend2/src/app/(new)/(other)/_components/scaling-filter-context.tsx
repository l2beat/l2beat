'use client'

import {
  type Layer2Provider,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type Stage,
} from '@l2beat/config'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

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

export function useScalingFilter() {
  const context = useContext(ScalingFilterContext)
  if (!context) {
    throw new Error(
      'useScalingFilterContext must be used within a ScalingFilterContextProvider',
    )
  }
  return context
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
