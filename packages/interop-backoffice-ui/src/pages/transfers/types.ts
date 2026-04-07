import type { RouterInputs, RouterOutputs } from '@l2beat/backend/interop-trpc'

export type TransferStatsRow = RouterOutputs['transfers']['stats'][number]
export type TransferDetailsRow = RouterOutputs['transfers']['details'][number]
export type TransferPairRow = TransferStatsRow['chains'][number]
export type ChainMetadata = RouterOutputs['chains']['metadata'][number]
export type TransferDetailsInput = RouterInputs['transfers']['details']
