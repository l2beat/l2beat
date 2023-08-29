import { assert, ChainId, UnixTime } from '@l2beat/shared-pure'

const chainConfig = [
  {
    chainId: ChainId.ETHEREUM,
    // Deployment of the first L2
    minTimestamp: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
  },
  {
    chainId: ChainId.ARBITRUM,
    // ~ Timestamp of block number 0 on Arbitrum
    minTimestamp: UnixTime.fromDate(new Date('2021-05-28T22:15:00Z')),
  },
  {
    chainId: ChainId.OPTIMISM,
    // ~ Timestamp of block number 0 on Optimism
    // https://optimistic.etherscan.io/block/0
    minTimestamp: UnixTime.fromDate(new Date('2021-01-14T15:51:40Z')),
  },
]

export function getChainMinTimestamp(chainId: ChainId): UnixTime {
  const config = chainConfig.find((c) => c.chainId === chainId)
  assert(
    config,
    'Could not find minimum timestamp for chain: ' + ChainId.getName(chainId),
  )
  return config.minTimestamp
}
