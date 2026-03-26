import type { EVMTransaction, RpcTransaction } from '@l2beat/shared'
import type { Transaction } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

const InteropTransactionData = v.union([v.string(), v.array(v.string())])

// Classic envelope
const CanonicalTransaction = v
  .passthroughObject({
    // we only rely on data below + it's hard to maintain whole complete list
    type: v.string(),
    hash: v.string(),
    from: v.string(),
    to: v.string().optional(),
    data: InteropTransactionData,
    value: v.bigint(),
  })
  .transform((o) => ({
    kind: 'canonical' as const,
    ...o,
  }))

// Tempo bundle
const TempoBundleTransaction = v
  .passthroughObject({
    type: v.literal('118'),
    hash: v.string(),
    from: v.string(),
    calls: v.array(
      v
        .object({
          to: v.string().optional(),
          value: v.bigint(),
          input: v.string(),
          data: v.string().optional(),
        })
        .transform((o) => ({
          to: o.to,
          value: o.value,
          data: o.data ?? o.input,
        })),
    ),
  })
  .transform((o) => ({ kind: 'bundle' as const, ...o }))

export const InteropTransaction = v.union([
  CanonicalTransaction,
  TempoBundleTransaction,
])
export type InteropTransaction = v.infer<typeof InteropTransaction>

export type InteropUpStreamTransaction =
  | RpcTransaction
  | Transaction
  | EVMTransaction

export function toInteropTransaction(
  tx: InteropUpStreamTransaction,
): InteropTransaction {
  const normalized = normalizeInteropUpstreamTransaction(tx)

  const parsed = InteropTransaction.safeParse(normalized)
  if (!parsed.success) {
    throw new Error(
      `Invalid interop transaction of type ${tx.type} at ${parsed.path || '@'}: ${parsed.message}`,
    )
  }
  return parsed.data
}

export function getInteropTransactionDataCandidates(
  tx: InteropTransaction,
): string[] {
  const candidates = new Set<string>()

  if (tx.kind === 'canonical') {
    const data = Array.isArray(tx.data) ? tx.data : [tx.data]
    for (const d of data) {
      candidates.add(d)
    }
  }

  if (tx.kind === 'bundle') {
    const data = tx.calls
      .map((call) => call.data)
      .filter((data) => data !== undefined)

    for (const d of data) {
      candidates.add(d)
    }
  }

  return [...candidates]
}

export function getInteropTransactionTargetCallValue(
  tx: InteropTransaction,
  targets: string[],
): bigint | undefined {
  const targetSet = new Set(targets.map((target) => target.toLowerCase()))

  if (tx.kind === 'canonical') {
    if (
      tx.to !== undefined &&
      tx.value !== undefined &&
      tx.value > 0n &&
      targetSet.has(tx.to.toLowerCase())
    ) {
      return tx.value
    }
    return
  }

  const directMatch = tx.calls.find(
    (call) =>
      call.value !== undefined &&
      call.value > 0n &&
      call.to !== undefined &&
      targetSet.has(call.to.toLowerCase()),
  )

  if (directMatch?.value !== undefined) {
    return directMatch.value
  }

  const positiveCalls = tx.calls.filter(
    (call) => call.value !== undefined && call.value > 0n,
  )

  if (positiveCalls.length === 1) {
    return positiveCalls[0]?.value
  }
}

function normalizeInteropUpstreamTransaction(tx: InteropUpStreamTransaction) {
  return compactObject({
    hash: tx.hash,
    from: tx.from?.toString(),
    to: tx.to?.toString(),
    data: getInteropTransactionData(tx),
    type: normalizeTxType(tx.type),
    value: tx.value,
    calls: 'calls' in tx ? tx.calls?.map(normalizeInteropCall) : undefined,
  })
}

function getInteropTransactionData(
  tx: InteropUpStreamTransaction,
): string | string[] | undefined {
  if ('data' in tx) {
    return tx.data
  }
  if ('input' in tx) {
    return tx.input
  }
  return undefined
}

function normalizeInteropCall(call: {
  to?: { toString(): string } | string
  value?: bigint
  data?: string
  input?: string
}) {
  return compactObject({
    to: call.to?.toString(),
    value: call.value,
    input: call.input ?? call.data,
  })
}

function normalizeTxType(
  type: string | bigint | undefined,
): string | undefined {
  if (type === undefined) {
    return undefined
  }
  if (typeof type === 'bigint') {
    return type.toString()
  }
  if (/^0x/i.test(type)) {
    return BigInt(type).toString()
  }
  return type
}

function compactObject<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T
}
