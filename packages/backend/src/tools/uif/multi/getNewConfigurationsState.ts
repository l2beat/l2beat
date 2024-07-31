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
  const savedMap = new Map(saved.map((c) => [c.id, c]))

  const toTrim: RemovalConfiguration[] = []

  const configurations: SavedConfiguration<T>[] = []
  const toAdd: Configuration<T>[] = []
  const updated = new Map<string, SavedConfiguration<T>>()

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

    if (stored.minHeight > c.minHeight) {
      // We remove everything because we cannot have gaps in downloaded data
      // We will re-download everything from the beginning
      if (stored.currentHeight !== null) {
        toTrim.push({
          id: stored.id,
          from: stored.minHeight,
          to: stored.currentHeight,
        })
      }
      configurations.push({ ...c, currentHeight: null })

      setUpdated(c, null)
      continue
    }

    if (stored.minHeight < c.minHeight) {
      toTrim.push({
        id: stored.id,
        from: stored.minHeight,
        to: c.minHeight - 1,
      })
      setUpdated(c, stored.currentHeight)
    }

    if (c.maxHeight !== stored.maxHeight) {
      const currentHeight =
        stored.currentHeight === null
          ? null
          : Math.min(stored.currentHeight, c.maxHeight ?? Infinity)
      setUpdated(c, currentHeight)
    }

    if (
      c.maxHeight !== null &&
      stored.currentHeight &&
      stored.currentHeight > c.maxHeight
    ) {
      toTrim.push({
        id: stored.id,
        from: c.maxHeight + 1,
        to: stored.currentHeight,
      })
    }

    const currentHeight =
      stored.currentHeight === null
        ? null
        : // Handle special case when minHeight get change into the future
          // relative to current configuration state
          stored.currentHeight < c.minHeight
          ? null
          : Math.min(stored.currentHeight, c.maxHeight ?? stored.currentHeight)

    configurations.push({ ...c, currentHeight })

    if (stored.properties !== serializeConfiguration(c.properties)) {
      setUpdated(c, stored.currentHeight)
    }
  }

  const deleted = findDeleted(saved, knownIds, actual)

  return {
    diff: {
      toAdd,
      toUpdate: Array.from(updated.values()),
      toDelete: deleted.toDelete,
      toTrim: [...toTrim, ...deleted.toTrim],
    },
    configurations,
  }

  function setUpdated(c: Configuration<T>, targetHeight: number | null) {
    // Handle special case when minHeight get change into the future
    // relative to current configuration state
    const heightToSet =
      targetHeight === null
        ? null
        : targetHeight < c.minHeight
          ? null
          : targetHeight

    const existingConfig = updated.get(c.id)

    if (!existingConfig) {
      updated.set(c.id, { ...c, currentHeight: heightToSet })
      return
    }

    // If it is already null then do nothing
    if (existingConfig.currentHeight === null) {
      return
    }

    if (heightToSet === null) {
      updated.set(c.id, { ...c, currentHeight: heightToSet })
    } else if (heightToSet < existingConfig.currentHeight) {
      updated.set(c.id, { ...c, currentHeight: heightToSet })
    }
  }
}

function findDeleted<T>(
  saved: SavedConfiguration<string>[],
  knownIds: Set<string>,
  actual: Configuration<T>[],
) {
  const toDelete: string[] = saved
    .filter((s) => !knownIds.has(s.id))
    .map((c) => c.id)

  const actualMap = new Map(actual.map((c) => [c.id, c]))
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
  return { toDelete, toTrim }
}
