import React from 'react'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/types'
import {
  BaseScalingFilters,
  type BaseScalingFiltersState,
} from '../../../_components/base-scaling-filters'

type ScalingFiltersEntry = ScalingDataAvailabilityEntry
export type ScalingDaFiltersState = {
  daLayer: string | undefined
} & BaseScalingFiltersState

interface Props {
  items: ScalingFiltersEntry[]
  state: ScalingDaFiltersState
  setState: React.Dispatch<React.SetStateAction<ScalingDaFiltersState>>
}

export function ScalingLivenessFilters({ items, state, setState }: Props) {
  return <BaseScalingFilters setState={setState} state={state} items={items} />
}
