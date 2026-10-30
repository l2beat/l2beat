import type { InferableScaleLike } from '@tanstack/charts'
import { scaleLinear } from '@tanstack/charts/scales/linear'

/**
 * - `zero`: from 0 (or the minimum, if negative) to the maximum, grown to
 *   nice ticks;
 * - `auto`: from the minimum to the maximum, grown to nice ticks;
 * - `autoIfSingle`: `auto` with one series drawn on the axis, else `zero`;
 * - `[min, max]`: fixed bounds, where `'auto'` takes the data's.
 */
export type YDomain =
  | 'zero'
  | 'auto'
  | 'autoIfSingle'
  | readonly [number | 'auto', number | 'auto']

export interface YAxisTicksOptions {
  domain?: YDomain
  /** Room above a fixed domain's top, as a share of its height. */
  headroom?: number
  /** Compact linear by default; pass e.g. d3's `scaleSymlog`. */
  scale?: () => InferableScaleLike<number>
  /** Fixed ticks instead of computed ones. */
  ticks?: number[]
  tickCount?: number
  /** Whole-number ticks only. */
  integer?: boolean
  fontSize?: number
}

export interface YAxisTicks {
  domain: [number, number]
  ticks: number[]
}

const TICK_COUNT = 3

/**
 * The axis' domain and ticks for values spanning `extent`. A fixed domain
 * keeps its bounds; the others grow to nice ticks. No values, no ticks.
 */
export function getYAxisTicks(
  extent: readonly [number, number] | undefined,
  axis: YAxisTicksOptions,
  seriesCount: number,
): YAxisTicks {
  if (!extent) return { domain: [0, 1], ticks: [] }
  const [min, max] = extent
  const count = axis.tickCount ?? TICK_COUNT
  const domain =
    axis.domain === 'autoIfSingle'
      ? seriesCount === 1
        ? 'auto'
        : 'zero'
      : (axis.domain ?? 'zero')
  let lo: number
  let hi: number
  if (typeof domain === 'string') {
    ;[lo, hi] = domain === 'auto' ? [min, max] : [Math.min(0, min), max]
  } else {
    lo = domain[0] === 'auto' ? min : domain[0]
    hi = domain[1] === 'auto' ? max : domain[1]
    hi += (hi - lo) * (axis.headroom ?? 0)
  }
  if (axis.scale) {
    const scale = axis.scale().domain([lo, hi])
    return {
      domain: scale.domain() as [number, number],
      ticks: axis.ticks ?? [...(scale.ticks?.(count) ?? [lo, hi])],
    }
  }
  if (typeof domain !== 'string') {
    return {
      domain: [lo, hi],
      ticks: axis.ticks ?? getFixedDomainTicks(lo, hi, count, axis.integer),
    }
  }
  const ticks = axis.ticks ?? getNiceTicks(lo, hi, count, axis.integer)
  return { domain: [ticks[0] ?? lo, ticks.at(-1) ?? hi], ticks }
}

/**
 * From the top tick down, keeps each label that clears the last one kept.
 * Ticks outside the domain are left out.
 */
export function fitTicks(
  y: YAxisTicks,
  plotHeight: number,
  axis: Pick<YAxisTicksOptions, 'scale' | 'fontSize'>,
) {
  const [lo, hi] = y.domain
  const scale = (axis.scale ?? scaleLinear)()
    .domain(y.domain)
    .range([plotHeight, 0])
  const minGap = (axis.fontSize ?? 15) * 2
  const inside = y.ticks.filter((t) => t >= lo && t <= hi)
  const kept: number[] = []
  for (const tick of [...inside].reverse()) {
    const last = kept.at(-1)
    const position = scale(tick) ?? 0
    if (
      last === undefined ||
      Math.abs(position - (scale(last) ?? 0)) >= minGap
    ) {
      kept.push(tick)
    }
  }
  return kept.reverse()
}

/**
 * Ticks for a fixed domain: nice steps from `min`, then `max` itself as the
 * last tick.
 */
function getFixedDomainTicks(
  min: number,
  max: number,
  count: number,
  integer?: boolean,
) {
  if (max <= min) return [min]
  const step = getNiceStep((max - min) / (count - 1), integer)
  const ticks: number[] = []
  for (let tick = min; tick < max - step * 1e-9; tick += step) {
    ticks.push(round(tick))
  }
  ticks.push(max)
  return ticks
}

/**
 * `count` nice ticks: the step is the rough step rounded up to a multiple of
 * 0.05 (0.1 for steps of 1-10) of its decade, and the domain grows to fit
 * exactly `count` ticks.
 */
function getNiceTicks(
  min: number,
  max: number,
  count: number,
  integer?: boolean,
): number[] {
  if (max <= min) return [min, min + 1]
  let step = getNiceStep((max - min) / (count - 1), integer)
  for (let i = 0; i < 10; i++) {
    const start = Math.floor(min / step) * step
    if (start + step * (count - 1) >= max - step * 1e-9) {
      return Array.from({ length: count }, (_, j) => round(start + j * step))
    }
    step = getNiceStep(step * 1.05, integer)
  }
  return [min, max]
}

function getNiceStep(roughStep: number, integer?: boolean) {
  const digitCount = Math.floor(Math.log10(roughStep)) + 1
  const decade = 10 ** digitCount
  const scale = digitCount !== 1 ? 0.05 : 0.1
  const step = Math.ceil(roughStep / decade / scale - 1e-9) * scale * decade
  return integer ? Math.max(1, Math.ceil(step)) : step
}

function round(value: number) {
  return Number.parseFloat(value.toPrecision(12))
}
