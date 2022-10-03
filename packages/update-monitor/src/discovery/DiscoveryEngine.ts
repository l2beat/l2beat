import { AddressAnalyzer } from '@l2beat/common'
import { providers } from 'ethers'
import { writeFile } from 'fs/promises'
import mkdirp from 'mkdirp'

import { ProjectParameters } from '../types'
import { discover } from './discover'
import { DiscoveryOptions } from './DiscoveryOptions'

export class DiscoveryEngine {
  constructor(
    private readonly provider: providers.Provider,
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

    await mkdirp('dist/discovery/abi')
    await writeFile(
      `dist/discovery/${name}.json`,
      JSON.stringify(project, null, 2),
    )
    for (const entry of result) {
      if (entry.meta.abi.length > 0) {
        await writeFile(
          `dist/discovery/abi/${entry.address}.json`,
          JSON.stringify(entry.meta.abi, null, 2),
        )
      }
    }
  }
}
