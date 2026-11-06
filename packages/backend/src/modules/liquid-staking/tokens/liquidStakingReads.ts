import type { CallParameters, MulticallV3Response } from '@l2beat/shared'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { LiquidStakingProjectConfig } from '../types'
import { returnData } from './calls'
import { getMarketQuote } from './marketQuotes'
import { getEtherFiReads } from './protocols/etherfi'
import { getLidoReads } from './protocols/lido'
import { getRocketPoolReads } from './protocols/rocketpool'
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
  const quotes = project.marketQuotes.map((quote) =>
    getMarketQuote(protocol.token, quote),
  )
  const calls = [
    ...reads.map(([_, call]) => call),
    ...quotes.map((quote) => quote.call),
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

      const best = quotes
        .map((quote, i) =>
          quote.decode(responses[reads.length + i] as MulticallV3Response),
        )
        .reduce<bigint | undefined>(
          (best, out) =>
            out !== undefined && (best === undefined || out > best)
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
  }
}
