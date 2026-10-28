import type { UnixTime } from '@l2beat/shared-pure'

// Glamsterdam has no mainnet date yet (Sepolia forked on 2026-10-06, Hoodi was
// postponed on 2026-10-22). Once ACD schedules it, replace 'not-scheduled'
// with the timestamp of the fork's first block. Until then every tx is priced
// with pre-Glamsterdam rules.
const GLAMSTERDAM_TIMESTAMP: UnixTime | 'not-scheduled' = 'not-scheduled'

// EIP-2780: 12,000 TX_BASE + 3,000 for the cold recipient
const OVERHEAD = 15_000

// A tx that pays the calldata floor (EIP-7976) uses 64 gas per calldata byte
// on top of its intrinsic base (EIP-2780): 15,000 for a call, 21,000 for a
// call with value and 12,000 for a self-transfer. Floor-bound txs with an
// access list also pay its data term (EIP-7981), so they don't match and get
// the standard calldata price.
const FLOOR_BASES = [12_000, 15_000, 21_000]

export function isGlamsterdam(blockTimestamp: UnixTime): boolean {
  return (
    GLAMSTERDAM_TIMESTAMP !== 'not-scheduled' &&
    blockTimestamp >= GLAMSTERDAM_TIMESTAMP
  )
}

export function getGlamsterdamCalldataGasUsed(
  dataLength: number,
  nonZeroBytes: number,
  gasUsed: number,
): number {
  const floorCalldata = 64 * dataLength
  if (FLOOR_BASES.includes(gasUsed - floorCalldata)) {
    return floorCalldata
  }

  const zeroBytes = dataLength - nonZeroBytes
  return 16 * nonZeroBytes + 4 * zeroBytes
}

export function getGlamsterdamOverhead(
  gasUsed: number,
  calldataGasUsed: number,
): number {
  // Self-transfers (Fuel posts its batches this way) skip the recipient charge
  // and pay 12,000, so cap the overhead to keep compute from going negative.
  return Math.min(OVERHEAD, gasUsed - calldataGasUsed)
}
