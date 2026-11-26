import { expect } from 'earl'
import { findPeakRises, RISE_HISTORY_DAYS } from './findPeakRises'

describe(findPeakRises.name, () => {
  // A weekday level with weekends 40% lower, like daily L2 activity. Days
  // before HISTORY are baseline history, the rest is the visible range.
  const HISTORY = RISE_HISTORY_DAYS + 10
  const DAYS = HISTORY + 200
  const week = (level: number) => (day: number) =>
    day % 7 >= 5 ? level * 0.6 : level

  function totals(valueAt: (day: number) => number) {
    return Array.from({ length: DAYS }, (_, day) => valueAt(day))
  }

  function peaks(series: number[]) {
    return findPeakRises(series, HISTORY).map((rise) => ({
      peak: rise.peak,
      onsets: rise.levels.map((l) => l.onset),
      baselines: rise.levels.map((l) => Math.round(l.baseline)),
    }))
  }

  it('compares a one-day spike with the usual highs before it', () => {
    const spike = HISTORY + 100
    const result = peaks(totals((d) => (d === spike ? 4_000 : week(2_000)(d))))

    expect(result).toEqual([
      { peak: spike, onsets: [spike], baselines: [2_000] },
    ])
  })

  it('keeps a held step compared with the level before it', () => {
    // A launch that holds for months must not become its own baseline.
    const step = HISTORY + 20
    const result = peaks(totals((d) => week(d >= step ? 3_800 : 2_400)(d)))

    expect(result).toEqual([{ peak: step, onsets: [step], baselines: [2_400] }])
  })

  it('skips a peak that a higher day nearby outranks', () => {
    // As 21 Aug next to the higher 24 Sep on the rollups 1Y chart.
    const lower = HISTORY + 100
    const higher = HISTORY + 120
    const result = peaks(
      totals((d) =>
        d === lower ? 3_000 : d === higher ? 3_200 : week(2_000)(d),
      ),
    )

    expect(result.map((r) => r.peak)).toEqual([higher])
  })

  it('reaches back to a step under a later spike on its plateau', () => {
    const step = HISTORY + 60
    const spike = step + 28
    const result = peaks(
      totals((d) => (d === spike ? 4_700 : week(d >= step ? 3_800 : 2_400)(d))),
    )

    const rise = result.find((r) => r.peak === spike)
    // Tightest first: the spike against the plateau, then the whole step.
    expect(rise?.onsets).toEqual([spike, step])
    expect(rise?.baselines.at(-1)).toEqual(2_400)
  })

  it('leaves out a rise that began before the visible range', () => {
    const result = peaks(
      totals((d) => week(d >= HISTORY - 20 ? 3_800 : 2_400)(d)),
    )

    expect(result).toEqual([])
  })
})
