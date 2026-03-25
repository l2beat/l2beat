import * as fs from 'fs'
import * as path from 'path'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type AddressMappingHandlerDefinition = v.infer<
  typeof AddressMappingHandlerDefinition
>
export const AddressMappingHandlerDefinition = v.strictObject({
  type: v.literal('addressMapping'),
  method: v.string().optional(),
  discoveredJson: v.string().optional(),
  ignoreRelative: v.boolean().optional(),
})

function loadAddressesFromDiscoveredJson(filePath: string): string[] {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    const addresses: string[] = []
    for (const entry of data.entries ?? []) {
      if (entry.address) {
        addresses.push(entry.address)
      }
    }
    return addresses
  } catch {
    return []
  }
}

export class AddressMappingHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: AddressMappingHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const method = this.definition.method ?? this.field
    const fragment = utils.FunctionFragment.from(
      `${method}(address) view returns (bool)`,
    )

    // Load addresses from discovered.json
    const discoveredPath = this.definition.discoveredJson
      ? path.resolve(process.cwd(), this.definition.discoveredJson)
      : path.resolve(process.cwd(), 'discovered.json')

    const candidates = loadAddressesFromDiscoveredJson(discoveredPath)

    if (candidates.length === 0) {
      return {
        field: this.field,
        value: [],
        ignoreRelative: this.definition.ignoreRelative,
      }
    }

    const chain = ChainSpecificAddress.chain(address)
    const results: string[] = []

    for (const candidate of candidates) {
      // Strip chain prefix to get raw address for the call
      const rawAddress = candidate.includes(':')
        ? candidate.split(':').slice(1).join(':')
        : candidate
      try {
        const result = await provider.callMethod<boolean>(address, fragment, [
          rawAddress,
        ])
        if (result === true) {
          results.push(
            ChainSpecificAddress.from(
              chain,
              EthereumAddress(rawAddress),
            ).toString(),
          )
        }
      } catch {
        // Skip addresses that revert
      }
    }

    return {
      field: this.field,
      value: results,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
