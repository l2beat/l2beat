import { pluralize } from '@l2beat/shared-pure'
import { SLOT_SECONDS } from '~/utils/beaconSlots'

/** Every blob takes its full size, used or not */
export const BLOB_KIB = 128

// formatInteger shortens to "15.35 M"; slot and block numbers are read whole
const WHOLE = new Intl.NumberFormat('en-US')

/** 15,354,012, rounded, as a number counting toward its value passes through fractions */
export function formatWhole(value: number): string {
  return WHOLE.format(Math.round(value))
}

/** One decimal below 10, as 3.8 blobs per block, but 3 rather than 3.0; whole above */
export function formatAverage(value: number): string {
  if (value >= 10) return String(Math.round(value))
  const rounded = value.toFixed(1)
  return rounded.endsWith('.0') ? rounded.slice(0, -2) : rounded
}

export function formatBlobCount(blobs: number): string {
  return `${blobs} ${pluralize(blobs, 'blob')}`
}

/** 0.0028, 0.34, 2.0, 15.5, 152: two significant digits for small rates, whole for large */
export function formatRate(value: number): string {
  if (value === 0) return '0'
  if (value >= 100) return String(Math.round(value))
  if (value >= 10) return value.toFixed(1)
  return value.toPrecision(2)
}

/** "Last hour", or how far back it reaches while the server catches up */
export function describeWindow(slots: number) {
  const minutes = Math.floor((slots * SLOT_SECONDS) / 60)
  return minutes >= 60 ? 'Last hour' : `Last ${Math.max(1, minutes)} min`
}

const SIZE_UNITS = ['KiB', 'MiB', 'GiB', 'TiB'] as const

/** 896 KiB, 151 MiB, 1.42 GiB: three significant digits */
export function formatKib(kib: number): string {
  let value = kib
  let unit = 0
  while (value >= 1024 && unit < SIZE_UNITS.length - 1) {
    value /= 1024
    unit++
  }
  const decimals = value >= 100 || unit === 0 ? 0 : value >= 10 ? 1 : 2
  return `${value.toFixed(decimals)} ${SIZE_UNITS[unit]}`
}

// In the reader's own zone and way of writing the time
const CLOCK = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

/** 14:32:11, at `unixSeconds`: slots are 12 seconds, so minutes alone repeat */
export function formatClock(unixSeconds: number): string {
  return CLOCK.format(unixSeconds * 1000)
}
