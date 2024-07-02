export function calculateTicks(
  ticks: number,
  values: number[],
  isLogScale: boolean,
) {
  return isLogScale
    ? calculateLogTicks(ticks, values)
    : calculateLinTicks(ticks, values)
}

function calculateLinTicks(ticks: number, values: number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) {
    if (min === 0) {
      return [0, 0, 0, 0, 0]
    }
    return [0, min / 2, min, min * 1.5, min * 2]
  }

  const baseRange = max - min
  const newMin = Math.max(0, min - baseRange * 0.05)
  const newMax = max + baseRange * 0.05
  const range = newMax - newMin

  const precision = Math.floor(Math.log10(range)) - 2
  const equalizer = 10 ** precision
  const tick0 = Math.floor(newMin / equalizer) * equalizer

  const tick = Math.ceil(range / (ticks - 1) / equalizer) * equalizer

  return new Array(ticks).fill(0).map((_, i) => round(tick0 + tick * i, 6))
}

function calculateLogTicks(ticks: number, values: number[]) {
  const nonZero = values.filter((x) => x > 0)
  if (nonZero.length === 0) {
    return [1, 10, 100, 1000, 10000]
  }
  const min = Math.min(...nonZero)
  const max = Math.max(...nonZero)
  if (min === max) {
    return [min / 100, min / 10, min, min * 10, min * 100]
  }

  const baseRange = max / min
  const baseTick = baseRange ** (1 / (ticks - 1))
  const newMin = min / (1 + (baseTick - 1) / 4)
  const newMax = max * (1 + (baseTick - 1) / 4)
  const range = newMax / newMin
  const tick = range ** (1 / (ticks - 1))
  return new Array(ticks).fill(0).map((_, i) => round(newMin * tick ** i, 6))
}

function round(value: number, precision = 6) {
  return parseFloat(value.toPrecision(precision))
}
