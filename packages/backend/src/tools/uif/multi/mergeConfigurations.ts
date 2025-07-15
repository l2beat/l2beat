import { assert } from '@l2beat/shared-pure'
import type {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

export interface ConfigurationsDiff<T> {
  toAdd: Configuration<T>[]
  toUpdate: SavedConfiguration<T>[]
  toTrimDataAfterUpdate: RemovalConfiguration[]
  toWipeDataAfterUpdate: RemovalConfiguration[]
  toDelete: string[]
  toWipeDataAfterDelete: RemovalConfiguration[]
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
  configurationsTrimmingDisabled?: boolean,
): MergeResult<T> {
  const maps = getConfigurationsAsMaps(saved, actual)

  const toAdd: Configuration<T>[] = []
  const toUpdate: SavedConfiguration<T>[] = []
  const toTrimDataAfterUpdate: RemovalConfiguration[] = []
  const toWipeDataAfterUpdate: RemovalConfiguration[] = []
  const toDelete: string[] = []
  const toWipeDataAfterDelete: RemovalConfiguration[] = []
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
        toWipeDataAfterUpdate.push({
          id: stored.id,
          from: stored.minHeight,
          to: stored.currentHeight,
        })
      }
      currentHeight = null
    } else if (c.minHeight > stored.minHeight) {
      // If trimming disabled we wipe everything
      if (configurationsTrimmingDisabled) {
        if (stored.currentHeight) {
          toWipeDataAfterUpdate.push({
            id: stored.id,
            from: stored.minHeight,
            to: stored.currentHeight,
          })
          currentHeight = null
        }
      } else {
        toTrimDataAfterUpdate.push({
          id: stored.id,
          from: stored.minHeight,
          to: c.minHeight - 1,
        })
        if (currentHeight !== null && currentHeight < c.minHeight) {
          currentHeight = null
        }
      }
    }

    if (c.maxHeight !== stored.maxHeight) {
      if (configurationsTrimmingDisabled) {
        if (stored.currentHeight) {
          toWipeDataAfterUpdate.push({
            id: stored.id,
            from: stored.minHeight,
            to: stored.currentHeight,
          })
          currentHeight = null
        }
      } else {
        if (
          c.maxHeight !== null &&
          currentHeight !== null &&
          c.maxHeight < currentHeight
        ) {
          toTrimDataAfterUpdate.push({
            id: stored.id,
            from: c.maxHeight + 1,
            to: currentHeight,
          })
          currentHeight = c.maxHeight
        }
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
        toWipeDataAfterDelete.push({
          id: c.id,
          from: c.minHeight,
          to: c.currentHeight,
        })
      }
    }
  }

  return {
    diff: {
      toAdd,
      toUpdate,
      toTrimDataAfterUpdate,
      toWipeDataAfterDelete,
      toDelete,
      toWipeDataAfterUpdate,
    },
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
    Number.POSITIVE_INFINITY,
  )
}
