import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import {
  chartRangeCodec,
  oneOfCodec,
  type QueryParamCodec,
  sortingCodec,
} from './queryParamCodecs'
import { optionToRange } from './range/range'

// Every case round-trips through the URL form (serialize, then parse), since
// that is what a reload or a shared link does to the state.
function roundTrip<T>(codec: QueryParamCodec<T>, value: T) {
  return codec.parse(codec.serialize(value))
}

describe(oneOfCodec.name, () => {
  const codec = oneOfCodec(['usd', 'eth', 'gas'], 'usd')

  it('round-trips every option', () => {
    for (const unit of ['usd', 'eth', 'gas'] as const) {
      expect(roundTrip(codec, unit)).toEqual(unit)
    }
  })

  it('rejects values outside the options', () => {
    expect(codec.parse('btc')).toEqual(undefined)
    expect(codec.parse('')).toEqual(undefined)
    expect(codec.parse('USD')).toEqual(undefined)
  })
})

describe(chartRangeCodec.name, () => {
  let time: InstalledClock
  const codec = chartRangeCodec('30d')

  beforeEach(() => {
    time = install()
    time.setSystemTime(new Date('2026-04-15T12:34:00.000Z'))
  })

  afterEach(() => {
    time.uninstall()
  })

  it('stores a predefined range by name, so a link stays relative to today', () => {
    expect(codec.serialize(optionToRange('7d'))).toEqual('7d')
    expect(codec.serialize(optionToRange('1y'))).toEqual('1y')
    expect(codec.serialize(optionToRange('max'))).toEqual('max')
    expect(codec.parse('90d')).toEqual(optionToRange('90d'))
  })

  it('serializes the default to its name, so the URL leaves it out', () => {
    expect(codec.serialize(codec.getDefault())).toEqual('30d')
  })

  it('names a predefined range picked within 75 min after midnight UTC', () => {
    // Its end is still yesterday, which `rangeToOption` alone calls custom
    time.setSystemTime(new Date('2026-04-15T00:30:00.000Z'))

    expect(codec.serialize(optionToRange('7d'))).toEqual('7d')
  })

  it('round-trips a calendar range as unix seconds', () => {
    const from = UnixTime.fromDate(new Date('2025-01-01T00:00:00.000Z'))
    const to = UnixTime.fromDate(new Date('2025-06-30T23:59:59.000Z'))

    expect(codec.serialize([from, to])).toEqual(`${from}-${to}`)
    expect(roundTrip(codec, [from, to])).toEqual([from, to])
  })

  it('rejects garbage and inverted ranges', () => {
    for (const param of ['', '2y', '30D', 'abc-def', '5-', '-5', '1.5-3']) {
      expect(codec.parse(param)).toEqual(undefined)
    }
    expect(codec.parse('200-100')).toEqual(undefined)
    expect(codec.parse('100-100')).toEqual(undefined)
  })
})

describe(sortingCodec.name, () => {
  const codec = sortingCodec({ id: 'total', desc: true })

  it('round-trips both directions', () => {
    expect(codec.serialize([{ id: 'total', desc: true }])).toEqual('total.desc')
    expect(roundTrip(codec, [{ id: 'name', desc: false }])).toEqual([
      { id: 'name', desc: false },
    ])
  })

  it('keeps column ids that contain dashes, dots and #', () => {
    for (const id of ['total-cost', 'data.posted', '#']) {
      expect(roundTrip(codec, [{ id, desc: true }])).toEqual([
        { id, desc: true },
      ])
    }
  })

  it('round-trips a multi-column sort in order', () => {
    const sorting = [
      { id: 'stage', desc: false },
      { id: 'total', desc: true },
    ]

    expect(codec.serialize(sorting)).toEqual('stage.asc,total.desc')
    expect(roundTrip(codec, sorting)).toEqual(sorting)
  })

  it('rejects a sort without a valid direction', () => {
    for (const param of ['', 'total', 'total.up', '.desc', 'total.desc,']) {
      expect(codec.parse(param)).toEqual(undefined)
    }
  })
})
