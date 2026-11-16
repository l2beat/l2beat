export function getDaDataParams(max: number | undefined) {
  if (!max)
    return {
      denominator: 1,
      unit: 'B',
    }

  if (max < 1024)
    return {
      denominator: 1,
      unit: 'B',
    }
  if (max < 1024 ** 2)
    return {
      denominator: 1024,
      unit: 'KiB',
    }
  if (max < 1024 ** 3)
    return {
      denominator: 1024 ** 2,
      unit: 'MiB',
    }
  return {
    denominator: 1024 ** 3,
    unit: 'GiB',
  }
}

/**
 * Two decimals, or two significant digits below 1. Hidden series still set
 * the unit, so a small visible series can get GiB ticks that would all
 * read "0.00" at a fixed two decimals.
 */
export function formatDaAxisTick(value: number) {
  return value === 0 || Math.abs(value) >= 1
    ? value.toFixed(2)
    : value.toPrecision(2)
}
