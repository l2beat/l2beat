import type { ContractValue } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import type { ContractConfig } from '../config/ContractConfig'
import type { DiscoveryCustomType } from '../config/RawDiscoveryConfig'
import type { IProvider } from '../provider/IProvider'
import type { HandlerResult } from './Handler'
import { decodeHandlerResults } from './decodeHandlerResults'
import { executeHandlers } from './executeHandlers'
import { getHandlers } from './getHandlers'

export class HandlerExecutor {
  async execute(
    provider: IProvider,
    address: EthereumAddress,
    abi: string[],
    config: ContractConfig,
  ): Promise<{
    results: HandlerResult[]
    values: Record<string, ContractValue | undefined> | undefined
    errors: Record<string, string>
    usedTypes: DiscoveryCustomType[]
  }> {
    const handlers = getHandlers(abi, config)
    const results = await executeHandlers(provider, handlers, address)
    const { values, errors, usedTypes } = decodeHandlerResults(
      results,
      config.fields,
      config.types,
    )
    return { results, values, errors, usedTypes }
  }
}
