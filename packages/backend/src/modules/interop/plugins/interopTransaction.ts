import type { Transaction } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export interface TransactionCall {
  to?: string
  value?: bigint
  data?: string
}

export interface InteropRawTransaction extends Transaction {
  // shadow extensions
  calls?: unknown
}

const TransactionCall = v
  .passthroughObject({
    to: v.string().optional(),
    value: v.bigint().optional(),
    input: v.string().optional(),
    data: v.string().optional(),
  })
  .transform((call): TransactionCall | undefined => {
    const normalized: TransactionCall = {
      to: call.to,
      value: call.value,
      data: call.input ?? call.data,
    }

    if (
      normalized.to === undefined &&
      normalized.value === undefined &&
      normalized.data === undefined
    ) {
      return undefined
    }
    return normalized
  })

export class InteropTransactionDTO implements Transaction {
  readonly hash?: string
  readonly from?: string
  readonly to?: string
  readonly data?: string | string[]
  readonly type?: string
  readonly value?: bigint
  readonly calls?: TransactionCall[]

  constructor(tx: InteropRawTransaction) {
    this.hash = tx.hash
    this.from = tx.from
    this.to = tx.to
    this.data = tx.data
    this.type = tx.type
    this.value = tx.value
    this.calls = normalizeInteropTransactionCalls(tx.calls)
  }

  getDataCandidates(): string[] {
    const fromTx =
      typeof this.data === 'string'
        ? [this.data]
        : Array.isArray(this.data)
          ? this.data
          : []
    const fromCalls =
      this.calls
        ?.map((call) => call.data)
        .filter((data): data is string => data !== undefined) ?? []

    return [...new Set([...fromTx, ...fromCalls])]
  }

  getTargetCallValue(targets: string[]): bigint | undefined {
    if (!this.calls || this.calls.length === 0) return

    const targetSet = new Set(targets.map((target) => target.toLowerCase()))
    const directMatch = this.calls.find(
      (call) =>
        call.value !== undefined &&
        call.value > 0n &&
        call.to !== undefined &&
        targetSet.has(call.to.toLowerCase()),
    )
    if (directMatch?.value !== undefined) return directMatch.value

    const positiveCalls = this.calls.filter(
      (call) => call.value !== undefined && call.value > 0n,
    )
    if (positiveCalls.length === 1) return positiveCalls[0]?.value
  }
}

export type InteropTransaction = InteropTransactionDTO

export function toInteropTransaction(
  tx: InteropRawTransaction,
): InteropTransactionDTO {
  if (tx instanceof InteropTransactionDTO) {
    return tx
  }
  return new InteropTransactionDTO(tx)
}

function normalizeInteropTransactionCalls(
  calls: unknown,
): TransactionCall[] | undefined {
  if (!Array.isArray(calls)) return

  const normalized: TransactionCall[] = []
  for (const call of calls) {
    const parsedCall = TransactionCall.safeParse(call)
    if (!parsedCall.success || parsedCall.data === undefined) {
      continue
    }
    normalized.push(parsedCall.data)
  }

  return normalized.length > 0 ? normalized : undefined
}
