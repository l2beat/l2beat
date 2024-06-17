import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import { DiscoveryCustomType } from '../config/RawDiscoveryConfig'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { MulticallClient } from '../provider/multicall/MulticallClient'
import { HandlerResult } from './Handler'
import { executeHandlers } from './executeHandlers'
import { getHandlers } from './getHandlers'
import { getValuesAndErrors } from './getValuesAndErrors'

export class HandlerExecutor {
  constructor(
    private readonly provider: DiscoveryProvider,
    private readonly multicallClient: MulticallClient,
    private readonly logger: DiscoveryLogger,
  ) {}

  async execute(
    address: EthereumAddress,
    abi: string[],
    overrides: ContractOverrides | undefined,
    types: Record<string, DiscoveryCustomType> | undefined,
    blockNumber: number,
    logger: DiscoveryLogger,
  ): Promise<{
    results: HandlerResult[]
    values: Record<string, ContractValue> | undefined
    errors: Record<string, string> | undefined
    usedTypes: DiscoveryCustomType[]
  }> {
    const handlers = getHandlers(abi, overrides, logger)
    const results = await executeHandlers(
      this.provider,
      this.multicallClient,
      handlers,
      address,
      blockNumber,
      logger,
    )
    const { values, errors, usedTypes } = getValuesAndErrors(
      results,
      overrides?.fields,
      types,
    )
    return { results, values, errors, usedTypes }
  }
}
