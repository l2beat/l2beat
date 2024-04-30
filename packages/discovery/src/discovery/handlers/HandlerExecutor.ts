import { ContractValue } from '@l2beat/discovery-types'

import { EthereumAddress } from '../../utils/EthereumAddress'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { MulticallClient } from '../provider/multicall/MulticallClient'
import { executeHandlers } from './executeHandlers'
import { getHandlers } from './getHandlers'
import { getValuesAndErrors } from './getValuesAndErrors'
import { HandlerResult } from './Handler'

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
    blockNumber: number,
    logger: DiscoveryLogger,
  ): Promise<{
    results: HandlerResult[]
    values: Record<string, ContractValue> | undefined
    errors: Record<string, string> | undefined
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
    const { values, errors } = getValuesAndErrors(results)
    return { results, values, errors }
  }
}
