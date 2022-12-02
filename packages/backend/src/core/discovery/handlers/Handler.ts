import { EthereumAddress } from '@l2beat/types'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { ContractValue } from '../types'

export interface HandlerResult {
  field: string
  value?: ContractValue
  error?: string
}

export interface Handler {
  field: string
  execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    abi: string[],
  ): Promise<HandlerResult>
}
