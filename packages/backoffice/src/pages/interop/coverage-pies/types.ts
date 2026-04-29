import type { BackendRouterOutputs } from '@l2beat/backend/backoffice-trpc'

export type CoveragePiesData = BackendRouterOutputs['coveragePies']['data']
export type CoveragePieChart = CoveragePiesData['charts'][number]
export type CoveragePieSlice = CoveragePieChart['slices'][number]
