import { expect } from 'earl'
import type {
  StarknetPrivacyEvent,
  StarknetPrivacyFlowIndexerConfig,
} from '../types'
import { extractStarknetPrivacyFlow } from './extractStarknetPrivacyFlow'

const TOKEN = '0x123'

describe(extractStarknetPrivacyFlow.name, () => {
  it('extracts a STRK-20 deposit amount for the configured token', () => {
    const result = extractStarknetPrivacyFlow(
      config('strk20Deposit'),
      event(['0xdeposit', '0xuser', TOKEN], ['0x1234']),
    )

    expect(result).toEqual({ count: 1, amount: 0x1234n })
  })

  it('extracts a STRK-20 withdrawal amount after encrypted user data', () => {
    const result = extractStarknetPrivacyFlow(
      config('strk20Withdrawal'),
      event(
        ['0xwithdrawal', '0xrecipient', TOKEN],
        ['0xencrypted1', '0xencrypted2', '0xencrypted3', '0x4567'],
      ),
    )

    expect(result).toEqual({ count: 1, amount: 0x4567n })
  })

  it('ignores events for another token', () => {
    const result = extractStarknetPrivacyFlow(
      config('strk20Deposit'),
      event(['0xdeposit', '0xuser', '0x456'], ['0x1234']),
    )

    expect(result).toEqual(undefined)
  })
})

function config(
  extractor: 'strk20Deposit' | 'strk20Withdrawal',
): StarknetPrivacyFlowIndexerConfig {
  return {
    id: 'id',
    projectId: 'strk20',
    bucketId: 'bucket',
    direction: extractor === 'strk20Deposit' ? 'deposit' : 'withdrawal',
    chain: 'starknet',
    address: '0xpool',
    event: '0xevent',
    sinceTimestamp: 0,
    priceId: 'starknet',
    decimals: 18,
    extractor,
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
