import { getEnv } from '@l2beat/backend-tools'
import { getDiscoveryPaths, SQLiteCache } from '@l2beat/discovery'
import chalk from 'chalk'
import { command, option, optional, string } from 'cmd-ts'
import { createCliLogger } from '../implementations/common/CliLogger'
import {
  FETCHED_KINDS,
  fetchDiscoveryCache,
} from '../implementations/fetch-discovery-cache/fetchDiscoveryCache'

const SCAN_COUNT = 10_000

export const FetchDiscoveryCache = command({
  name: 'fetch-discovery-cache',
  description:
    'Copies block independent entries (sources, deployments, transactions, ...) from the update monitor cache into the local discovery cache.',
  args: {
    redisUrl: option({
      type: optional(string),
      long: 'redis-url',
      description:
        'update monitor cache URL, defaults to DISCOVERY_CACHE_URI from the environment or .env',
    }),
  },
  handler: async (args) => {
    const { commandOptions, createClient } = await import('redis')
    const redisUrl = args.redisUrl ?? getEnv().string('DISCOVERY_CACHE_URI')
    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const clients = FETCHED_KINDS.map(() => {
      const client = createClient({
        url: redisUrl,
        socket: { reconnectStrategy: false },
      })
      client.on('error', (error) => cli.log(chalk.red(String(error))))
      return client
    })
    const cachePath = getDiscoveryPaths().cache
    const cache = new SQLiteCache(cachePath)

    try {
      await Promise.all(clients.map((client) => client.connect()))
      cli.log(`Fetching into ${chalk.magenta(cachePath)}`)
      await fetchDiscoveryCache(
        cli,
        clients.map((client) => ({
          scan: (cursor, pattern) =>
            client.scan(cursor, { MATCH: pattern, COUNT: SCAN_COUNT }),
          dump: (key) =>
            client.dump(commandOptions({ returnBuffers: true }), key),
        })),
        cache,
      )
    } finally {
      const openClients = clients.filter((client) => client.isOpen)
      await Promise.all(openClients.map((client) => client.quit()))
    }
  },
})
