import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { existsSync, readFileSync } from 'fs'
import { posix } from 'path'
import { getDiscoveryPaths } from '../../config/getDiscoveryPaths'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

/**
 * Reads pre-fetched Morpho data from a JSON file (produced by `l2b morpho-fetch`)
 * and exposes a slice of it as a field value. This lets discovery *reuse* the
 * separately fetched vaults/markets instead of querying logs live.
 *
 * The file shape is:
 *   {
 *     entries: { address, type, name, values: {id, loanToken, ...} }[],
 *     vaults: ChainSpecificAddress[],
 *     vaultMarkets: Record<ChainSpecificAddress, ChainSpecificAddress[]>
 *   }
 */
export type MorphoDataHandlerDefinition = v.infer<
  typeof MorphoDataHandlerDefinition
>
export const MorphoDataHandlerDefinition = v.strictObject({
  type: v.literal('morphoData'),
  // Path to the fetched JSON, relative to the discovery root.
  file: v.string(),
  select: v.enum(['markets', 'vaults', 'vaultMarkets']),
  // Set on the synthetic-market field so the fake market addresses are not
  // queued for discovery.
  ignoreRelative: v.boolean().optional(),
})

interface MorphoData {
  entries?: { address: string; values?: Record<string, ContractValue> }[]
  vaults?: string[]
  vaultMarkets?: Record<string, string[]>
}

export class MorphoDataHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: MorphoDataHandlerDefinition,
  ) {}

  // biome-ignore lint/suspicious/useAwait: implements the async Handler.execute interface
  async execute(
    _provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const filePath = posix.join(
      getDiscoveryPaths().discovery,
      this.definition.file,
    )
    if (!existsSync(filePath)) {
      return {
        field: this.field,
        error: `Morpho data file not found: ${filePath}. Run 'l2b morpho-fetch' first.`,
      }
    }

    const data = JSON.parse(readFileSync(filePath, 'utf-8')) as MorphoData

    let value: ContractValue
    switch (this.definition.select) {
      case 'markets':
        // The 5 params per market (loanToken/collateralToken/oracle/irm become
        // relatives so they are discovered as real nodes; id/lltv are scalars).
        value = (data.entries ?? []).map((entry) => entry.values ?? {})
        break
      case 'vaults':
        value = data.vaults ?? []
        break
      case 'vaultMarkets':
        value = data.vaultMarkets?.[address.toString()] ?? []
        break
    }

    return {
      field: this.field,
      value,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
