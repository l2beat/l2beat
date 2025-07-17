import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { DiscoveryCustomType } from '../config/StructureConfig'
import type { StructureContractConfig } from '../config/structureUtils'
import type { ContractValue } from '../output/types'
import type { IProvider } from '../provider/IProvider'
import { decodeHandlerResults } from './decodeHandlerResults'
import { executeHandlers } from './executeHandlers'
import { getHandlers } from './getHandlers'
import type { HandlerResult } from './Handler'

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
