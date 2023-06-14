import { ContractValue, EthereumAddress } from '@l2beat/shared-pure'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'

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
    blockNumber: number,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult>
}
