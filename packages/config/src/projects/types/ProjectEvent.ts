import { EthereumAddress } from '@l2beat/common'
import { utils } from 'ethers'

export interface ProjectEvent {
  abi: utils.Interface
  name: string
  emitter: EthereumAddress
  type: 'state' | 'data'
}
