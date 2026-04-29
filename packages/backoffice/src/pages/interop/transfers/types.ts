import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/trpc'

export type TransferStatsRow =
  BackendRouterOutputs['interop']['transfers']['stats'][number]
export type TransferDetailsRow =
  BackendRouterOutputs['interop']['transfers']['details'][number]
export type TransferPairRow = TransferStatsRow['chains'][number]
export type ChainMetadata =
  BackendRouterOutputs['interop']['chains']['metadata'][number]
export type TransferDetailsInput =
  BackendRouterInputs['interop']['transfers']['details']
