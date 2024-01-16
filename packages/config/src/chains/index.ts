import { notUndefined } from '@l2beat/shared-pure'
import { ChainConfig } from '../common/ChainConfig'
import { layer2s } from '../layer2s'
import { avalanche } from './avalanche'
import { bsc } from './bsc'
import { celo } from './celo'
import { ethereum } from './ethereum'
import { gnosis } from './gnosis'
import { polygonpos } from './polygonpos'

export const chains: ChainConfig[] = [
  ...layer2s.map((layer2) => layer2.chainConfig).filter(notUndefined),
  avalanche,
  bsc,
  celo,
  ethereum,
  gnosis,
  polygonpos,
]

export const chainsByDevId: ReadonlyMap<string, ChainConfig> = new Map(
  chains.map((chain) => [chain.devId, chain]),
)

export const chainsByChainId: ReadonlyMap<number, ChainConfig> = new Map(
  chains.map((chain) => [chain.chainId, chain]),
)
