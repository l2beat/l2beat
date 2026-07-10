import type {
  Database,
  InteropTransferFinancialsFilter,
  InteropTransferRecord,
} from '@l2beat/database'
import { hasAnyInteropTransferFinancialsFilter } from '@l2beat/database'
import { Address32, UnixTime } from '@l2beat/shared-pure'
import { TRPCError } from '@trpc/server'

export const FINANCIAL_TRANSFERS_RESULT_LIMIT = 1_000

export interface FinancialTransfersFilterInput {
  transferId?: string
  srcChain?: string
  srcTokenAddress?: string
  srcAbstractTokenId?: string
  srcSymbol?: string
  dstChain?: string
  dstTokenAddress?: string
  dstAbstractTokenId?: string
  dstSymbol?: string
  from?: number
  to?: number
}

export interface FinancialTransferDto {
  transferId: string
  plugin: string
  type: string
  timestamp: number
  isProcessed: boolean
  srcChain: string
  srcTokenAddress: string | undefined
  srcAbstractTokenId: string | undefined
  srcSymbol: string | undefined
  srcAmount: number | undefined
  srcPrice: number | undefined
  srcValueUsd: number | undefined
  dstChain: string
  dstTokenAddress: string | undefined
  dstAbstractTokenId: string | undefined
  dstSymbol: string | undefined
  dstAmount: number | undefined
  dstPrice: number | undefined
  dstValueUsd: number | undefined
}

export function toInteropTransferFinancialsFilter(
  input: FinancialTransfersFilterInput,
): InteropTransferFinancialsFilter {
  const filter: InteropTransferFinancialsFilter = {
    transferId: normalizeText(input.transferId),
    srcChain: normalizeText(input.srcChain),
    srcTokenAddress: normalizeTokenAddress(input.srcTokenAddress),
    srcAbstractTokenId: normalizeText(input.srcAbstractTokenId),
    srcSymbol: normalizeText(input.srcSymbol),
    dstChain: normalizeText(input.dstChain),
    dstTokenAddress: normalizeTokenAddress(input.dstTokenAddress),
    dstAbstractTokenId: normalizeText(input.dstAbstractTokenId),
    dstSymbol: normalizeText(input.dstSymbol),
    from: input.from !== undefined ? UnixTime(input.from) : undefined,
    to: input.to !== undefined ? UnixTime(input.to) : undefined,
  }

  if (!hasAnyInteropTransferFinancialsFilter(filter)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'At least one filter is required',
    })
  }

  return filter
}

function normalizeText(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function normalizeTokenAddress(value: string | undefined): string | undefined {
  const trimmed = normalizeText(value)
  if (!trimmed) return undefined
  if (/^0x[0-9a-fA-F]{40}$/.test(trimmed)) {
    return Address32.from(trimmed)
  }
  return trimmed
}

export async function searchFinancialTransfers(
  db: Database,
  input: FinancialTransfersFilterInput,
) {
  const filter = toInteropTransferFinancialsFilter(input)
  const [records, stats] = await Promise.all([
    db.interopTransfer.getByFinancialsFilter(
      filter,
      FINANCIAL_TRANSFERS_RESULT_LIMIT,
    ),
    db.interopTransfer.getFinancialsStatsByFilter(filter),
  ])

  return {
    transfers: records.map(toFinancialTransferDto),
    stats,
    limit: FINANCIAL_TRANSFERS_RESULT_LIMIT,
  }
}

export async function reprocessFinancialTransfersByFilter(
  db: Database,
  input: FinancialTransfersFilterInput,
) {
  const filter = toInteropTransferFinancialsFilter(input)
  const updatedTransfers =
    await db.interopTransfer.markAsUnprocessedByFinancialsFilter(filter)

  return { updatedTransfers }
}

function toFinancialTransferDto(
  record: InteropTransferRecord,
): FinancialTransferDto {
  return {
    transferId: record.transferId,
    plugin: record.plugin,
    type: record.type,
    timestamp: record.timestamp,
    isProcessed: record.isProcessed,
    srcChain: record.srcChain,
    srcTokenAddress: record.srcTokenAddress,
    srcAbstractTokenId: record.srcAbstractTokenId,
    srcSymbol: record.srcSymbol,
    srcAmount: record.srcAmount,
    srcPrice: record.srcPrice,
    srcValueUsd: record.srcValueUsd,
    dstChain: record.dstChain,
    dstTokenAddress: record.dstTokenAddress,
    dstAbstractTokenId: record.dstAbstractTokenId,
    dstSymbol: record.dstSymbol,
    dstAmount: record.dstAmount,
    dstPrice: record.dstPrice,
    dstValueUsd: record.dstValueUsd,
  }
}
