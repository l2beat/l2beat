/*
       ====== IMPORTANT NOTICE ======

EDIT THIS FILE ONLY IF YOU KNOW WHAT YOU ARE DOING

To set the minTimestamp for a chain it is not always the case to set the timestamp of the first block.
For example Optimism had block 0 on January 2021 but the block 1 on November 2021 :D

*/
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
    // ~ Timestamp of block number 138 on Optimism
    // The first full hour timestamp that will return the block number
    // https://optimistic.etherscan.io/block/138
    minTimestamp: UnixTime.fromDate(new Date('2021-11-11T22:00:00Z')),
  },
  {
    chainId: ChainId.BASE,
    // ~ Timestamp of block number 0 on Base
    // https://basescan.org/block/0
    minTimestamp: UnixTime.fromDate(new Date('2023-06-15T12:35:47Z')),
  },
  {
    chainId: ChainId.MANTA_PACIFIC,
    // ~ Timestamp of block number 0 on MantaPacific
    // https://pacific-explorer.manta.network/block/0
    minTimestamp: UnixTime.fromDate(new Date('2023-09-09T01:45:59Z')),
  },
  {
    chainId: ChainId.LYRA,
    // ~ Timestamp of block number 0 on Lyra
    // https://explorer.lyra.finance/block/0
    minTimestamp: UnixTime.fromDate(new Date('2023-11-15T04:13:35Z')),
  },
  {
    chainId: ChainId.LINEA,
    // ~ Timestamp of block number 0 on Linea
    // https://lineascan.build/block/0
    minTimestamp: UnixTime.fromDate(new Date('2023-07-06T01:15:00Z')),
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
