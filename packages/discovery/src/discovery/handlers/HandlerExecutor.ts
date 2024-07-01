import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import { DiscoveryCustomType } from '../config/RawDiscoveryConfig'
import { IProvider } from '../provider/IProvider'
import { HandlerResult } from './Handler'
import { executeHandlers } from './executeHandlers'
import { getHandlers } from './getHandlers'
import { getValuesAndErrors } from './getValuesAndErrors'

export class HandlerExecutor {
  async execute(
    provider: IProvider,
    address: EthereumAddress,
    abi: string[],
    overrides: ContractOverrides | undefined,
    types: Record<string, DiscoveryCustomType> | undefined,
    logger: DiscoveryLogger,
  ): Promise<{
    results: HandlerResult[]
    values: Record<string, ContractValue> | undefined
    errors: Record<string, string> | undefined
    usedTypes: DiscoveryCustomType[]
  }> {
    const handlers = getHandlers(abi, overrides, logger)
    const results = await executeHandlers(provider, handlers, address, logger)
    const { values, errors, usedTypes } = getValuesAndErrors(
      results,
      overrides?.fields,
      types,
    )
    return { results, values, errors, usedTypes }
  }
}
