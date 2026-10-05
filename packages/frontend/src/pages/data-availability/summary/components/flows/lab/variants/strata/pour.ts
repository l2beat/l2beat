import type { LabData, LabPoster } from '../../model'
import { mulberry32 } from '../../schedule'

/** How long an hour of the day takes to pour */
export const HOUR_SECONDS = 1.5

/** Steps of lightness a grain can have, for the look of sand */
export const GRAIN_SHADES = 8

/**
 * Every grain of the pour, in the order it falls. A grain stands for
 * `blobsPerGrain` blobs of one poster, posted in one hour.
 */
export interface PourPlan {
  blobsPerGrain: number
  grainCount: number
  hours: number
  /** Index into `LabData.posters` */
  poster: Uint16Array
  hour: Uint8Array
  /** 0 to `GRAIN_SHADES` - 1 */
  shade: Uint8Array
  /** Seconds into the pour */
  time: Float32Array
  /** Grains poured before each hour starts, and after the last one ends */
  pouredBefore: Int32Array
}

/**
 * Cuts the day into grains. Every poster gets as many grains as its blobs
 * make, and hands them out to the hours it posted them in, so neither its
 * total nor its rhythm is rounded away.
 *
 * Within an hour the posters pour one after another, by rank: only hourly
 * totals are known, so any order inside an hour is made up, and this one
 * lays each poster's share of the hour down as a band of its color. Every
 * other hour runs the other way, so the largest poster's bands of two hours
 * meet into one: late in the day an hour is a thin layer, and a band only
 * shows when it is thick enough.
 */
export function planPour(data: LabData, blobsPerGrain: number): PourPlan {
  const random = mulberry32(2026)
  const hours = data.posters[0]?.blobsHourly.length ?? 24
  const grainCount = Math.round(data.totalBlobs / blobsPerGrain)
  const perPoster = grainsPerPoster(data.posters, grainCount, blobsPerGrain)

  const byHour: number[][] = Array.from({ length: hours }, () => [])
  data.posters.forEach((poster, posterIndex) => {
    const perHour = apportion(
      perPoster[posterIndex] ?? 0,
      hourlyWeights(poster, hours),
    )
    perHour.forEach((count, hour) => {
      for (let i = 0; i < count; i++) byHour[hour]?.push(posterIndex)
    })
  })

  const plan: PourPlan = {
    blobsPerGrain,
    grainCount,
    hours,
    poster: new Uint16Array(grainCount),
    hour: new Uint8Array(grainCount),
    shade: new Uint8Array(grainCount),
    time: new Float32Array(grainCount),
    pouredBefore: new Int32Array(hours + 1),
  }
  let grain = 0
  byHour.forEach((posters, hour) => {
    plan.pouredBefore[hour] = grain
    if (hour % 2 === 1) posters.reverse()
    posters.forEach((posterIndex, i) => {
      const spread = (i + 0.5 + (random() - 0.5) * 0.8) / posters.length
      plan.poster[grain] = posterIndex
      plan.hour[grain] = hour
      plan.shade[grain] = Math.floor(random() * GRAIN_SHADES)
      plan.time[grain] = (hour + spread) * HOUR_SECONDS
      grain++
    })
  })
  plan.pouredBefore[hours] = grain
  return plan
}

export interface HourSummary {
  hour: number
  blobs: number
  /** The largest posters of the hour, largest first */
  top: LabPoster[]
}

/** What each hour of the day held, from the real hourly totals */
export function summarizeHours(data: LabData, hours: number): HourSummary[] {
  return Array.from({ length: hours }, (_, hour) => {
    const posted = data.posters
      .map((poster) => ({ poster, blobs: poster.blobsHourly[hour] ?? 0 }))
      .filter((p) => p.blobs > 0)
      .sort((a, b) => b.blobs - a.blobs)
    return {
      hour,
      blobs: posted.reduce((sum, p) => sum + p.blobs, 0),
      top: posted.slice(0, 3).map((p) => p.poster),
    }
  })
}

/**
 * Grains of each poster, adding up to `total`. A poster that posted anything
 * keeps at least one grain, so the sand still shows it; the grain comes from
 * the largest poster, where one grain is lost in thousands.
 */
function grainsPerPoster(
  posters: LabPoster[],
  total: number,
  blobsPerGrain: number,
): number[] {
  const counts = apportion(
    total,
    posters.map((p) => p.blobs / blobsPerGrain),
  )
  posters.forEach((poster, i) => {
    if (poster.blobs <= 0 || (counts[i] ?? 0) > 0) return
    const largest = counts.indexOf(Math.max(...counts))
    if (largest === i || (counts[largest] ?? 0) <= 1) return
    counts[largest] = (counts[largest] ?? 0) - 1
    counts[i] = 1
  })
  return counts
}

function hourlyWeights(poster: LabPoster, hours: number): number[] {
  const weights = Array.from(
    { length: hours },
    (_, hour) => poster.blobsHourly[hour] ?? 0,
  )
  return weights.some((w) => w > 0) ? weights : weights.map(() => 1)
}

/**
 * Splits `total` whole units in proportion to `weights`: everyone gets the
 * whole part of their share, and the units left go to the largest remainders
 */
export function apportion(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (total <= 0 || sum <= 0) return weights.map(() => 0)
  const exact = weights.map((w) => (w / sum) * total)
  const counts = exact.map(Math.floor)
  let left = total - counts.reduce((a, b) => a + b, 0)
  const byRemainder = exact
    .map((value, i) => ({ i, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder)
  for (const { i } of byRemainder) {
    if (left <= 0) break
    counts[i] = (counts[i] ?? 0) + 1
    left--
  }
  return counts
}
