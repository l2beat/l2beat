import type { RouterInputs, RouterOutputs } from '@l2beat/backend/interop-trpc'

export type EventStatsRow = RouterOutputs['events']['stats'][number]
export type EventDetailsRow = RouterOutputs['events']['details'][number]
export type ChainMetadata = RouterOutputs['chains']['metadata'][number]
export type InteropEventKind = RouterInputs['events']['details']['kind']
