import { getEnv, Logger } from '@l2beat/backend-tools'
import { createDatabase } from '@l2beat/database'
import { command, optional, positional, run, string } from 'cmd-ts'
import { BridgeComparator } from '../BridgeComparator'
import { createBridgeComparePlugins } from '.'

const cmd = command({
  name: 'bridges:compare',
  args: {
    plugins: positional({ type: optional(string), displayName: 'plugins' }),
  },
  handler: async (args) => {
    const logger = Logger.DEBUG
    let comparePlugins = createBridgeComparePlugins(logger)

    if (args.plugins) {
      const configuredPlugins = args.plugins.split(',')
      comparePlugins = comparePlugins.filter((c) =>
        configuredPlugins.includes(c.name),
      )
    }

    const db = createDatabase({
      connectionString: getEnv().string('INTEROP_DB_URL'),
      application_name: 'INTEROP-COMPARE-LOCAL',
      ssl: { rejectUnauthorized: false },
      min: 2,
      max: 10,
      keepAlive: false,
    })

    const bridgeComparator = new BridgeComparator(db, comparePlugins, logger)

    await bridgeComparator.compare()
    await db.close()
  },
})

run(cmd, process.argv.slice(2))
