import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { BigNumber, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type CCIPRateLimitHandlerDefinition = v.infer<
  typeof CCIPRateLimitHandlerDefinition
>
export const CCIPRateLimitHandlerDefinition = v.strictObject({
  type: v.literal('ccipRateLimit'),
  direction: v.union([v.literal('inbound'), v.literal('outbound')]),
  chainSelector: v.string(),
})

const inboundFragment = utils.FunctionFragment.from(
  'getCurrentInboundRateLimiterState(uint64) view returns (tuple(uint128 tokens, uint32 lastUpdated, bool isEnabled, uint128 capacity, uint128 rate))',
)
const outboundFragment = utils.FunctionFragment.from(
  'getCurrentOutboundRateLimiterState(uint64) view returns (tuple(uint128 tokens, uint32 lastUpdated, bool isEnabled, uint128 capacity, uint128 rate))',
)

/**
 * Discovers the CCIP BurnMintTokenPool rate limiter config for a specific
 * remote chain. Returns ONLY the admin-controlled config fields
 * (isEnabled, capacity, rate) — strips the dynamic `tokens` and
 * `lastUpdated` fields that change continuously as the token bucket
 * refills. This way watch-mode only alerts on actual admin changes to
 * the rate limit configuration.
 */
export class CCIPRateLimitHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: CCIPRateLimitHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    try {
      const fragment =
        this.definition.direction === 'inbound'
          ? inboundFragment
          : outboundFragment

      const state = await provider.callMethod<unknown[]>(address, fragment, [
        BigNumber.from(this.definition.chainSelector),
      ])

      if (!state || !Array.isArray(state)) {
        return {
          field: this.field,
          error: 'Rate limiter state not returned or unexpected shape',
        }
      }

      // Tuple layout: (tokens, lastUpdated, isEnabled, capacity, rate)
      // Strip tokens and lastUpdated (dynamic state) to keep watch-mode
      // quiet, since those change with every transfer and time tick.
      const isEnabled = state[2] as boolean
      const capacity = state[3] as BigNumber
      const rate = state[4] as BigNumber

      return {
        field: this.field,
        value: {
          isEnabled,
          capacity: capacity.toString(),
          rate: rate.toString(),
        },
      }
    } catch (e) {
      return {
        field: this.field,
        error: e instanceof Error ? e.message : 'Unknown error',
      }
    }
  }
}
