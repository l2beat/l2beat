import { assert } from '@l2beat/backend-tools'
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

interface ConfigurationState2<T> {
  added: Configuration<T>[]
  updated: Map<string, SavedConfiguration<T>>
  trimmed: RemovalConfiguration[]
  configurations: SavedConfiguration<T>[]
}

export function getNewConfigurationsState<T>(
  actual: Configuration<T>[],
  serializeConfiguration: (value: T) => string,
  saved: SavedConfiguration<string>[],
): ConfigurationsState<T> {
  const savedMap = new Map(saved.map((c) => [c.id, c]))

  const state: ConfigurationState2<T> = {
    added: [],
    updated: new Map(),
    trimmed: [],
    configurations: [],
  }

  const knownIds = new Set<string>()
  for (const c of actual) {
    assert(!knownIds.has(c.id), `Configuration ${c.id} is duplicated!`)
    assert(
      c.maxHeight === null || c.minHeight <= c.maxHeight,
      `Configuration ${c.id} has minHeight greater than maxHeight!`,
    )
    knownIds.add(c.id)

    const stored = savedMap.get(c.id)

    if (!stored) {
      state.added.push({ ...c })
      state.configurations.push({ ...c, currentHeight: null })
      continue
    }

    if (stored.minHeight > c.minHeight) {
      // We remove everything because we cannot have gaps in downloaded data
      // We will re-download everything from the beginning
      if (stored.currentHeight !== null) {
        state.trimmed.push({
          id: stored.id,
          from: stored.minHeight,
          to: stored.currentHeight,
        })
      }
      state.configurations.push({ ...c, currentHeight: null })
      setUpdated(state, c, null)
      continue
    }

    if (stored.minHeight < c.minHeight) {
      state.trimmed.push({
        id: stored.id,
        from: stored.minHeight,
        to: c.minHeight - 1,
      })
      setUpdated(state, c, stored.currentHeight)
    }

    if (c.maxHeight !== stored.maxHeight) {
      if (
        c.maxHeight !== null &&
        stored.currentHeight !== null &&
        stored.currentHeight > c.maxHeight
      ) {
        state.trimmed.push({
          id: stored.id,
          from: c.maxHeight + 1,
          to: stored.currentHeight,
        })
      }

      const currentHeight =
        stored.currentHeight === null
          ? null
          : Math.min(stored.currentHeight, c.maxHeight ?? Infinity)
      setUpdated(state, c, currentHeight)
    }

    const currentHeight =
      stored.currentHeight === null
        ? null
        : // Handle special case when minHeight get change into the future
          // relative to current configuration state
          stored.currentHeight < c.minHeight
          ? null
          : Math.min(stored.currentHeight, c.maxHeight ?? stored.currentHeight)

    state.configurations.push({ ...c, currentHeight })

    if (stored.properties !== serializeConfiguration(c.properties)) {
      setUpdated(state, c, stored.currentHeight)
    }
  }

  const deleted = findDeleted(saved, knownIds, actual)

  return {
    diff: {
      toAdd: state.added,
      toUpdate: Array.from(state.updated.values()),
      toDelete: deleted.toDelete,
      toTrim: [...state.trimmed, ...deleted.toTrim],
    },
    configurations: state.configurations,
  }
}

function setUpdated<T>(
  state: ConfigurationState2<T>,
  c: Configuration<T>,
  targetHeight: number | null,
) {
  // Handle special case when minHeight get change into the future
  // relative to current configuration state
  const heightToSet =
    targetHeight === null
      ? null
      : targetHeight < c.minHeight
        ? null
        : targetHeight

  const existingConfig = state.updated.get(c.id)

  if (!existingConfig) {
    state.updated.set(c.id, { ...c, currentHeight: heightToSet })
    return
  }

  // If it is already null then do nothing
  if (existingConfig.currentHeight === null) {
    return
  }

  if (heightToSet === null) {
    state.updated.set(c.id, { ...c, currentHeight: heightToSet })
  } else if (heightToSet < existingConfig.currentHeight) {
    state.updated.set(c.id, { ...c, currentHeight: heightToSet })
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
