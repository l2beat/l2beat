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
