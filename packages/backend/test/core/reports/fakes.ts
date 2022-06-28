import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'

import { BridgeInfo, ProjectInfo } from '../../../src/model'

export function fakeProject(id: string, bridges: BridgeInfo[]): ProjectInfo {
  return {
    name: id[0].toUpperCase() + id.slice(1),
    projectId: ProjectId(id),
    bridges,
  }
}
export function fakeBridge(
  address: string,
  sinceBlock: number,
  tokens: TokenInfo[],
): BridgeInfo {
  return {
    address: EthereumAddress('0x' + address + '0'.repeat(40 - address.length)),
    sinceBlock,
    tokens,
  }
}
export function fakeToken(id: string, sinceBlock: number): TokenInfo {
  return {
    name: 'irrelevant',
    symbol: 'irrelevant',
    id: AssetId(id),
    coingeckoId: CoingeckoId('irrelevant'),
    decimals: 18,
    sinceBlock,
    category: 'ether', // irrelevant
  }
}
