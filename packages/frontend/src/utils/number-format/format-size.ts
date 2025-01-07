export type SizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'

interface SizeOptions {
  fromUnit?: SizeUnit
  exact?: boolean
}

export function formatSize(size: number, options: SizeOptions = {}): string {
  const { fromUnit = 'B', exact = false } = options
  const units: SizeUnit[] = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = units.indexOf(fromUnit)

  if (unitIndex === -1) {
    throw new Error(`Invalid unit: ${fromUnit}`)
  }

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  const formattedSize = exact ? size : Math.round(size * 100) / 100
  return `${formattedSize} ${units[unitIndex]}`
}
