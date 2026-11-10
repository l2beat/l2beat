import type { ProjectPrivacyToken, TvsToken } from '@l2beat/config'
import type { TokenValueRecord, TvsEscrowValueRecord } from '@l2beat/database'
import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getPrivacyBucketTvls,
  getPrivacyChainAssetTvls,
  getPrivacySingleEscrowBucketTvls,
} from './getPrivacyBucketTvls'

const POOL_A = EthereumAddress('0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc')
const POOL_B = EthereumAddress('0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936')
const LATEST = UnixTime(7200)
const EARLIER = UnixTime(3600)

describe(getPrivacyBucketTvls.name, () => {
  it('takes each pool value at the timestamp of the latest token value', () => {
    const result = getPrivacyBucketTvls(
      [
        {
          token: { symbol: 'ETH' },
          buckets: [bucket('eth-a', POOL_A), bucket('eth-b', POOL_B)],
        } as unknown as ProjectPrivacyToken,
      ],
      [{ id: 'tornado-cash-ETH', symbol: 'ETH' } as TvsToken],
      [{ tokenId: 'tornado-cash-ETH', timestamp: LATEST } as TokenValueRecord],
      [
        escrowValue(POOL_A, LATEST, 10),
        escrowValue(POOL_A, EARLIER, 99),
        escrowValue(POOL_B.toLowerCase(), LATEST, 20),
        escrowValue(POOL_B, LATEST, 30, 'arbitrum'),
      ],
    )

    expect([...result]).toEqual([
      ['eth-a', 10],
      ['eth-b', 20],
    ])
  })
})

describe(getPrivacySingleEscrowBucketTvls.name, () => {
  it('values a bucket at its token when the token is held in that pool alone', () => {
    const result = getPrivacySingleEscrowBucketTvls(
      [
        {
          token: { symbol: 'USDC' },
          buckets: [bucket('usdc-a', POOL_A), bucket('usdc-b', POOL_B)],
        } as unknown as ProjectPrivacyToken,
      ],
      [
        {
          id: 'project-USDC',
          symbol: 'USDC',
          amount: {
            type: 'balanceOfEscrow',
            chain: 'ethereum',
            escrowAddress: POOL_A.toLowerCase(),
          },
        } as unknown as TvsToken,
      ],
      [{ tokenId: 'project-USDC', valueForProject: 40 } as TokenValueRecord],
    )

    expect([...result]).toEqual([['usdc-a', 40]])
  })
})

describe(getPrivacyChainAssetTvls.name, () => {
  it('adds the tokens read on the chain and the escrows there of the others', () => {
    const result = getPrivacyChainAssetTvls(
      [
        // Several escrows read at once: no bucket of it can be valued.
        {
          id: 'project-ETH',
          symbol: 'ETH',
          amount: { type: 'balanceOfEscrows', chain: 'ethereum' },
        },
        {
          id: 'project-ETH-arb',
          symbol: 'ETH',
          amount: { type: 'balanceOfEscrow', chain: 'arbitrum' },
        },
        {
          id: 'project-USDC',
          symbol: 'USDC',
          amount: { type: 'calculation', operator: 'sum', arguments: [] },
        },
      ] as unknown as TvsToken[],
      [
        { tokenId: 'project-ETH', timestamp: LATEST, valueForProject: 40 },
        { tokenId: 'project-ETH-arb', timestamp: LATEST, valueForProject: 7 },
        { tokenId: 'project-USDC', timestamp: LATEST, valueForProject: 60 },
      ] as TokenValueRecord[],
      [
        { ...escrowValue(POOL_A, LATEST, 10), tokenId: 'project-USDC' },
        { ...escrowValue(POOL_A, EARLIER, 99), tokenId: 'project-USDC' },
        {
          ...escrowValue(POOL_B, LATEST, 50, 'arbitrum'),
          tokenId: 'project-USDC',
        },
      ],
      'ethereum',
    )

    expect([...result]).toEqual([
      ['ETH', 40],
      ['USDC', 10],
    ])
  })
})

function bucket(id: string, pool: EthereumAddress) {
  return { id, address: ChainSpecificAddress.fromLong('ethereum', pool) }
}

function escrowValue(
  escrowAddress: string,
  timestamp: UnixTime,
  value: number,
  chain = 'ethereum',
): TvsEscrowValueRecord {
  return {
    timestamp,
    configurationId: 'a'.repeat(12),
    projectId: 'tornado-cash',
    tokenId: 'tornado-cash-ETH',
    chain,
    escrowAddress,
    amount: 0,
    value,
  }
}
