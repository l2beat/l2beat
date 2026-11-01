import type { BackendRouterOutputs } from '@l2beat/backend/trpc'

export type CoverageData = BackendRouterOutputs['interop']['coverage']['data']
export type CoverageChain = CoverageData['chains'][number]
export type CoveragePlugin = CoverageData['plugins'][number]
