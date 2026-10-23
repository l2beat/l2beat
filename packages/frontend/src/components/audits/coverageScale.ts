// The y axis of the coverage history chart follows the values on screen,
// so that a series moving in a narrow band is readable. Padding keeps the
// line off the plot's edges.

const PADDING = 0.15
const SPAN_MIN = 10
const TICKS_MAX = 5

export interface ValueDomain {
  min: number
  max: number
}

/**
 * The lowest and highest visible value, padded on both sides and never
 * narrower than a few units, never below zero.
 */
export function getValueDomain(values: number[]): ValueDomain {
  if (values.length === 0) return { min: 0, max: SPAN_MIN }
  let low = Math.min(...values)
  let high = Math.max(...values)
  if (high - low < SPAN_MIN) {
    const center = (low + high) / 2
    low = center - SPAN_MIN / 2
    high = center + SPAN_MIN / 2
  }
  const padding = (high - low) * PADDING
  return { min: Math.max(0, low - padding), max: high + padding }
}

/** Round values inside the domain, at most a handful of them. */
export function getValueTicks(domain: ValueDomain): number[] {
  const span = domain.max - domain.min
  const step = niceStep(span / TICKS_MAX)
  const ticks: number[] = []
  for (
    let tick = Math.ceil(domain.min / step) * step;
    tick <= domain.max;
    tick += step
  ) {
    ticks.push(tick)
  }
  return ticks
}

/** The smallest of 1, 2, 5 times a power of ten that is above `raw`. */
function niceStep(raw: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(raw, 1e-9)))
  for (const factor of [1, 2, 5, 10]) {
    if (factor * magnitude > raw) return factor * magnitude
  }
  return 10 * magnitude
}
