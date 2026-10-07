import { expect } from 'earl'
import type {
  StarknetPrivacyAnonymitySetIndexerConfigProperties,
  StarknetPrivacyEvent,
} from '../types'
import {
  extractStarknetAnonymitySetDeposit,
  normalizeStarknetAddress,
} from './extractStarknetAnonymitySetDeposit'

const TOKEN = '0x123'
const USER = `0x${'ab'.repeat(32)}`

describe(extractStarknetAnonymitySetDeposit.name, () => {
  it('extracts the depositor and amount from a deposit event', () => {
    const result = extractStarknetAnonymitySetDeposit(
      config(),
      event(['0xdeposit', USER, TOKEN], ['0x1234']),
    )

    expect(result).toEqual({ amount: 0x1234n, sender: USER })
  })

  it('normalizes depositors and tokens that omit leading zeros', () => {
    const result = extractStarknetAnonymitySetDeposit(
      config(),
      event(['0xdeposit', '0xabc', '0x0123'], ['0x1']),
    )

    expect(result).toEqual({
      amount: 1n,
      sender: `0x${'0'.repeat(61)}abc`,
    })
  })

  it('ignores deposits of another token', () => {
    const result = extractStarknetAnonymitySetDeposit(
      config(),
      event(['0xdeposit', USER, '0x456'], ['0x1234']),
    )

    expect(result).toEqual(undefined)
  })

  it('ignores events without the depositor and token keys', () => {
    const result = extractStarknetAnonymitySetDeposit(
      config(),
      event(['0xdeposit'], ['0x1234']),
    )

    expect(result).toEqual(undefined)
  })

  it('rejects a deposit event with an unexpected data layout', () => {
    expect(() =>
      extractStarknetAnonymitySetDeposit(
        config(),
        event(['0xdeposit', USER, TOKEN], ['0x1234', '0x5678']),
      ),
    ).toThrow('Invalid STRK-20 deposit event')
  })
})

describe(normalizeStarknetAddress.name, () => {
  it('pads to 64 hex digits and lowercases', () => {
    expect(normalizeStarknetAddress('0xABC')).toEqual(`0x${'0'.repeat(61)}abc`)
    expect(normalizeStarknetAddress(USER)).toEqual(USER)
  })
})

function config(): StarknetPrivacyAnonymitySetIndexerConfigProperties {
  return {
    projectId: 'strk20',
    bucketId: 'bucket',
    chain: 'starknet',
    address: '0xpool',
    event: '0xdeposit',
    sinceTimestamp: 0,
    extractor: 'strk20Deposit',
    params: { tokenAddress: TOKEN },
  }
}

function event(keys: string[], data: string[]): StarknetPrivacyEvent {
  return {
    address: '0xpool',
    blockNumber: 100,
    transactionHash: '0xtx',
    eventIndex: 0,
    keys,
    data,
  }
}
