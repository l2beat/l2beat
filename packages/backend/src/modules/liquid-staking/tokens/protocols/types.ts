import type { LiquidStakingSnapshotRecord } from '@l2beat/database'
import type { CallParameters } from '@l2beat/shared'
import type { Bytes, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'

export type LiquidStakingState = Pick<
  LiquidStakingSnapshotRecord,
  | 'exchangeRate'
  | 'lastRequestId'
  | 'lastFinalizedRequestId'
  | 'instantExitEth'
  | 'instantExitFeeBps'
  | 'lockTime'
  | 'marketExitEth'
  | 'marketExitValueEth'
>

/** What a protocol's own contracts give, before the market quotes. */
export type ProtocolState = Omit<
  LiquidStakingState,
  'marketExitEth' | 'marketExitValueEth'
>

/** Reads that must all succeed; every getter exists at the block asked for. */
export interface ProtocolReads<K extends string = string> {
  calls: Record<K, CallParameters>
  toState(results: Record<K, Bytes>, timestamp: UnixTime): ProtocolState
  /** The token the market quotes sell. */
  token: ChainSpecificAddress
  /** What the sold tokens are worth, in ETH, at the protocol's rate. */
  saleValue(exchangeRate: bigint): bigint
}

export function protocolReads<K extends string>(
  reads: ProtocolReads<K>,
): ProtocolReads<K> {
  return reads
}

export const EMPTY_EXIT = {
  lastRequestId: null,
  lastFinalizedRequestId: null,
  instantExitEth: null,
  instantExitFeeBps: null,
  lockTime: null,
}
