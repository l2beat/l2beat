export function getDaDataParams(data: (number | null)[][] | undefined) {
  if (!data)
    return {
      denominator: 1,
      unit: 'B',
    }
  const max = Math.max(
    ...data.map(([_, ...rest]) => Math.max(...rest.filter((x) => x !== null))),
  )
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
