import type { BackendRouterOutputs } from '@l2beat/backend/trpc'
export type MissingTokenRow =
  BackendRouterOutputs['interop']['missingTokens']['list'][number]
export type MissingTokenStatus = MissingTokenRow['tokenDbStatus']
export type ChainMetadata =
  BackendRouterOutputs['interop']['chains']['metadata'][number]
