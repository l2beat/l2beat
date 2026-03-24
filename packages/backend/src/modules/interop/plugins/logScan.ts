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
