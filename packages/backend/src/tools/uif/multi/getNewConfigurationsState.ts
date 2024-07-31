import { assert } from '@l2beat/backend-tools'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

interface ConfigurationState<T> {
  added: Configuration<T>[]
  updated: Map<string, SavedConfiguration<T>>
  deleted: string[]
  trimmed: RemovalConfiguration[]
  configurations: SavedConfiguration<T>[]
}

export function getNewConfigurationsState<T>(
  actual: Configuration<T>[],
  serializeConfiguration: (value: T) => string,
  saved: SavedConfiguration<string>[],
) {
  const state = initializeEmptyState<T>()

  const savedMap = new Map(saved.map((c) => [c.id, c]))
  const knownIds = new Set<string>()

  for (const c of actual) {
    assertConfigurationValidity(knownIds, c)
    knownIds.add(c.id)

    const stored = savedMap.get(c.id)

    if (!stored) {
      handleNewConfiguration(state, c)
      continue
    }

    if (stored.minHeight > c.minHeight) {
      handleMinHeightDecrease(state, stored, c)
      continue
    }

    if (stored.minHeight < c.minHeight) {
      handleMinHeightIncrease(state, stored, c)
    }

    if (c.maxHeight !== stored.maxHeight) {
      handleMaxHeightChange(state, stored, c)
    }

    const currentHeight = calculateCurrentHeight(stored, c)

    state.configurations.push({ ...c, currentHeight })

    if (stored.properties !== serializeConfiguration(c.properties)) {
      setUpdated(state, c, stored.currentHeight)
    }
  }

  findDeleted(state, saved, knownIds, actual)

  return {
    diff: {
      toAdd: state.added,
      toUpdate: Array.from(state.updated.values()),
      toDelete: state.deleted,
      toTrim: state.trimmed,
    },
    configurations: state.configurations,
  }
}

function assertConfigurationValidity<T>(
  knownIds: Set<string>,
  c: Configuration<T>,
) {
  assert(!knownIds.has(c.id), `Configuration ${c.id} is duplicated!`)
  assert(
    c.maxHeight === null || c.minHeight <= c.maxHeight,
    `Configuration ${c.id} has minHeight greater than maxHeight!`,
  )
}

function calculateCurrentHeight<T>(
  stored: SavedConfiguration<string>,
  c: Configuration<T>,
) {
  if (stored.currentHeight === null) {
    return null
  }

  if (stored.currentHeight < c.minHeight) {
    return null
  }

  return Math.min(stored.currentHeight, c.maxHeight ?? stored.currentHeight)
}

function handleMaxHeightChange<T>(
  state: ConfigurationState<T>,
  stored: SavedConfiguration<string>,
  c: Configuration<T>,
) {
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

function handleMinHeightIncrease<T>(
  state: ConfigurationState<T>,
  stored: SavedConfiguration<string>,
  c: Configuration<T>,
) {
  state.trimmed.push({
    id: stored.id,
    from: stored.minHeight,
    to: c.minHeight - 1,
  })
  setUpdated(state, c, stored.currentHeight)
}

function handleMinHeightDecrease<T>(
  state: ConfigurationState<T>,
  stored: SavedConfiguration<string>,
  c: Configuration<T>,
) {
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
}

function handleNewConfiguration<T>(
  state: ConfigurationState<T>,
  c: Configuration<T>,
) {
  state.added.push({ ...c })
  state.configurations.push({ ...c, currentHeight: null })
}

function initializeEmptyState<T>(): ConfigurationState<T> {
  return {
    added: [],
    updated: new Map(),
    deleted: [],
    trimmed: [],
    configurations: [],
  }
}

function setUpdated<T>(
  state: ConfigurationState<T>,
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
  state: ConfigurationState<T>,
  saved: SavedConfiguration<string>[],
  knownIds: Set<string>,
  actual: Configuration<T>[],
) {
  state.deleted = saved.filter((s) => !knownIds.has(s.id)).map((c) => c.id)

  const actualMap = new Map(actual.map((c) => [c.id, c]))

  for (const c of saved) {
    if (actualMap.has(c.id) || c.currentHeight === null) {
      continue
    }
    state.trimmed.push({
      id: c.id,
      from: c.minHeight,
      to: c.currentHeight,
    })
  }
}
