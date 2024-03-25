import { Configuration, ConfigurationRange } from './types'

export function toRanges<T>(
  configurations: Configuration<T>[],
): ConfigurationRange<T>[] {
  const minHeights = configurations.map((c) => c.minHeight)
  const maxHeights = configurations
    .map((c) => c.maxHeight)
    .filter((height): height is number => height !== null)

  const starts = minHeights
    .concat(maxHeights.map((height) => height + 1))
    .sort((a, b) => a - b)
    .filter((height, i, arr) => arr.indexOf(height) === i)

  let lastRange: ConfigurationRange<T> = {
    from: -Infinity,
    to: Infinity,
    configurations: [],
  }
  const ranges: ConfigurationRange<T>[] = [lastRange]
  for (const start of starts) {
    lastRange.to = start - 1
    lastRange = {
      from: start,
      to: Infinity,
      configurations: [],
    }
    ranges.push(lastRange)
  }

  for (const configuration of configurations) {
    const min = configuration.minHeight
    const max = configuration.maxHeight ?? Infinity

    for (const range of ranges) {
      if (!(max < range.from || min > range.to)) {
        range.configurations.push(configuration)
      }
    }
  }

  return ranges
}
