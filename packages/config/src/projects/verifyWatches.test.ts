import {
  getDiscoveryPaths,
  sortDeep,
  visitObjects,
  WATCH_TEMPLATES,
  WATCHED_FILE,
  WatchReader,
} from '@l2beat/discovery'
import { formatJson } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Verify watches', () => {
  const reader = new WatchReader(getDiscoveryPaths(), WATCH_TEMPLATES)

  for (const location of reader.readAllWatches()) {
    describe(location.name, () => {
      it('has a watch.jsonc with registered templates and valid params', () => {
        reader.readWatchConfig(location.name)
      })

      it('has a watched.json with a value for every watch key', () => {
        const config = reader.readWatchConfig(location.name)
        const watched = reader.readWatched(location.name)
        expect(watched).not.toEqual(undefined)
        expect(Object.keys(watched?.values ?? {}).sort()).toEqual(
          config.watches.map((watch) => watch.key),
        )
      })

      it('has a sorted watched.json without pending items', () => {
        const text = readFileSync(join(location.path, WATCHED_FILE), 'utf-8')
        const watched = JSON.parse(text)
        expect(formatJson(watched)).toEqual(text)
        expect(JSON.stringify(sortDeep(watched))).toEqual(
          JSON.stringify(watched),
        )
        visitObjects(watched, (object) => {
          expect(Object.hasOwn(object, 'pending')).toEqual(false)
        })
      })
    })
  }
})
