import { EthereumAddress } from '@l2beat/shared'

import { ContractOverrides } from '../config/DiscoveryOverrides'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { DiscoveryLogger } from '../utils/DiscoveryLogger'
import { executeHandlers } from './executeHandlers'
import { getHandlers } from './getHandlers'
import { getValuesAndErrors } from './getValuesAndErrors'

export class HandlerExecutor {
  constructor(
    private readonly provider: DiscoveryProvider,
    private readonly logger: DiscoveryLogger,
  ) {}

  async execute(
    address: EthereumAddress,
    abi: string[],
    overrides: ContractOverrides | undefined,
    blockNumber: number,
  ) {
    const handlers = getHandlers(abi, overrides, this.logger)
    const results = await executeHandlers(
      this.provider,
      handlers,
      address,
      blockNumber,
    )
    const { values, errors } = getValuesAndErrors(results)
    return { results, values, errors }
  }
}
