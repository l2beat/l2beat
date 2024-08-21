import { assert } from '@l2beat/shared-pure'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

export interface ConfigurationsDiff<T> {
  toAdd: Configuration<T>[]
  toUpdate: SavedConfiguration<T>[]
  toDelete: string[]
  toRemoveData: RemovalConfiguration[]
}

export interface MergeResult<T> {
  diff: ConfigurationsDiff<T>
  configurations: SavedConfiguration<T>[]
  safeHeight: number
}

export function mergeConfigurations<T>(
  saved: SavedConfiguration<string>[],
  actual: Configuration<T>[],
  serializeConfiguration: (value: T) => string,
): MergeResult<T> {
  const maps = getConfigurationsAsMaps(saved, actual)

  const toAdd: Configuration<T>[] = []
  const toUpdate: SavedConfiguration<T>[] = []
  const toDelete: string[] = []
  const toRemoveData: RemovalConfiguration[] = []
  const configurations: SavedConfiguration<T>[] = []

  for (const c of actual) {
    const stored = maps.saved.get(c.id)

    if (!stored) {
      toAdd.push(c)
      configurations.push({ ...c, currentHeight: null })
      continue
    }

    let currentHeight = stored.currentHeight
    if (c.minHeight < stored.minHeight) {
      // We remove everything because we cannot have gaps in downloaded data
      // We will re-download everything from the beginning
      if (stored.currentHeight !== null) {
        toRemoveData.push({
          id: stored.id,
          from: stored.minHeight,
          to: stored.currentHeight,
        })
      }
      currentHeight = null
    } else if (c.minHeight > stored.minHeight) {
      toRemoveData.push({
        id: stored.id,
        from: stored.minHeight,
        to: c.minHeight - 1,
      })
      if (currentHeight !== null && currentHeight < c.minHeight) {
        currentHeight = null
      }
    }

    if (c.maxHeight !== stored.maxHeight) {
      if (
        c.maxHeight !== null &&
        currentHeight !== null &&
        c.maxHeight < currentHeight
      ) {
        toRemoveData.push({
          id: stored.id,
          from: c.maxHeight + 1,
          to: currentHeight,
        })
        currentHeight = c.maxHeight
      }
    }

    configurations.push({ ...c, currentHeight })

    if (
      stored.currentHeight !== currentHeight ||
      stored.maxHeight !== c.maxHeight ||
      stored.minHeight !== c.minHeight ||
      stored.properties !== serializeConfiguration(c.properties)
    ) {
      toUpdate.push({ ...c, currentHeight })
    }
  }

  for (const c of saved) {
    if (!maps.actual.has(c.id)) {
      toDelete.push(c.id)

      if (c.currentHeight !== null) {
        toRemoveData.push({
          id: c.id,
          from: c.minHeight,
          to: c.currentHeight,
        })
      }
    }
  }

  return {
    diff: { toAdd, toUpdate, toDelete, toRemoveData },
    configurations: configurations,
    safeHeight: getSafeHeight(configurations),
  }
}

function getConfigurationsAsMaps<T>(
  saved: SavedConfiguration<string>[],
  actual: Configuration<T>[],
) {
  const savedMap = new Map(saved.map((c) => [c.id, c]))
  const actualMap = new Map()

  assert(actual.length > 0, 'Actual configurations should not be empty')
  for (const c of actual) {
    assert(!actualMap.has(c.id), `Configuration ${c.id} is duplicated!`)
    assert(
      c.maxHeight === null || c.minHeight <= c.maxHeight,
      `Configuration ${c.id} has minHeight greater than maxHeight!`,
    )
    actualMap.set(c.id, c)
  }

  return { saved: savedMap, actual: actualMap }
}

function getSafeHeight<T>(configurations: SavedConfiguration<T>[]) {
  return configurations.reduce(
    (agg, curr) =>
      (agg = Math.min(agg, curr.currentHeight ?? curr.minHeight - 1)),
    Infinity,
  )
}
