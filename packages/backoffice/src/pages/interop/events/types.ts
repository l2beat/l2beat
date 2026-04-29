import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/trpc'

export type EventStatsRow =
  BackendRouterOutputs['interop']['events']['stats'][number]
export type EventDetailsRow =
  BackendRouterOutputs['interop']['events']['details'][number]
export type ChainMetadata =
  BackendRouterOutputs['interop']['chains']['metadata'][number]
export type InteropEventKind =
  BackendRouterInputs['interop']['events']['details']['kind']
export type EventDetailsInput =
  BackendRouterInputs['interop']['events']['details']
