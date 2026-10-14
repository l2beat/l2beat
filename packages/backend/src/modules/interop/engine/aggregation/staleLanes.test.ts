import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { AggregationResult } from './InteropAggregationService'
import {
  carryForwardStaleLanes,
  getStaleChains,
  MAX_CARRY_FORWARD_AGE,
} from './staleLanes'
import { aggregatedToken, aggregatedTransfer } from './test/fixtures'

// Rows are labeled by transferCount: 1 = fresh, 10 = previous snapshot, so a
// merged result shows at a glance which side each lane came from.
describe('staleLanes', () => {
  describe(getStaleChains.name, () => {
    it("marks the plugin's bridge type and unknown on its lagging chains", () => {
      const stale = getStaleChains(
        [
          {
            id: 'p',
            plugins: [{ plugin: 'across', bridgeType: 'nonMinting' }],
          },
        ],
        new Map([['across', new Set(['avalanche'])]]),
      )

      expect(stale).toEqual(
        new Map([
          ['p:nonMinting', new Set(['avalanche'])],
          ['p:unknown', new Set(['avalanche'])],
        ]),
      )
    })

    it('unions lagging chains of all plugins sharing a bridge type', () => {
      const stale = getStaleChains(
        [
          {
            id: 'p',
            plugins: [
              { plugin: 'a', bridgeType: 'lockAndMint' },
              { plugin: 'b', bridgeType: 'lockAndMint' },
              { plugin: 'fresh', bridgeType: 'nonMinting' },
            ],
          },
        ],
        new Map([
          ['a', new Set(['base'])],
          ['b', new Set(['avalanche'])],
        ]),
      )

      expect(stale).toEqual(
        new Map([
          ['p:lockAndMint', new Set(['base', 'avalanche'])],
          ['p:unknown', new Set(['base', 'avalanche'])],
        ]),
      )
    })

    it('ignores projects whose plugins do not lag', () => {
      const stale = getStaleChains(
        [{ id: 'p', plugins: [{ plugin: 'relay', bridgeType: 'nonMinting' }] }],
        new Map([['across', new Set(['avalanche'])]]),
      )

      expect(stale).toEqual(new Map())
    })
  })

  describe(carryForwardStaleLanes.name, () => {
    const to = UnixTime(30 * UnixTime.DAY)
    const previousTimestamp = to - UnixTime.HOUR
    const stale = getStaleChains(
      [{ id: 'p', plugins: [{ plugin: 'across', bridgeType: 'nonMinting' }] }],
      new Map([['across', new Set(['avalanche'])]]),
    )

    it('replaces stale lanes with previous rows re-stamped and marked', () => {
      const result = carryForwardStaleLanes(
        snapshot({
          transfers: [
            aggregatedTransfer('p', 'ethereum', 'avalanche', to, 1),
            aggregatedTransfer('p', 'ethereum', 'base', to, 1),
          ],
          tokens: [aggregatedToken('p', 'ethereum', 'avalanche', to, 1)],
        }),
        snapshot({
          transfers: [
            aggregatedTransfer(
              'p',
              'ethereum',
              'avalanche',
              previousTimestamp,
              10,
            ),
            aggregatedTransfer('p', 'ethereum', 'base', previousTimestamp, 10),
          ],
          tokens: [
            aggregatedToken(
              'p',
              'ethereum',
              'avalanche',
              previousTimestamp,
              10,
            ),
          ],
        }),
        stale,
        to,
      )

      expect(result).toEqual(
        snapshot({
          transfers: [
            aggregatedTransfer('p', 'ethereum', 'base', to, 1),
            aggregatedTransfer('p', 'ethereum', 'avalanche', to, 10, {
              carriedFrom: previousTimestamp,
            }),
          ],
          tokens: [aggregatedToken('p', 'ethereum', 'avalanche', to, 10)],
        }),
      )
    })

    it('keeps pointing a lane carried more than once at where it was computed', () => {
      const computedAt = previousTimestamp - UnixTime.HOUR

      const result = carryForwardStaleLanes(
        snapshot({}),
        snapshot({
          transfers: [
            aggregatedTransfer(
              'p',
              'avalanche',
              'base',
              previousTimestamp,
              10,
              {
                carriedFrom: computedAt,
              },
            ),
          ],
        }),
        stale,
        to,
      )

      expect(result.aggregatedTransfers).toEqual([
        aggregatedTransfer('p', 'avalanche', 'base', to, 10, {
          carriedFrom: computedAt,
        }),
      ])
    })

    it('carries only the bridge types whose plugins lag', () => {
      const result = carryForwardStaleLanes(
        snapshot({
          transfers: [
            aggregatedTransfer('p', 'ethereum', 'avalanche', to, 1, {
              bridgeType: 'lockAndMint',
            }),
          ],
        }),
        snapshot({
          transfers: [
            aggregatedTransfer(
              'p',
              'ethereum',
              'avalanche',
              previousTimestamp,
              10,
              {
                bridgeType: 'lockAndMint',
              },
            ),
          ],
        }),
        stale,
        to,
      )

      expect(result.aggregatedTransfers).toEqual([
        aggregatedTransfer('p', 'ethereum', 'avalanche', to, 1, {
          bridgeType: 'lockAndMint',
        }),
      ])
    })

    it('keeps fresh rows of a stale lane missing from the previous snapshot', () => {
      const fresh = snapshot({
        transfers: [aggregatedTransfer('p', 'ethereum', 'avalanche', to, 1)],
        tokens: [aggregatedToken('p', 'ethereum', 'avalanche', to, 1)],
      })

      expect(carryForwardStaleLanes(fresh, snapshot({}), stale, to)).toEqual(
        fresh,
      )
    })

    it('keeps fresh rows once the carried data is older than the limit', () => {
      const fresh = snapshot({
        transfers: [aggregatedTransfer('p', 'ethereum', 'avalanche', to, 1)],
      })
      const previous = snapshot({
        transfers: [
          aggregatedTransfer(
            'p',
            'ethereum',
            'avalanche',
            previousTimestamp,
            10,
            {
              carriedFrom: to - MAX_CARRY_FORWARD_AGE - 1,
            },
          ),
        ],
      })

      expect(carryForwardStaleLanes(fresh, previous, stale, to)).toEqual(fresh)
    })
  })
})

function snapshot(rows: {
  transfers?: AggregationResult['aggregatedTransfers']
  tokens?: AggregationResult['aggregatedTokens']
}): AggregationResult {
  return {
    aggregatedTransfers: rows.transfers ?? [],
    aggregatedTokens: rows.tokens ?? [],
    aggregatedDeployedTokens: [],
    aggregatedTokensPairs: [],
  }
}
