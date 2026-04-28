import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'

export type MetaMorphoCapHandlerDefinition = v.infer<
  typeof MetaMorphoCapHandlerDefinition
>
export const MetaMorphoCapHandlerDefinition = v.strictObject({
  type: v.literal('metaMorphoCap'),
  // Mode 'market': return the cap of a single market (param: marketId).
  // Mode 'feed': sum the caps of every market whose oracle adapter consumes
  // the given Chainlink feed (params: feed, morphoAddressField).
  mode: v.union([v.literal('market'), v.literal('feed')]),
  // Mode 'market': the bytes32 market id to read.
  marketId: v.string().optional(),
  // Mode 'feed': the underlying Chainlink feed to look up across markets.
  feed: v.string().optional(),
  // Field on the vault containing the Morpho Blue address. Defaults to "MORPHO".
  morphoAddressField: v.string().optional(),
  // Field on the vault containing the supply queue. Defaults to "supplyQueue".
  queueField: v.string().optional(),
})

const CONFIG_ABI =
  'function config(bytes32) view returns (uint184 cap, bool enabled, uint64 removableAt)'
const ID_TO_MARKET_PARAMS_ABI =
  'function idToMarketParams(bytes32) view returns (address loanToken, address collateralToken, address oracle, address irm, uint256 lltv)'
const FEED_FIELDS = [
  'BASE_FEED_1',
  'BASE_FEED_2',
  'QUOTE_FEED_1',
  'QUOTE_FEED_2',
] as const
const ADAPTER_FEED_ABI = FEED_FIELDS.map(
  (f) => `function ${f}() view returns (address)`,
)

export class MetaMorphoCapHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: MetaMorphoCapHandlerDefinition,
    _abi: string[],
  ) {
    if (definition.mode === 'market' && !definition.marketId) {
      throw new Error('metaMorphoCap mode=market requires "marketId"')
    }
    if (definition.mode === 'feed' && !definition.feed) {
      throw new Error('metaMorphoCap mode=feed requires "feed"')
    }
    if (definition.mode === 'feed') {
      this.dependencies.push(definition.queueField ?? 'supplyQueue')
      this.dependencies.push(definition.morphoAddressField ?? 'MORPHO')
    }
  }

  getMethod(): string {
    return 'metaMorphoCap'
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    if (this.definition.mode === 'market') {
      return this.executeMarket(provider, address)
    }
    return this.executeFeed(provider, address, previousResults)
  }

  private async executeMarket(
    provider: IProvider,
    vault: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const cap = await this.readCap(provider, vault, this.definition.marketId!)
    if (cap === undefined) {
      return {
        field: this.field,
        error: `config(${this.definition.marketId}) reverted on ${vault}`,
      }
    }
    return { field: this.field, value: cap }
  }

  private async executeFeed(
    provider: IProvider,
    vault: ChainSpecificAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    const queueField = this.definition.queueField ?? 'supplyQueue'
    const morphoField = this.definition.morphoAddressField ?? 'MORPHO'

    const queueResult = previousResults[queueField]
    if (
      !queueResult ||
      queueResult.error ||
      !Array.isArray(queueResult.value)
    ) {
      return {
        field: this.field,
        error: `Cannot resolve "${queueField}" on ${vault}`,
      }
    }
    const morphoResult = previousResults[morphoField]
    if (
      !morphoResult ||
      morphoResult.error ||
      typeof morphoResult.value !== 'string'
    ) {
      return {
        field: this.field,
        error: `Cannot resolve "${morphoField}" on ${vault}`,
      }
    }

    const chain = ChainSpecificAddress.chain(vault)
    const morpho = ChainSpecificAddress(`${chain}:${morphoResult.value}`)
    const targetFeed = this.definition.feed!.toLowerCase()

    let total = 0n
    for (const marketId of queueResult.value) {
      if (typeof marketId !== 'string') continue

      const params = await provider.callMethod<unknown[]>(
        morpho,
        ID_TO_MARKET_PARAMS_ABI,
        [marketId],
      )
      if (!Array.isArray(params) || params.length < 3) continue
      const oracleRaw = params[2]
      if (typeof oracleRaw !== 'string') continue
      if (oracleRaw === '0x0000000000000000000000000000000000000000') continue
      const adapter = ChainSpecificAddress(`${chain}:${oracleRaw}`)

      // Walk the four feed fields on the adapter, looking for a match
      let matched = false
      for (const abi of ADAPTER_FEED_ABI) {
        const feedAddr = await provider.callMethod<string>(adapter, abi, [])
        if (typeof feedAddr !== 'string') continue
        if (feedAddr.toLowerCase() === targetFeed) {
          matched = true
          break
        }
      }
      if (!matched) continue

      const cap = await this.readCap(provider, vault, marketId)
      if (cap === undefined) continue
      total += BigInt(cap)
    }

    return { field: this.field, value: total.toString() }
  }

  private async readCap(
    provider: IProvider,
    vault: ChainSpecificAddress,
    marketId: string,
  ): Promise<string | undefined> {
    const result = await provider.callMethod<unknown>(vault, CONFIG_ABI, [
      marketId,
    ])
    if (result === undefined || result === null) return undefined
    const value = toContractValue(result)
    let cap: unknown
    if (Array.isArray(value)) {
      cap = value[0]
    } else if (typeof value === 'object' && value !== null) {
      cap = (value as Record<string, unknown>).cap
    } else {
      cap = value
    }
    if (typeof cap === 'bigint') return cap.toString()
    if (typeof cap === 'number') return cap.toString()
    if (typeof cap === 'string') return cap
    return undefined
  }
}
