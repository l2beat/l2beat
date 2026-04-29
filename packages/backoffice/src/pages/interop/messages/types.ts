import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/backoffice-trpc'

export type MessageStatsRow = BackendRouterOutputs['messages']['stats'][number]
export type MessageDetailsRow =
  BackendRouterOutputs['messages']['details'][number]
export type MessagePairRow = MessageStatsRow['chains'][number]
export type ChainMetadata = BackendRouterOutputs['chains']['metadata'][number]
export type MessageDetailsInput = BackendRouterInputs['messages']['details']
