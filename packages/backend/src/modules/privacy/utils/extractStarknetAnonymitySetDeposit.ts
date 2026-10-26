import { assert } from '@l2beat/shared-pure'
import type {
  StarknetPrivacyAnonymitySetIndexerConfigProperties,
  StarknetPrivacyEvent,
} from '../types'

export interface StarknetAnonymitySetDeposit {
  amount: bigint
  sender: string
}

/**
 * STRK-20 Deposit(user_addr: key, token: key, amount: data). The depositor is
 * part of the event, so no transaction lookup is needed.
 */
export function extractStarknetAnonymitySetDeposit(
  source: StarknetPrivacyAnonymitySetIndexerConfigProperties,
  event: StarknetPrivacyEvent,
): StarknetAnonymitySetDeposit | undefined {
  const sender = event.keys[1]
  const tokenAddress = event.keys[2]
  if (
    sender === undefined ||
    tokenAddress === undefined ||
    BigInt(tokenAddress) !== BigInt(source.params.tokenAddress)
  ) {
    return undefined
  }

  assert(event.data.length === 1, 'Invalid STRK-20 deposit event')
  const amount = event.data[0]
  assert(amount !== undefined)
  return {
    amount: BigInt(amount),
    sender: normalizeStarknetAddress(sender),
  }
}

/**
 * The RPC returns felts with or without leading zeros, so one depositor could
 * otherwise be counted as several. Stored as 0x plus 64 hex digits.
 */
export function normalizeStarknetAddress(address: string): string {
  return `0x${BigInt(address).toString(16).padStart(64, '0')}`
}
