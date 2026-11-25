import type { CallParameters, MulticallV3Response } from '@l2beat/shared'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { LiquidStakingProjectConfig } from '../types'
import { returnData } from './calls'
import { getMarketQuote } from './marketQuotes'
import { getCbethReads } from './protocols/cbeth'
import { getEtherFiReads } from './protocols/etherfi'
import { getLidoReads } from './protocols/lido'
import { getRateReads } from './protocols/rate'
import { getRocketPoolReads } from './protocols/rocketpool'
import { getStakeWiseReads } from './protocols/stakewise'
import type { LiquidStakingState, ProtocolReads } from './protocols/types'
import { getWbethReads } from './protocols/wbeth'

export interface LiquidStakingReads {
  calls: CallParameters[]
  /** Throws if one of the protocol's reads failed; a quote can fail. */
  toState: (
    responses: MulticallV3Response[],
    timestamp: UnixTime,
  ) => LiquidStakingState
}

/** A project's reads at `blockNumber`, its protocol's and then the quotes. */
export function getLiquidStakingReads(
  project: Pick<LiquidStakingProjectConfig, 'contracts' | 'marketQuotes'>,
  blockNumber: number,
): LiquidStakingReads {
  const protocol = getProtocolReads(project.contracts, blockNumber)
  const reads = Object.entries(protocol.calls)
  const quotes = project.marketQuotes
    .filter(
      (quote) =>
        !(
          quote.type === 'balancerV2' &&
          quote.untilBlock !== undefined &&
          blockNumber >= quote.untilBlock
        ),
    )
    .map((quote) => getMarketQuote(protocol.token, quote))
  const calls = [
    ...reads.map(([_, call]) => call),
    ...quotes.flatMap((quote) => quote.calls),
  ]

  return {
    calls,
    toState: (responses, timestamp) => {
      assert(
        responses.length === calls.length,
        'Unexpected number of multicall responses',
      )
      const results = Object.fromEntries(
        reads.map(([name, call], i) => {
          const data = returnData(responses[i] as MulticallV3Response)
          if (data === undefined) {
            throw new Error('Liquid staking call reverted', {
              cause: { read: name, to: call.to },
            })
          }
          return [name, data]
        }),
      )
      const state = protocol.toState(results, timestamp)

      let next = reads.length
      const best = quotes
        .map((quote) => {
          const own = responses.slice(next, next + quote.calls.length)
          next += quote.calls.length
          return quote.decode(own)
        })
        .reduce<bigint | undefined>(
          // A sale that pays nothing wasn't filled.
          (best, out) =>
            out !== undefined && out > 0n && (best === undefined || out > best)
              ? out
              : best,
          undefined,
        )
      return {
        ...state,
        marketExitEth: best ?? null,
        marketExitValueEth:
          best === undefined ? null : protocol.saleValue(state.exchangeRate),
      }
    },
  }
}

function getProtocolReads(
  contracts: LiquidStakingProjectConfig['contracts'],
  blockNumber: number,
): ProtocolReads {
  switch (contracts.type) {
    case 'lido':
      return getLidoReads(contracts)
    case 'rocketpool':
      return getRocketPoolReads(contracts)
    case 'etherfi':
      return getEtherFiReads(contracts, blockNumber)
    case 'wbeth':
      return getWbethReads(contracts)
    case 'cbeth':
      return getCbethReads(contracts)
    case 'stakewise':
      return getStakeWiseReads(contracts, blockNumber)
    case 'rate':
      return getRateReads(contracts)
  }
}
