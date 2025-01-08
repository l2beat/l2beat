export type SizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'

interface SizeOptions {
  fromUnit?: SizeUnit
  exact?: boolean
}

export function formatThroughput(
  size: number,
  frequencySeconds: number,
  options: SizeOptions = {},
): string {
  const { fromUnit = 'B', exact = false } = options
  const units: SizeUnit[] = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = units.indexOf(fromUnit)

  if (unitIndex === -1) {
    throw new Error(`Invalid unit: ${fromUnit}`)
  }

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000
    unitIndex++
  }

  const throughput = size / frequencySeconds
  const formattedSize = exact ? throughput : Math.round(throughput * 100) / 100
  return `${formattedSize} ${units[unitIndex]}/s`
}
