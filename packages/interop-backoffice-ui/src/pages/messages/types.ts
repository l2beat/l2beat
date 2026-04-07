import type { RouterInputs, RouterOutputs } from '@l2beat/backend/interop-trpc'

export type MessageStatsRow = RouterOutputs['messages']['stats'][number]
export type MessageDetailsRow = RouterOutputs['messages']['details'][number]
export type MessagePairRow = MessageStatsRow['chains'][number]
export type ChainMetadata = RouterOutputs['chains']['metadata'][number]
export type MessageDetailsInput = RouterInputs['messages']['details']
