import type { ProjectPrivacyToken, TvsToken } from '@l2beat/config'
import type { TokenValueRecord, TvsEscrowValueRecord } from '@l2beat/database'
import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getPrivacyBucketTvls } from './getPrivacyBucketTvls'

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
