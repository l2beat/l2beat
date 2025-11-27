import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { DiscoveryCustomType } from '../config/StructureConfig.js'
import type { StructureContractConfig } from '../config/structureUtils.js'
import type { ContractValue } from '../output/types.js'
import type { IProvider } from '../provider/IProvider.js'
import { decodeHandlerResults } from './decodeHandlerResults.js'
import { executeHandlers } from './executeHandlers.js'
import { getHandlers } from './getHandlers.js'
import type { HandlerResult } from './Handler.js'

export class HandlerExecutor {
  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
    abi: string[],
    config: StructureContractConfig,
  ): Promise<{
    results: HandlerResult[]
    values: Record<string, ContractValue | undefined> | undefined
    errors: Record<string, string>
    usedTypes: DiscoveryCustomType[]
  }> {
    const handlers = getHandlers(abi, config)
    const results = await executeHandlers(provider, handlers, address)
    const { values, errors, usedTypes } = decodeHandlerResults(
      provider.chain,
      results,
      config.fields,
      config.types,
    )
    return { results, values, errors, usedTypes }
  }
}
