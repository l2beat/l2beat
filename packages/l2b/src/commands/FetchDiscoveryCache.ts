import { SQLiteCache } from '@l2beat/discovery'
import { formatSI } from '@l2beat/shared'
import { formatSeconds } from '@l2beat/shared-pure'
import { command, positional, string } from 'cmd-ts'
import { createClient } from 'redis'

export const FetchDiscoveryCache = command({
  name: 'fetch-discovery-cache',
  description:
    'Connects to the redis cache and downloads it into an SQLite database.',
  args: {
    redisPath: positional({
      type: string,
      displayName: 'redisPath',
    }),
  },
  handler: async (args) => {
    const client = createClient({ url: args.redisPath })
    client.on('error', console.error)
    const cache = new SQLiteCache()

    if (!client.isOpen) {
      await client.connect()
    }

    const SCAN_COUNT = 50_000
    let cursor = 0
    let rowsFetched = 0
    do {
      let scanElapsed = -performance.now()
      const result = await client.scan(cursor, { COUNT: SCAN_COUNT })
      scanElapsed += performance.now()
      cursor = result.cursor

      let getElapsed = -performance.now()
      const values = await client.MGET(result.keys)
      getElapsed += performance.now()

      let dbElapsed = -performance.now()
      for (const [i, key] of result.keys.entries()) {
        if (values[i] !== null) {
          cache.set(key, values[i])
        }
      }
      dbElapsed += performance.now()

      rowsFetched += result.keys.length

      const timePerMillionRows = formatSeconds(
        (((scanElapsed + getElapsed + dbElapsed) / values.length) * 1_000_000) /
          1000,
      )

      console.log(
        `Progress: ${formatSI(rowsFetched, 'rows').padStart(13)} | ` +
          `Batch: ${result.keys.length.toLocaleString().padStart(6)} keys | ` +
          `KRead: ${scanElapsed.toFixed(2).padStart(7)}ms | ` +
          `VRead: ${getElapsed.toFixed(2).padStart(7)}ms | ` +
          `Write: ${dbElapsed.toFixed(2).padStart(7)}ms | ` +
          `1MRow: ${timePerMillionRows.padStart(10)}`,
      )
    } while (cursor !== 0)
  },
})
