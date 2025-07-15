import type {
  Configuration,
  ConfigurationRange,
  SavedConfiguration,
} from './types'

export function toRanges<T>(
  configurations: SavedConfiguration<T>[],
): ConfigurationRange<T>[] {
  const minHeights = configurations.map(getConfigurationMin)
  const maxHeights = configurations
    .map((c) => c.maxHeight)
    .filter((height): height is number => height !== null)

  const starts = minHeights
    .concat(maxHeights.map((height) => height + 1))
    .sort((a, b) => a - b)
    .filter((height, i, arr) => arr.indexOf(height) === i)

  let lastRange: ConfigurationRange<T> = {
    from: Number.NEGATIVE_INFINITY,
    to: Number.POSITIVE_INFINITY,
    configurations: [],
  }
  const ranges: ConfigurationRange<T>[] = [lastRange]
  for (const start of starts) {
    lastRange.to = start - 1
    lastRange = {
      from: start,
      to: Number.POSITIVE_INFINITY,
      configurations: [],
    }
    ranges.push(lastRange)
  }

  for (const configuration of configurations) {
    const min = getConfigurationMin(configuration)
    const max = configuration.maxHeight ?? Number.POSITIVE_INFINITY

    for (const range of ranges) {
      if (!(max < range.from || min > range.to)) {
        range.configurations.push(toPureConfiguration(configuration))
      }
    }
  }

  return ranges
}

function getConfigurationMin<T>(configuration: SavedConfiguration<T>) {
  return configuration.currentHeight !== null
    ? // if there is current height it means this point was synced, so we exclude this
      configuration.currentHeight + 1
    : // if there is no current height it means that is the first sync, so we include minHeight
      configuration.minHeight
}

function toPureConfiguration<T>(
  configuration: SavedConfiguration<T>,
): Configuration<T> {
  return {
    id: configuration.id,
    properties: configuration.properties,
    minHeight: configuration.minHeight,
    maxHeight: configuration.maxHeight,
  }
}
