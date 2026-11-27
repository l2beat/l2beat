import { expect } from 'earl'
import type { PriceOfSpeed } from '~/server/features/gas-fees/tipping/toPriceOfSpeed'
import { sortCostRows } from './costs/sortCostRows'
import { placeChips } from './tipping/placeChips'
import { getSpeedGain } from './tipping/speedGain'

describe(placeChips.name, () => {
  it('puts a chip that would overlap one above it below the line', () => {
    const placed = placeChips(
      [
        { key: 'ours', x: 100, width: 60 },
        { key: 'a', x: 120, width: 60 },
        { key: 'b', x: 300, width: 60 },
      ],
      400,
    )
    expect(placed.map((p) => p.lane)).toEqual(['above', 'below', 'above'])
  })

  it('keeps chips inside the track', () => {
    expect(placeChips([{ key: 'a', x: 395, width: 60 }], 400)[0]?.left).toEqual(
      340,
    )
  })
})

describe(getSpeedGain.name, () => {
  const speed = (
    fastSeconds: number | undefined,
    twoGweiSeconds: number,
    fastUsd = 0.03,
  ) =>
    ({
      roundTips: [{ gwei: 2, usd: 0.21, seconds: twoGweiSeconds }],
      fastTip: { usd: fastUsd, seconds: fastSeconds },
    }) as PriceOfSpeed

  it('says how much sooner 2 gwei gets you in', () => {
    expect(getSpeedGain(speed(25, 17))).toEqual(
      expect.subset({ gain: '8s sooner', waits: '25s to 17s' }),
    )
  })

  it('says "no sooner" when 2 gwei does not help', () => {
    expect(getSpeedGain(speed(17.2, 16.8))?.waits).toEqual('17s either way')
    expect(getSpeedGain(speed(17, 19))).toEqual(
      expect.subset({ gain: 'no sooner', waits: '17s and 19s' }),
    )
  })

  it('needs both waits and a positive extra cost', () => {
    expect(getSpeedGain(speed(undefined, 17))).toEqual(undefined)
    expect(getSpeedGain(speed(25, 17, 0.5))).toEqual(undefined)
  })
})

describe(sortCostRows.name, () => {
  const row = (name: string, cost: number | null, isEthereum = false) => ({
    name,
    isEthereum,
    sortValues: { cost, cheaper: null, totalFees: 0 },
  })
  const rows = [
    row('a', 2),
    row('none', null),
    row('eth', 9, true),
    row('b', 1),
  ]

  it('keeps Ethereum first and a row without a value last, both ways', () => {
    const names = (desc: boolean) =>
      sortCostRows(rows, 'cost', desc).map((r) => r.name)
    expect(names(false)).toEqual(['eth', 'b', 'a', 'none'])
    expect(names(true)).toEqual(['eth', 'a', 'b', 'none'])
  })
})
