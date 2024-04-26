import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

export function diffConfigurations<T>(
  actual: Configuration<T>[],
  saved: SavedConfiguration<T>[],
): {
  toRemove: RemovalConfiguration<T>[]
  toSave: SavedConfiguration<T>[]
  safeHeight: number
} {
  let safeHeight = Infinity

  const actualMap = new Map(actual.map((c) => [c.id, c]))
  const savedMap = new Map(saved.map((c) => [c.id, c]))

  const toRemove: RemovalConfiguration<T>[] = []
  for (const c of saved) {
    if (actualMap.has(c.id) || c.currentHeight === null) {
      continue
    }
    toRemove.push({
      id: c.id,
      properties: c.properties,
      from: c.minHeight,
      to: c.currentHeight,
    })
  }

  const toSave: SavedConfiguration<T>[] = []

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
    if (!stored || stored.currentHeight === null) {
      safeHeight = Math.min(safeHeight, c.minHeight - 1)
      toSave.push({ ...c, currentHeight: null })
      continue
    }

    if (stored.minHeight > c.minHeight) {
      safeHeight = Math.min(safeHeight, c.minHeight - 1)
      // We remove everything because we cannot have gaps in downloaded data
      // We will re-download everything from the beginning
      toRemove.push({
        id: stored.id,
        properties: stored.properties,
        from: stored.minHeight,
        to: stored.currentHeight,
      })
      toSave.push({ ...c, currentHeight: null })
      continue
    }

    if (stored.minHeight < c.minHeight) {
      toRemove.push({
        id: stored.id,
        properties: stored.properties,
        from: stored.minHeight,
        to: c.minHeight - 1,
      })
    }

    if (c.maxHeight !== null && stored.currentHeight > c.maxHeight) {
      toRemove.push({
        id: stored.id,
        properties: stored.properties,
        from: c.maxHeight + 1,
        to: stored.currentHeight,
      })
    } else if (c.maxHeight === null || stored.currentHeight < c.maxHeight) {
      safeHeight = Math.min(safeHeight, stored.currentHeight)
    }

    const currentHeight = Math.min(
      stored.currentHeight,
      c.maxHeight ?? stored.currentHeight,
    )
    toSave.push({ ...c, currentHeight })
  }

  return { toRemove, toSave, safeHeight }
}
