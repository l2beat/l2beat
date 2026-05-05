import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/trpc'

export type MessageStatsRow =
  BackendRouterOutputs['interop']['messages']['stats'][number]
export type MessageDetailsRow =
  BackendRouterOutputs['interop']['messages']['details'][number]
export type MessagePairRow = MessageStatsRow['chains'][number]
export type ChainMetadata =
  BackendRouterOutputs['interop']['chains']['metadata'][number]
export type MessageDetailsInput =
  BackendRouterInputs['interop']['messages']['details']
