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
  dependencies: string[]
  execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult>
}
