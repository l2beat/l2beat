import { EthereumAddress } from '@l2beat/types'
import { writeFile } from 'fs/promises'

import { discover } from './discover'
import { DiscoveryOptions } from './DiscoveryOptions'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { ProjectParameters } from './types'

export class DiscoveryEngine {
  async discover(
    provider: DiscoveryProvider,
    name: string,
    addresses: EthereumAddress[],
    options: DiscoveryOptions,
  ) {
    const result = await discover(provider, addresses, options)

    const project: ProjectParameters = {
      name,
      blockNumber: provider.blockNumber,
      contracts: result
        .filter((x) => !x.meta.isEOA)
        .map((x) => ({
          ...x,
          meta: undefined,
        })),
    }

    await writeFile(
      `discovery/${name}/discovered.json`,
      JSON.stringify(project, null, 2),
    )
  }
}
