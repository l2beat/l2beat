import type { RouterOutputs } from '@l2beat/backend/interop-trpc'

export type MissingTokenRow = RouterOutputs['missingTokens']['list'][number]
export type ChainMetadata = RouterOutputs['chains']['metadata'][number]
