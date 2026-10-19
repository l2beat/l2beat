import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getPrivacyAnonymitySetSources } from './getPrivacyAnonymitySetSources'

const POOL = EthereumAddress('0x1111111111111111111111111111111111111111')
const REGISTRY = EthereumAddress('0x2222222222222222222222222222222222222222')

describe(getPrivacyAnonymitySetSources.name, () => {
  it('lists the tracked buckets of every token', () => {
    const tracked = {
      id: 'tracked',
      address: ChainSpecificAddress.fromLong('ethereum', POOL),
      sinceTimestamp: 1000,
      anonymitySet: { minimumAmounts: ['1'] },
      deposit: {
        event: '0xdeposit',
        extractor: 'fixedAmount',
        params: { amount: '1' },
      },
    }
    const token = {
      buckets: [
        tracked,
        { ...tracked, id: 'untracked', anonymitySet: undefined },
      ],
    }

    expect(getPrivacyAnonymitySetSources({ tokens: [token] })).toEqual([
      {
        type: 'deposits',
        bucketId: 'tracked',
        chain: 'ethereum',
        address: POOL,
        sinceTimestamp: 1000,
        token,
        bucket: tracked,
        source: tracked.deposit,
      },
    ])
  })

  it('files key registrations under a fixed bucket at the registry', () => {
    expect(
      getPrivacyAnonymitySetSources({
        tokens: [],
        anonymitySet: {
          type: 'key-registrations' as const,
          registry: ChainSpecificAddress.fromLong('ethereum', REGISTRY),
          sinceTimestamp: 1000,
          event: '0xregistered',
          extractor: 'umbraStealthKeyChanged',
        },
      }),
    ).toEqual([
      {
        type: 'key-registrations',
        bucketId: 'key-registrations',
        chain: 'ethereum',
        address: REGISTRY,
        sinceTimestamp: 1000,
        source: {
          event: '0xregistered',
          extractor: 'umbraStealthKeyChanged',
          params: {},
        },
      },
    ])
  })

  it('lists nothing for an untracked anonymity set', () => {
    expect(
      getPrivacyAnonymitySetSources({
        tokens: [],
        anonymitySet: { type: 'too-small' },
      }),
    ).toEqual([])
  })
})
