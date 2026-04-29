import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/backoffice-trpc'

export type EventStatsRow = BackendRouterOutputs['events']['stats'][number]
export type EventDetailsRow = BackendRouterOutputs['events']['details'][number]
export type ChainMetadata = BackendRouterOutputs['chains']['metadata'][number]
export type InteropEventKind = BackendRouterInputs['events']['details']['kind']
export type EventDetailsInput = BackendRouterInputs['events']['details']
