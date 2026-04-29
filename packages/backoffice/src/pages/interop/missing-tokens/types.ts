import type { BackendRouterOutputs } from '@l2beat/backend/backoffice-trpc'
export type MissingTokenRow =
  BackendRouterOutputs['missingTokens']['list'][number]
export type MissingTokenStatus = MissingTokenRow['tokenDbStatus']
export type ChainMetadata = BackendRouterOutputs['chains']['metadata'][number]
