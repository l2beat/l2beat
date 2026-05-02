import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type AaveReserveTokensHandlerDefinition = v.infer<
  typeof AaveReserveTokensHandlerDefinition
>
export const AaveReserveTokensHandlerDefinition = v.strictObject({
  type: v.literal('aaveReserveTokens'),
  // Which token type to collect: 'variableDebt' | 'stableDebt' | 'aToken'
  tokenType: v.union([
    v.literal('variableDebt'),
    v.literal('stableDebt'),
    v.literal('aToken'),
  ]),
  ignoreRelative: v.boolean().optional(),
})

const GET_RESERVES_LIST_ABI =
  'function getReservesList() view returns (address[])'

const GET_VARIABLE_DEBT_TOKEN_ABI =
  'function getReserveVariableDebtToken(address asset) view returns (address)'

const GET_STABLE_DEBT_TOKEN_ABI =
  'function getReserveStableDebtToken(address asset) view returns (address)'

const GET_ATOKEN_ABI =
  'function getReserveAToken(address asset) view returns (address)'

/**
 * Discovers all per-reserve tokens (variableDebt / stableDebt / aToken) for
 * an Aave V3 PoolInstance by iterating over getReservesList() and calling
 * the corresponding per-asset getter for each reserve.
 *
 * Configure on the PoolInstance contract in config.jsonc:
 *
 * ```jsonc
 * "eth:0x87870B...": {
 *   "fields": {
 *     "getAllVariableDebtTokens": {
 *       "handler": { "type": "aaveReserveTokens", "tokenType": "variableDebt" }
 *     }
 *   }
 * }
 * ```
 */
export class AaveReserveTokensHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: AaveReserveTokensHandlerDefinition,
    _abi: string[],
  ) {}

  getMethod(): string {
    return 'aaveReserveTokens'
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    // Step 1: get all underlying reserve asset addresses
    let reserves: unknown
    try {
      reserves = await provider.callMethod<unknown>(
        address,
        GET_RESERVES_LIST_ABI,
        [],
      )
    } catch (e) {
      return {
        field: this.field,
        error: `getReservesList failed: ${e instanceof Error ? e.message : String(e)}`,
      }
    }

    if (!Array.isArray(reserves)) {
      return {
        field: this.field,
        error: `getReservesList returned non-array: ${typeof reserves}`,
      }
    }

    // Step 2: for each asset, call the token-specific getter
    const tokenAbi = this.getTokenAbi()
    const chain = ChainSpecificAddress.chain(address)
    const results: string[] = []

    for (const asset of reserves) {
      // asset comes back from callMethod as a raw '0x...' string
      if (typeof asset !== 'string') continue
      try {
        const tokenAddr = await provider.callMethod<string>(
          address,
          tokenAbi,
          [asset], // pass raw address string, not ChainSpecificAddress
        )
        if (
          typeof tokenAddr === 'string' &&
          tokenAddr !== '0x0000000000000000000000000000000000000000'
        ) {
          results.push(`${chain}:${tokenAddr}`)
        }
      } catch {
        // Skip reserves that revert (e.g. deprecated)
      }
    }

    return {
      field: this.field,
      value: results,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }

  private getTokenAbi(): string {
    switch (this.definition.tokenType) {
      case 'variableDebt':
        return GET_VARIABLE_DEBT_TOKEN_ABI
      case 'stableDebt':
        return GET_STABLE_DEBT_TOKEN_ABI
      case 'aToken':
        return GET_ATOKEN_ABI
    }
  }
}
