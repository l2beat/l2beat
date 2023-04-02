import { ContractValue, EthereumAddress } from '@l2beat/shared'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { DiscoveryLogger } from '../utils/DiscoveryLogger'

export interface HandlerResult {
  field: string
  value?: ContractValue
  error?: string
  ignoreRelative?: boolean
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
