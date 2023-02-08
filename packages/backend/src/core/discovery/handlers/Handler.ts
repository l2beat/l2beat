import { EthereumAddress } from '@l2beat/shared'

import { DiscoveryLogger } from '../DiscoveryLogger'
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
  logger?: DiscoveryLogger
  execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult>
}
