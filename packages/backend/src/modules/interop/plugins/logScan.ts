import { Address32 } from '@l2beat/shared-pure'
import type { LogToCapture } from './types'

/**
 * bastis log scanning tools for the capture phase of plugins
 */

export type LogScanDirection = 'around' | 'before' | 'after'

type TransferLike = {
  from: string
  to: string
  value: bigint
}

export type ParsedTransferLog = {
  logAddress: Address32
  from: Address32
  to: Address32
  value: bigint
}

export function* iterateLogs(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  direction: LogScanDirection = 'around',
): Generator<[LogToCapture['txLogs'][number], number]> {
  const startPos = logs.findIndex((log) => log.logIndex === startLogIndex)
  if (startPos === -1) return

  if (direction === 'before') {
    for (let i = startPos - 1; i >= 0; i--) {
      yield [logs[i], i]
    }
    return
  }

  if (direction === 'after') {
    for (let i = startPos + 1; i < logs.length; i++) {
      yield [logs[i], i]
    }
    return
  }

  for (let offset = 0; offset < logs.length; offset++) {
    const forward = startPos + offset
    if (forward < logs.length) {
      yield [logs[forward], forward]
    }

    if (offset === 0) continue

    const backward = startPos - offset
    if (backward >= 0) {
      yield [logs[backward], backward]
    }
  }
}

export function findParsedLog<T>(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  direction: LogScanDirection,
  transform: (
    log: LogToCapture['txLogs'][number],
    index: number,
  ) => T | undefined,
): T | undefined {
  for (const [log, index] of iterateLogs(logs, startLogIndex, direction)) {
    const transformed = transform(log, index)
    if (transformed) return transformed
  }
}

export function findParsedAround<T>(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  transform: (
    log: LogToCapture['txLogs'][number],
    index: number,
  ) => T | undefined,
): T | undefined {
  return findParsedLog(logs, startLogIndex, 'around', transform)
}

export function findParsedBefore<T>(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  transform: (
    log: LogToCapture['txLogs'][number],
    index: number,
  ) => T | undefined,
): T | undefined {
  return findParsedLog(logs, startLogIndex, 'before', transform)
}

export function findParsedAfter<T>(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  transform: (
    log: LogToCapture['txLogs'][number],
    index: number,
  ) => T | undefined,
): T | undefined {
  return findParsedLog(logs, startLogIndex, 'after', transform)
}

function parseTransferLog(
  log: LogToCapture['txLogs'][number],
  parseTransfer: (
    log: LogToCapture['txLogs'][number],
  ) => TransferLike | undefined,
): ParsedTransferLog | undefined {
  const transfer = parseTransfer(log)
  if (!transfer) return

  return {
    logAddress: Address32.from(log.address),
    from: Address32.from(transfer.from),
    to: Address32.from(transfer.to),
    value: transfer.value,
  }
}

export function findTransferLog(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  direction: LogScanDirection,
  parseTransfer: (
    log: LogToCapture['txLogs'][number],
  ) => TransferLike | undefined,
  predicate: (transfer: ParsedTransferLog) => boolean,
): { transfer?: ParsedTransferLog; hasTransfer: boolean } {
  let hasTransfer = false

  for (const [log] of iterateLogs(logs, startLogIndex, direction)) {
    const transfer = parseTransferLog(log, parseTransfer)
    if (!transfer) continue

    hasTransfer = true
    if (predicate(transfer)) {
      return { transfer, hasTransfer }
    }
  }

  return { hasTransfer }
}

export function findTransferLogAround(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  parseTransfer: (
    log: LogToCapture['txLogs'][number],
  ) => TransferLike | undefined,
  predicate: (transfer: ParsedTransferLog) => boolean,
): { transfer?: ParsedTransferLog; hasTransfer: boolean } {
  return findTransferLog(
    logs,
    startLogIndex,
    'around',
    parseTransfer,
    predicate,
  )
}

// Picks the closest transfer by amount delta, then prefers mint/burn transfers
// among same-value matches, then closest log index.
export function findBestTransferLog(
  logs: LogToCapture['txLogs'],
  targetAmount: bigint,
  startLogIndex: number,
  parseTransfer: (
    log: LogToCapture['txLogs'][number],
  ) => TransferLike | undefined,
): { transfer?: ParsedTransferLog; hasTransfer: boolean } {
  const transfers: { parsed: ParsedTransferLog; logIndex: number | null }[] = []
  for (const log of logs) {
    const transfer = parseTransferLog(log, parseTransfer)
    if (!transfer) continue
    transfers.push({
      parsed: transfer,
      logIndex: log.logIndex,
    })
  }

  // Exclude mint+burn pairs of the same token and amount (xERC20 lockbox pattern).
  // When a token is minted from 0x0 then immediately burned to 0x0, the pair is
  // intermediary and should not be picked over the real transfer.
  const cancelled = new Set<number>()
  for (let i = 0; i < transfers.length; i++) {
    if (cancelled.has(i)) continue
    const a = transfers[i].parsed
    if (a.from !== Address32.ZERO) continue
    for (let j = i + 1; j < transfers.length; j++) {
      if (cancelled.has(j)) continue
      const b = transfers[j].parsed
      if (
        b.to === Address32.ZERO &&
        b.logAddress === a.logAddress &&
        b.value === a.value
      ) {
        cancelled.add(i)
        cancelled.add(j)
        break
      }
    }
  }

  let closestMatch: ParsedTransferLog | undefined
  let closestDelta: bigint | undefined
  let closestDistance: number | undefined

  for (let i = 0; i < transfers.length; i++) {
    if (cancelled.has(i)) continue
    const { parsed, logIndex } = transfers[i]

    const delta = absDiff(parsed.value, targetAmount)
    const distance =
      logIndex === null
        ? Number.POSITIVE_INFINITY
        : Math.abs(logIndex - startLogIndex)

    if (closestDelta === undefined || delta < closestDelta) {
      closestDelta = delta
      closestDistance = distance
      closestMatch = parsed
      continue
    }

    if (delta > closestDelta) continue

    if (
      closestMatch &&
      parsed.value === closestMatch.value &&
      isMintOrBurnTransfer(parsed) !== isMintOrBurnTransfer(closestMatch)
    ) {
      if (isMintOrBurnTransfer(parsed)) {
        closestDistance = distance
        closestMatch = parsed
      }
      continue
    }

    if (closestDistance === undefined || distance < closestDistance) {
      closestDistance = distance
      closestMatch = parsed
    }
  }

  return { transfer: closestMatch, hasTransfer: transfers.length > 0 }
}

function absDiff(value: bigint, target: bigint): bigint {
  return value >= target ? value - target : target - value
}

function isMintOrBurnTransfer(transfer: ParsedTransferLog): boolean {
  return transfer.from === Address32.ZERO || transfer.to === Address32.ZERO
}

export function findTransferLogBefore(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  parseTransfer: (
    log: LogToCapture['txLogs'][number],
  ) => TransferLike | undefined,
  predicate: (transfer: ParsedTransferLog) => boolean,
): { transfer?: ParsedTransferLog; hasTransfer: boolean } {
  return findTransferLog(
    logs,
    startLogIndex,
    'before',
    parseTransfer,
    predicate,
  )
}

export function findTransferLogAfter(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  parseTransfer: (
    log: LogToCapture['txLogs'][number],
  ) => TransferLike | undefined,
  predicate: (transfer: ParsedTransferLog) => boolean,
): { transfer?: ParsedTransferLog; hasTransfer: boolean } {
  return findTransferLog(logs, startLogIndex, 'after', parseTransfer, predicate)
}
