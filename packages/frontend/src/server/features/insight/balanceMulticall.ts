import { assert } from '@l2beat/shared-pure'

// Multicall3 `tryAggregate(false, calls)` for one-argument balance calls,
// coded by hand: for vitalik.eth's 510 calls the generic ABI coder of
// `MulticallV3Client` took 40 ms to encode and 105 ms to decode, all of it
// blocking the event loop; this takes 3 ms and 1 ms. Every call here has the
// same shape, so the calldata layout is fixed.

/** Multicall3, deployed at the same address on every chain it is on. */
export const MULTICALL3_ADDRESS = '0xca11bde05977b3631167028862be2a173976ca11'
const TRY_AGGREGATE_SELECTOR = 'bce38bd7'
const BALANCE_OF_SELECTOR = '70a08231'
const GET_ETH_BALANCE_SELECTOR = '4d2301cc'

const WORD_BYTES = 32
const WORD_HEX = WORD_BYTES * 2
const CALL_DATA_BYTES = 4 + WORD_BYTES
// Target, offset of the call data, its length, and the call data padded to
// two words.
const ENCODED_CALL_BYTES = 5 * WORD_BYTES

export interface BalanceCall {
  /** Lowercase `0x` address of the contract called. */
  target: string
  /** `0x` hex of a 4-byte selector and one argument word. */
  callData: string
}

/** `balanceOf(holder)` on `token`. */
export function balanceOfCall(token: string, holder: string): BalanceCall {
  return {
    target: token,
    callData: `0x${BALANCE_OF_SELECTOR}${toWord(holder)}`,
  }
}

/** ETH balance of `holder`, read through Multicall3 itself. */
export function getEthBalanceCall(holder: string): BalanceCall {
  return {
    target: MULTICALL3_ADDRESS,
    callData: `0x${GET_ETH_BALANCE_SELECTOR}${toWord(holder)}`,
  }
}

/** Calldata of `tryAggregate(false, calls)`. */
export function encodeTryAggregate(calls: BalanceCall[]): string {
  assert(calls.length > 0, 'At least one call')
  const parts = [
    `0x${TRY_AGGREGATE_SELECTOR}`,
    toWord(0),
    toWord(2 * WORD_BYTES),
  ]
  parts.push(toWord(calls.length))
  // Offsets count from the first offset word, past the array length.
  for (let i = 0; i < calls.length; i++) {
    parts.push(toWord(calls.length * WORD_BYTES + i * ENCODED_CALL_BYTES))
  }
  for (const call of calls) {
    assert(/^0x[0-9a-f]{72}$/.test(call.callData), 'One-argument call data')
    parts.push(toWord(call.target), toWord(2 * WORD_BYTES))
    parts.push(toWord(CALL_DATA_BYTES), call.callData.slice(2).padEnd(128, '0'))
  }
  return parts.join('')
}

/**
 * The balance each call returned, or undefined for a call that reverted or
 * did not return exactly one word. Follows every offset rather than assuming
 * the layout, since the result comes from the RPC.
 */
export function decodeTryAggregate(
  result: string,
  callCount: number,
): (bigint | undefined)[] {
  const reader = new WordReader(result)
  const arrayStart = reader.readOffset(0) + WORD_BYTES
  if (reader.readOffset(arrayStart - WORD_BYTES) !== callCount) {
    throw new Error('Multicall result count mismatch', {
      cause: { callCount },
    })
  }
  const balances: (bigint | undefined)[] = []
  for (let i = 0; i < callCount; i++) {
    const element = arrayStart + reader.readOffset(arrayStart + i * WORD_BYTES)
    const success = reader.readOffset(element)
    if (success !== 0 && success !== 1) {
      throw new Error('Malformed multicall result', { cause: { success } })
    }
    const data = element + reader.readOffset(element + WORD_BYTES)
    const returned = success === 1 && reader.readOffset(data) === WORD_BYTES
    balances.push(returned ? reader.readWord(data + WORD_BYTES) : undefined)
  }
  return balances
}

class WordReader {
  private readonly hex: string

  constructor(result: string) {
    if (!/^0x([0-9a-f]{2})*$/i.test(result)) {
      throw new Error('Malformed multicall result', {
        cause: { length: result.length },
      })
    }
    this.hex = result.slice(2)
  }

  readWord(byteOffset: number): bigint {
    const start = byteOffset * 2
    if (start + WORD_HEX > this.hex.length) {
      throw new Error('Malformed multicall result', {
        cause: { byteOffset, byteLength: this.hex.length / 2 },
      })
    }
    return BigInt(`0x${this.hex.slice(start, start + WORD_HEX)}`)
  }

  /** A word used as an offset or length, so it must fit in the result. */
  readOffset(byteOffset: number): number {
    const value = this.readWord(byteOffset)
    if (value > BigInt(this.hex.length / 2)) {
      throw new Error('Malformed multicall result', {
        cause: { byteOffset, value: value.toString() },
      })
    }
    return Number(value)
  }
}

function toWord(value: number | string): string {
  if (typeof value === 'number') {
    assert(Number.isSafeInteger(value), 'Safe integer')
    assert(value >= 0, 'Unsigned integer')
    return value.toString(16).padStart(WORD_HEX, '0')
  }
  assert(/^0x[0-9a-f]{40}$/.test(value), 'Lowercase address')
  return value.slice(2).padStart(WORD_HEX, '0')
}
