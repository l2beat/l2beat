import type { BackendRouterOutputs } from '@l2beat/backend/trpc'
export type KnownAppsRow =
  BackendRouterOutputs['interop']['knownApps']['list'][number]
