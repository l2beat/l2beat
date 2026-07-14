import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/trpc'

export type FinancialTransfersFilterInput =
  BackendRouterInputs['interop']['financials']['transfers']
export type FinancialTransfersResult =
  BackendRouterOutputs['interop']['financials']['transfers']
export type FinancialTransferRow = FinancialTransfersResult['transfers'][number]
export type FinancialTransfersStats = FinancialTransfersResult['stats']
