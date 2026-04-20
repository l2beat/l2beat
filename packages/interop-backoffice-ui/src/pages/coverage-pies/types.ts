import type { RouterOutputs } from '@l2beat/backend/interop-trpc'

export type CoveragePiesData = RouterOutputs['coveragePies']['data']
export type CoveragePieChart = CoveragePiesData['charts'][number]
export type CoveragePieSlice = CoveragePieChart['slices'][number]
