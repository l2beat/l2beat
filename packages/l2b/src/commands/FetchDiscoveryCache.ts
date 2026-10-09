import { getDiscoveryPaths, SQLiteCache } from '@l2beat/discovery'
import chalk from 'chalk'
import { command, positional, string } from 'cmd-ts'
import { createCliLogger } from '../implementations/common/CliLogger'
import { fetchDiscoveryCache } from '../implementations/fetch-discovery-cache/fetchDiscoveryCache'

const SCAN_COUNT = 10_000

export const FetchDiscoveryCache = command({
  name: 'fetch-discovery-cache',
  description:
    'Copies block independent entries (sources, deployments, transactions, ...) from the update monitor cache into the local discovery cache.',
  args: {
    redisUrl: positional({
      type: string,
      displayName: 'redisUrl',
    }),
  },
  handler: async (args) => {
    const { commandOptions, createClient } = await import('redis')
    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const client = createClient({
      url: args.redisUrl,
      socket: { reconnectStrategy: false },
    })
    client.on('error', (error) => cli.log(chalk.red(String(error))))
    const cachePath = getDiscoveryPaths().cache
    const cache = new SQLiteCache(cachePath)

    await client.connect()
    try {
      cli.log(`Fetching into ${chalk.magenta(cachePath)}`)
      await fetchDiscoveryCache(
        cli,
        {
          scan: (cursor, pattern) =>
            client.scan(cursor, { MATCH: pattern, COUNT: SCAN_COUNT }),
          dump: (key) =>
            client.dump(commandOptions({ returnBuffers: true }), key),
        },
        cache,
      )
    } finally {
      if (client.isOpen) {
        await client.quit()
      }
    }
  },
})
