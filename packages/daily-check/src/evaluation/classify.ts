import type { Palette } from '../dashboard/types'
import type { Status } from './types'

/** Reproduces the tile's "color by value" configuration. */
export function classify(value: number, palette?: Palette): Status {
  const params = palette?.params
  const stops =
    params?.colorStops ??
    params?.stops?.map((stop, index) => ({
      color: stop.color,
      stop: index === 0 ? null : (params.stops?.[index - 1]?.stop ?? null),
    }))
  const first = stops?.[0]
  if (!stops || !first) {
    return 'none'
  }

  const continuity = params?.continuity ?? 'above'
  const firstStart = first.stop ?? params?.rangeMin ?? null

  if (firstStart !== null && value < firstStart) {
    return continuity === 'all' || continuity === 'below'
      ? colorToStatus(first.color)
      : 'none'
  }

  let color = first.color
  for (const stop of stops) {
    if (stop.stop !== null && value >= stop.stop) {
      color = stop.color
    }
  }

  const rangeMax = params?.rangeMax ?? null
  if (
    rangeMax !== null &&
    value >= rangeMax &&
    continuity !== 'all' &&
    continuity !== 'above'
  ) {
    return 'none'
  }
  return colorToStatus(color)
}

function colorToStatus(color: string): Status {
  const hex = color.toLowerCase()
  if (hex === '#24c292') {
    return 'green'
  }
  if (hex === '#f6726a') {
    return 'red'
  }
  const hue = hexToHue(hex)
  if (hue === undefined) {
    return 'none'
  }
  if (hue >= 70 && hue <= 170) {
    return 'green'
  }
  if (hue >= 20 && hue < 70) {
    return 'amber'
  }
  return 'red'
}

function hexToHue(hex: string): number | undefined {
  const digits = /^#?([0-9a-f]{6})$/.exec(hex)?.[1]
  if (!digits) {
    return undefined
  }
  const r = Number.parseInt(digits.slice(0, 2), 16) / 255
  const g = Number.parseInt(digits.slice(2, 4), 16) / 255
  const b = Number.parseInt(digits.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max === min) {
    return 0
  }
  const delta = max - min
  let hue: number
  if (max === r) {
    hue = ((g - b) / delta) % 6
  } else if (max === g) {
    hue = (b - r) / delta + 2
  } else {
    hue = (r - g) / delta + 4
  }
  return (((hue * 60) % 360) + 360) % 360
}
