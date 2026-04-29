import type { BackendRouterOutputs } from '@l2beat/backend/backoffice-trpc'
export type KnownAppsRow =
  BackendRouterOutputs['interop']['knownApps']['list'][number]
