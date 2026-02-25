import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { generateReferenceInput, resolveReference } from '../reference'
import { toContractValue } from '../utils/toContractValue'

export type MorphoMarketsHandlerDefinition = v.infer<
  typeof MorphoMarketsHandlerDefinition
>
export const MorphoMarketsHandlerDefinition = v.strictObject({
  type: v.literal('morphoMarkets'),
  // Field name containing the Morpho Blue core contract address (e.g. "MORPHO")
  morphoAddressField: v.string().optional(),
  // Direct Morpho Blue address (chain-specific, e.g. "eth:0xBBBB...")
  morphoAddress: v.string().optional(),
  // Field name containing the supply queue market IDs array (default: "supplyQueue")
  queueField: v.string().optional(),
  // Extract only specific address fields from a previously computed marketParams result.
  // When set, reads from previousResults[sourceField] instead of making RPC calls.
  // Use this for a second config field that follows only certain addresses (e.g. "oracle").
  extractField: v.string().optional(),
  // The field name to read cached market data from (used with extractField, default: "marketParams")
  sourceField: v.string().optional(),
  ignoreRelative: v.boolean().optional(),
})

const ID_TO_MARKET_PARAMS_ABI =
  'function idToMarketParams(bytes32) view returns (address loanToken, address collateralToken, address oracle, address irm, uint256 lltv)'

export class MorphoMarketsHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: MorphoMarketsHandlerDefinition,
    _abi: string[],
  ) {
    if (definition.extractField) {
      // Extract mode: depend on the source field (where market data was already fetched)
      this.dependencies.push(definition.sourceField ?? 'marketParams')
    } else {
      // Fetch mode: depend on the queue field and morpho address field
      const queueField = definition.queueField ?? 'supplyQueue'
      this.dependencies.push(queueField)

      if (definition.morphoAddressField) {
        this.dependencies.push(definition.morphoAddressField)
      }
    }
  }

  getMethod(): string {
    return 'morphoMarkets'
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    // Extract mode: read from previously computed market data
    if (this.definition.extractField) {
      return this.executeExtract(previousResults)
    }

    // Fetch mode: make RPC calls to get market params
    return this.executeFetch(provider, address, previousResults)
  }

  private executeExtract(
    previousResults: Record<string, HandlerResult | undefined>,
  ): HandlerResult {
    const sourceField = this.definition.sourceField ?? 'marketParams'
    const extractField = this.definition.extractField!
    const sourceResult = previousResults[sourceField]

    if (!sourceResult || !Array.isArray(sourceResult.value)) {
      return {
        field: this.field,
        error: `Cannot read market data from "${sourceField}"`,
      }
    }

    // Extract the specified field from each market entry
    const addresses: ContractValue[] = []
    for (const market of sourceResult.value) {
      if (
        typeof market === 'object' &&
        market !== null &&
        !Array.isArray(market)
      ) {
        const addr = (market as Record<string, ContractValue>)[extractField]
        if (typeof addr === 'string') {
          addresses.push(addr)
        }
      }
    }

    return {
      field: this.field,
      value: addresses,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }

  private async executeFetch(
    provider: IProvider,
    address: ChainSpecificAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    const referenceInput = generateReferenceInput(
      previousResults,
      provider,
      address,
    )

    // Resolve the Morpho Blue address
    let morphoAddress: ChainSpecificAddress
    if (this.definition.morphoAddress) {
      morphoAddress = ChainSpecificAddress(this.definition.morphoAddress)
    } else {
      const fieldName = this.definition.morphoAddressField ?? 'MORPHO'
      const rawAddress = resolveReference(`{{ ${fieldName} }}`, referenceInput)
      if (typeof rawAddress !== 'string') {
        return {
          field: this.field,
          error: `Cannot resolve Morpho address from field "${fieldName}"`,
        }
      }
      // The raw value from handler results is just "0x..." without chain prefix
      // We need to add the chain prefix from the current contract
      const chain = ChainSpecificAddress.chain(address)
      morphoAddress = ChainSpecificAddress(`${chain}:${rawAddress}`)
    }

    // Resolve the supply queue
    const queueField = this.definition.queueField ?? 'supplyQueue'
    const queueResult = previousResults[queueField]
    if (!queueResult || queueResult.error) {
      return {
        field: this.field,
        error: `Cannot resolve supply queue from field "${queueField}": ${queueResult?.error ?? 'missing'}`,
      }
    }

    const queue = queueResult.value
    if (!Array.isArray(queue)) {
      return {
        field: this.field,
        error: `Expected array for "${queueField}", got ${typeof queue}`,
      }
    }

    // For each market ID, call idToMarketParams on the Morpho contract
    const markets: ContractValue[] = []
    for (const marketId of queue) {
      if (typeof marketId !== 'string') {
        markets.push({ error: `Invalid market ID: ${marketId}` })
        continue
      }

      try {
        const result = await provider.callMethod<unknown[]>(
          morphoAddress,
          ID_TO_MARKET_PARAMS_ABI,
          [marketId],
        )

        if (result === undefined) {
          markets.push({ marketId, error: 'Execution reverted' })
          continue
        }

        const value = toContractValue(result)
        if (Array.isArray(value) && value.length === 5) {
          markets.push({
            marketId: marketId as ContractValue,
            loanToken: value[0]!,
            collateralToken: value[1]!,
            oracle: value[2]!,
            irm: value[3]!,
            lltv: value[4]!,
          })
        } else {
          markets.push({ marketId, raw: value })
        }
      } catch (e) {
        markets.push({
          marketId,
          error: e instanceof Error ? e.message : String(e),
        })
      }
    }

    return {
      field: this.field,
      value: markets,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
