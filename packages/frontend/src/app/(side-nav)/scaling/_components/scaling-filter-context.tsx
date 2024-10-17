'use client'

import {
  type BadgeId,
  type Layer2Provider,
  type Layer3Provider,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type StageConfig,
} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/types'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { type ScalingLivenessEntry } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { type ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'

export type ScalingFilterContextValue = {
  rollupsOnly: boolean
  category?: ScalingProjectCategory
  stack?: Layer2Provider | Layer3Provider | 'No stack'
  stage?: StageConfig['stage']
  purpose?: ScalingProjectPurpose
  hostChain?: string
  daLayer?: string
  badgeRaaS?: BadgeId
}

export type MutableScalingFilterContextValue = ScalingFilterContextValue & {
  isEmpty: boolean
  set: (value: Partial<ScalingFilterContextValue>) => void
  reset: () => void
}

const ScalingFilterContext = createContext<
  MutableScalingFilterContextValue | undefined
>(undefined)

const defaultValues: ScalingFilterContextValue = {
  rollupsOnly: false,
  category: undefined,
  stack: undefined,
  stage: undefined,
  purpose: undefined,
  hostChain: undefined,
  daLayer: undefined,
  // badges
  badgeRaaS: undefined,
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

type ScalingEntry =
  | ScalingRiskEntry
  | ScalingFinalityEntry
  | ScalingDataAvailabilityEntry
  | ScalingSummaryEntry
  | ScalingCostsEntry
  | ScalingTvlEntry
  | ScalingLivenessEntry
  | ScalingActivityEntry
  | ScalingArchivedEntry
export function useScalingFilter() {
  const scalingFilters = useScalingFilterValues()

  const filter = useCallback(
    (entry: ScalingEntry) => {
      const checks = [
        scalingFilters.rollupsOnly !== false
          ? entry.category?.includes('Rollup')
          : undefined,
        scalingFilters.category !== undefined
          ? entry.category === scalingFilters.category
          : undefined,
        scalingFilters.stack !== undefined
          ? entry.provider ===
            (scalingFilters.stack === 'No stack'
              ? undefined
              : scalingFilters.stack)
          : undefined,
        scalingFilters.stage !== undefined
          ? entry.stage?.stage === scalingFilters.stage
          : undefined,
        scalingFilters.purpose !== undefined
          ? entry.purposes?.some(
              (purpose) => purpose === scalingFilters.purpose,
            )
          : undefined,
        scalingFilters.hostChain !== undefined
          ? scalingFilters.hostChain === 'Ethereum'
            ? entry.type === 'layer2'
            : entry.type === 'layer3' &&
              entry.hostChain === scalingFilters.hostChain
          : undefined,
        scalingFilters.daLayer !== undefined
          ? entry.entryType === 'data-availability'
            ? entry.dataAvailability.layer.value === scalingFilters.daLayer
            : undefined
          : undefined,
        // Badges
        scalingFilters.badgeRaaS
          ? entry.badges?.some(
              (badge) => badge.badge === scalingFilters.badgeRaaS,
            )
          : undefined,
      ].filter(notUndefined)
      return checks.length === 0 || checks.every(Boolean)
    },
    [scalingFilters],
  )

  return filter
}

export function useScalingUpcomingFilter() {
  const scalingFilters = useScalingFilterValues()

  const filter = useCallback(
    (entry: ScalingUpcomingEntry) => {
      const checks = [
        scalingFilters.rollupsOnly !== false
          ? entry.category?.includes('Rollup')
          : undefined,
        scalingFilters.category !== undefined
          ? entry.category === scalingFilters.category
          : undefined,
        scalingFilters.stack !== undefined
          ? entry.provider === scalingFilters.stack
          : undefined,
        scalingFilters.purpose !== undefined
          ? entry.purposes.some((purpose) => purpose === scalingFilters.purpose)
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
