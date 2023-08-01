import { UnixTime } from './UnixTime'

export interface ChainId extends Number {
  _ChainIdBrand: number
}

export function ChainId(value: number): ChainId {
  if (!CHAIN_IDS.map((c) => c.id).includes(value)) {
    throw new TypeError('Invalid ChainId')
  }
  return value as unknown as ChainId
}

interface ChainMetadata {
  id: number
  name: string
  minTimestamp?: UnixTime
  dethDomain?: string
}

const CHAIN_IDS: ChainMetadata[] = [
  {
    id: 1,
    name: 'ethereum',
    dethDomain: 'etherscan.deth.net',
    // Deployment of the first L2
    minTimestamp: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
  },
  {
    id: 42161,
    name: 'arbitrum',
    dethDomain: 'arbiscan.deth.net',
    // ~ Timestamp of block number 0 on Arbitrum
    minTimestamp: UnixTime.fromDate(new Date('2021-05-28T22:15:00Z')),
  },
  {
    id: -1,
    name: 'native',
  },
]

ChainId.ETHEREUM = ChainId(CHAIN_IDS[0].id)
ChainId.ARBITRUM = ChainId(CHAIN_IDS[1].id)
ChainId.NMV = ChainId(CHAIN_IDS[2].id)

ChainId.getName = function (chainId: ChainId): string {
  const chain = CHAIN_IDS.find((c) => c.id === +chainId)
  if (!chain) {
    throw new TypeError('Invalid ChainId')
  }
  return chain.name
}

ChainId.getId = function (chainName: string): ChainId {
  const chain = CHAIN_IDS.find((c) => c.name === chainName)
  if (!chain) {
    throw new TypeError('Invalid ChainId')
  }
  return ChainId(chain.id)
}

ChainId.getAll = function (): ChainId[] {
  return CHAIN_IDS.map((c) => ChainId(c.id))
}

ChainId.getDethDomain = function (chainId: ChainId): string {
  const dethDomain = CHAIN_IDS.find((c) => c.id === +chainId)?.dethDomain

  if (!dethDomain) {
    throw new TypeError(`Unsupported chain ID: ${chainId.toString()}`)
  }

  return dethDomain
}

ChainId.getMinTimestamp = function (chainId: ChainId): UnixTime {
  const minTimestamp = CHAIN_IDS.find((c) => c.id === +chainId)?.minTimestamp

  if (!minTimestamp) {
    throw new TypeError(`Unsupported chain ID: ${chainId.toString()}`)
  }

  return minTimestamp
}
