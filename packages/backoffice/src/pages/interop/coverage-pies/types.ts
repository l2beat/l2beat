import type { BackendRouterOutputs } from '@l2beat/backend/trpc'

export type CoveragePiesData =
  BackendRouterOutputs['interop']['coveragePies']['data']
export type CoveragePieChart = CoveragePiesData['charts'][number]
export type CoveragePieSlice = CoveragePieChart['slices'][number]
