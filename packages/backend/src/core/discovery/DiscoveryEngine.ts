import { AddressAnalyzer } from '@l2beat/common'
import { providers } from 'ethers'
import { writeFile } from 'fs/promises'

import { discover } from './discover'
import { DiscoveryOptions } from './DiscoveryOptions'
import { ProjectParameters } from './types'

export class DiscoveryEngine {
  constructor(
    readonly provider: providers.Provider,
    private readonly addressAnalyzer: AddressAnalyzer,
  ) {}

  async discover(
    name: string,
    addresses: string[],
    options: Partial<DiscoveryOptions> = {},
  ) {
    const result = await discover(
      this.provider,
      this.addressAnalyzer,
      addresses,
      {
        skipAddresses: [],
        skipMethods: {},
        addAbis: {},
        ...options,
      },
    )

    const project: ProjectParameters = {
      name,
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

    // Temporarily commenting out saving abis to separate files.

    // for (const entry of result) {
    //   if (entry.meta.abi.length > 0) {
    //     await writeFile(
    //       `dist/discovery/abi/${entry.address}.json`,
    //       JSON.stringify(entry.meta.abi, null, 2),
    //     )
    //   }
    // }
  }
}
