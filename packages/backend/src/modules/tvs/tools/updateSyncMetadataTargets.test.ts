import type { AmountFormula, TvsToken } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { TokenId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { updateSyncMetadataTargets } from './updateSyncMetadataTargets'

describe(updateSyncMetadataTargets.name, () => {
  const tick = UnixTime.fromDate(new Date('2026-10-26T10:00:00Z'))
  const since = UnixTime.fromDate(new Date('2025-01-01T00:00:00Z'))

  it('sets live tokens to the tick and retired tokens to their last hour', async () => {
    const syncMetadata = mockObject<Database['syncMetadata']>({
      upsertMany: mockFn().resolvesTo(0),
      markEnded: mockFn().resolvesTo(0),
    })

    await updateSyncMetadataTargets(
      mockDatabase({ syncMetadata }),
      [
        {
          projectId: 'arbitrum',
          tokens: [
            token('arbitrum-ETH', [formula(since)]),
            // One of its formulas still runs
            token('arbitrum-USDC', [
              formula(since, at('2026-08-01T00:00:00Z')),
              formula(since),
            ]),
            token('arbitrum-NEW', [formula(tick + UnixTime.HOUR)]),
          ],
        },
        {
          projectId: 'wirex',
          tokens: [
            // Ends this hour, so it still gets the tick
            token('wirex-ETH', [formula(since, tick)]),
            token('wirex-DAI', [formula(since, at('2026-10-15T11:00:00Z'))]),
          ],
        },
        {
          projectId: 'zeronetwork',
          // Ends mid-hour
          tokens: [
            token('zeronetwork-ETH', [
              formula(since, at('2026-08-12T08:39:59Z')),
            ]),
          ],
        },
      ],
      tick,
    )

    expect(syncMetadata.upsertMany).toHaveBeenOnlyCalledWith([
      { feature: 'tvs', id: 'arbitrum-ETH', target: tick },
      { feature: 'tvs', id: 'arbitrum-USDC', target: tick },
      { feature: 'tvs', id: 'wirex-ETH', target: tick },
    ])
    expect(syncMetadata.markEnded).toHaveBeenOnlyCalledWith('tvs', [
      { id: 'wirex-DAI', end: at('2026-10-15T11:00:00Z') },
      { id: 'zeronetwork-ETH', end: at('2026-08-12T08:00:00Z') },
    ])
  })
})

function at(date: string) {
  return UnixTime.fromDate(new Date(date))
}

function token(id: string, amounts: AmountFormula[]): TvsToken {
  return mockObject<TvsToken>({
    id: TokenId(id),
    amount: {
      type: 'calculation',
      operator: 'sum',
      arguments: amounts,
    },
    valueForProject: undefined,
    valueForSummary: undefined,
  })
}

function formula(
  sinceTimestamp: UnixTime,
  untilTimestamp?: UnixTime,
): AmountFormula {
  return mockObject<AmountFormula>({
    type: 'balanceOfEscrow',
    sinceTimestamp,
    untilTimestamp,
  })
}
