import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

interface ConfigurationsState<T> {
  diff: {
    toAdd: Configuration<T>[]
    toUpdate: SavedConfiguration<T>[]
    toDelete: string[]
    toTrim: RemovalConfiguration[]
  }
  configurations: SavedConfiguration<T>[]
}

export function getNewConfigurationsState<T>(
  actual: Configuration<T>[],
  serializeConfiguration: (value: T) => string,
  saved: SavedConfiguration<string>[],
): ConfigurationsState<T> {
  const actualMap = new Map(actual.map((c) => [c.id, c]))
  const savedMap = new Map(saved.map((c) => [c.id, c]))

  const toTrim: RemovalConfiguration[] = []
  for (const c of saved) {
    if (actualMap.has(c.id) || c.currentHeight === null) {
      continue
    }
    toTrim.push({
      id: c.id,
      from: c.minHeight,
      to: c.currentHeight,
    })
  }

  const configurations: SavedConfiguration<T>[] = []
  const toAdd: Configuration<T>[] = []
  const toUpdate: SavedConfiguration<T>[] = []

  const knownIds = new Set<string>()
  for (const c of actual) {
    if (knownIds.has(c.id)) {
      throw new Error(`Configuration ${c.id} is duplicated!`)
    }
    knownIds.add(c.id)

    if (c.maxHeight !== null && c.minHeight > c.maxHeight) {
      throw new Error(
        `Configuration ${c.id} has minHeight greater than maxHeight!`,
      )
    }

    const stored = savedMap.get(c.id)

    if (!stored) {
      toAdd.push({ ...c })
      configurations.push({ ...c, currentHeight: null })
      continue
    }

    if (stored.currentHeight === null) {
      configurations.push({ ...c, currentHeight: null })

      continue
    }

    if (stored.minHeight > c.minHeight) {
      // We remove everything because we cannot have gaps in downloaded data
      // We will re-download everything from the beginning
      toTrim.push({
        id: stored.id,
        from: stored.minHeight,
        to: stored.currentHeight,
      })
      configurations.push({ ...c, currentHeight: null })

      toUpdate.push({ ...c, currentHeight: null })
      continue
    }

    if (stored.minHeight < c.minHeight) {
      toTrim.push({
        id: stored.id,
        from: stored.minHeight,
        to: c.minHeight - 1,
      })
      toUpdate.push({ ...c, currentHeight: stored.currentHeight })
    }

    if (c.maxHeight !== stored.maxHeight) {
      const currentHeight = Math.min(
        stored.currentHeight,
        c.maxHeight ?? Infinity,
      )
      toUpdate.push({ ...c, currentHeight })
    }

    if (c.maxHeight !== null && stored.currentHeight > c.maxHeight) {
      toTrim.push({
        id: stored.id,
        from: c.maxHeight + 1,
        to: stored.currentHeight,
      })
    }

    const currentHeight = Math.min(
      stored.currentHeight,
      c.maxHeight ?? stored.currentHeight,
    )
    configurations.push({ ...c, currentHeight })
    if (stored.properties !== serializeConfiguration(c.properties)) {
      toUpdate.push({ ...c, currentHeight: stored.currentHeight })
    }
  }

  const toDelete: string[] = saved
    .filter((s) => !knownIds.has(s.id))
    .map((c) => c.id)

  return { diff: { toAdd, toUpdate, toDelete, toTrim }, configurations }
}
