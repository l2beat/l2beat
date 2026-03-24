import type { EVMTransactionSubCall } from '@l2beat/shared'
import type { Transaction } from '@l2beat/shared-pure'
export interface InteropRawTransaction extends Transaction {
  // shadow extensions
  calls?: EVMTransactionSubCall[]
}

export class InteropTransactionDTO {
  readonly hash?: string
  readonly from?: string
  readonly to?: string
  readonly data?: string | string[]
  readonly type?: string
  readonly value?: bigint
  readonly calls?: EVMTransactionSubCall[]

  constructor(tx: InteropRawTransaction) {
    this.hash = tx.hash
    this.from = tx.from
    this.to = tx.to
    this.data = tx.data
    this.type = tx.type
    this.value = tx.value
    this.calls = tx.calls
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
