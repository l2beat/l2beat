import {
  getDiscoveryPaths,
  isPendingItem,
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
          config.watches.map((watch) => watch.key).sort(),
        )
      })

      it('has a sorted watched.json without pending items', () => {
        const text = readFileSync(join(location.path, WATCHED_FILE), 'utf-8')
        const raw = JSON.parse(text)
        expect(formatJson(raw)).toEqual(text)
        const watched = reader.readWatched(location.name)
        expect(watched).not.toEqual(undefined)
        // An object built from sorted keys has the order JSON can hold:
        // index-like keys such as "2" and "10" come first, in numeric order.
        const keys = Object.keys(watched?.values ?? {})
        const ordered = Object.fromEntries(
          [...keys].sort().map((key) => [key, true]),
        )
        expect(keys).toEqual(Object.keys(ordered))
        // Validate each watch value individually so depth-8 template outputs
        // are not rejected for sitting inside the watched.json envelope.
        for (const value of Object.values(watched?.values ?? {})) {
          expect(JSON.stringify(sortDeep(value))).toEqual(JSON.stringify(value))
          visitObjects(value, (object) => {
            expect(isPendingItem(object)).toEqual(false)
          })
        }
      })
    })
  }
})
