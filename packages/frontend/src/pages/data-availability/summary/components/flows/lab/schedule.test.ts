import { expect } from 'earl'
import { DAY_SECONDS, type LabPoster, SLOT_SECONDS } from './model'
import { forEachBatchBetween, type LabBatch, scheduleBatches } from './schedule'

// The schedule is made up, so what is tested is what it must keep true to the
// data: each hour adds up, no block overflows, and a seed gives the same day.
describe(scheduleBatches.name, () => {
  it('posts what every hour really posted', () => {
    const hourly = Array.from({ length: 24 }, (_, hour) => (hour % 3) * 7)
    const batches = scheduleBatches([poster({ blobsHourly: hourly })], 21)

    expect(sumByHour(batches)).toEqual(hourly)
  })

  it('carries a fraction of a blob over to the next hour', () => {
    const hourly = Array<number>(24).fill(0.5)
    const batches = scheduleBatches([poster({ blobsHourly: hourly })], 21)

    expect(batches.reduce((sum, b) => sum + b.blobs, 0)).toEqual(12)
  })

  it('sends batches of about the average size', () => {
    const hourly = Array<number>(24).fill(50)
    const batches = scheduleBatches(
      [poster({ blobsHourly: hourly, blobsPerBatch: 5 })],
      21,
    )

    expect(batches.every((b) => b.blobs === 5)).toEqual(true)
  })

  it('never puts more than a block holds into one', () => {
    // three busy posters in the same hour crowd the same blocks
    const busy = Array<number>(24).fill(0)
    busy[0] = 3000
    const batches = scheduleBatches(
      [0, 1, 2].map(() => poster({ blobsHourly: busy, blobsPerBatch: 6 })),
      21,
    )

    const perBlock = new Map<number, number>()
    for (const b of batches) {
      perBlock.set(b.slot, (perBlock.get(b.slot) ?? 0) + b.blobs)
      expect(Math.floor(b.time / SLOT_SECONDS)).toEqual(b.slot)
    }
    expect(Math.max(...perBlock.values())).toBeLessThanOrEqual(21)
  })

  it('spreads projects that post once an hour over the whole hour', () => {
    // with batches cut at the hour's edges, about a sixth of them landed on
    // its first block, so the tail of small projects posted all at once
    const hourly = Array<number>(24).fill(1)
    const batches = scheduleBatches(
      Array.from({ length: 30 }, () => poster({ blobsHourly: hourly })),
      21,
    )

    const perBlock = new Map<number, number>()
    for (const b of batches) {
      perBlock.set(b.slot, (perBlock.get(b.slot) ?? 0) + b.blobs)
    }
    expect(Math.max(...perBlock.values())).toBeLessThanOrEqual(3)
  })

  it('makes up the same day for the same seed', () => {
    const posters = [poster({ blobsHourly: Array<number>(24).fill(9) })]

    expect(scheduleBatches(posters, 21, 7)).toEqual(
      scheduleBatches(posters, 21, 7),
    )
  })
})

describe(forEachBatchBetween.name, () => {
  const batches: LabBatch[] = [
    { time: 10, slot: 0, posterIndex: 0, blobs: 1 },
    { time: DAY_SECONDS - 10, slot: 7199, posterIndex: 0, blobs: 1 },
  ]

  it('plays the day again past its end, on the same running clock', () => {
    const times: number[] = []
    forEachBatchBetween(batches, DAY_SECONDS - 20, DAY_SECONDS + 20, (_, t) =>
      times.push(t),
    )

    expect(times).toEqual([DAY_SECONDS - 10, DAY_SECONDS + 10])
  })

  it('leaves out the end of the window', () => {
    const times: number[] = []
    forEachBatchBetween(batches, 0, 10, (_, t) => times.push(t))

    expect(times).toEqual([])
  })
})

function sumByHour(batches: LabBatch[]) {
  const hours = Array<number>(24).fill(0)
  for (const b of batches) {
    const hour = Math.floor(b.time / 3600)
    hours[hour] = (hours[hour] ?? 0) + b.blobs
  }
  return hours
}

function poster({
  blobsHourly,
  blobsPerBatch = 1,
}: {
  blobsHourly: number[]
  blobsPerBatch?: number
}): LabPoster {
  const blobs = blobsHourly.reduce((sum, value) => sum + value, 0)
  return {
    id: 'poster',
    name: 'Poster',
    iconUrl: undefined,
    href: undefined,
    color: '#000000',
    posted: blobs * 128 * 1024,
    share: 1,
    blobs,
    blobsHourly,
    cadence: { interval: 60, blobsPerBatch },
    cadenceMeasured: true,
    rank: 0,
  }
}
