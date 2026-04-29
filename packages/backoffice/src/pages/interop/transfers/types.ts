import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/backoffice-trpc'

export type TransferStatsRow =
  BackendRouterOutputs['transfers']['stats'][number]
export type TransferDetailsRow =
  BackendRouterOutputs['transfers']['details'][number]
export type TransferPairRow = TransferStatsRow['chains'][number]
export type ChainMetadata = BackendRouterOutputs['chains']['metadata'][number]
export type TransferDetailsInput = BackendRouterInputs['transfers']['details']
