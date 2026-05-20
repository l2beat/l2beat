import type { BackendRouterOutputs } from '@l2beat/backend/trpc'

export type InteropConfigSummary =
  BackendRouterOutputs['interop']['config']['summary']
export type ChainMetadata =
  BackendRouterOutputs['interop']['chains']['metadata'][number]

export interface AggregationConfigRow {
  id: string
  name: string
  type: string
  plugins: string[]
  pluginsText: string
  bridgeTypes: string[]
  bridgeTypesText: string
  chains: string[]
  chainsText: string
  durationSplitCount: number
  isAggregate: boolean
  subgroupId: string | null
  rawConfig: InteropConfigSummary['aggregation']['configs'][number]
}
