/**
 * Prototype: backfills key registration anonymity sets (Umbra stealth key
 * registrations) into a JSON file using the same fetch logic as
 * PrivacyKeyRegistrationIndexer, without needing a database.
 *
 * pnpm privacy:key-registration-anonymity-set [--from YYYY-MM-DD] [--to YYYY-MM-DD] [--file path]
 *
 * Requires ETHEREUM_RPC_URL in .env. Re-running is safe: records are upserted.
 */

import { getEnv, Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import {
  BlockProvider,
  HttpClient,
  LogsProvider,
  RpcClient,
} from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { command, option, optional, run, string } from 'cmd-ts'
import { FeatureFlags } from '../src/config/FeatureFlags'
import { getPrivacyConfig } from '../src/config/features/privacy'
import { AnonymitySetFileStore } from '../src/modules/privacy/AnonymitySetFileStore'
import { fetchKeyRegistrationRecords } from '../src/modules/privacy/indexers/PrivacyKeyRegistrationIndexer'
import type { PrivacyKeyRegistrationIndexerConfig } from '../src/modules/privacy/types'

const WINDOW_DAYS = 30
// Registrations are sparse, so a single getLogs call can cover many days.
const CHUNK_DAYS = 30

const cmd = command({
  name: 'privacy-key-registration-anonymity-set',
  args: {
    from: option({ type: optional(string), long: 'from' }),
    to: option({ type: optional(string), long: 'to' }),
    file: option({ type: optional(string), long: 'file' }),
  },
  handler: async (args) => {
    const logger = Logger.INFO
    const env = getEnv()

    const privacy = await getPrivacyConfig(
      new ProjectService(),
      env,
      new FeatureFlags('privacy.umbra'),
      [],
    )
    assert(privacy, 'Umbra privacy config not found')
    const configs = privacy.keyRegistrationAnonymitySetConfigs
    assert(configs.length > 0, 'No key registration anonymity set configs')
    const chain = configs[0]?.chain
    assert(chain === 'ethereum' && configs.every((c) => c.chain === chain))

    const rpcClient = new RpcClient({
      chain,
      url: env.string('ETHEREUM_RPC_URL'),
      http: new HttpClient(),
      callsPerMinute: env.integer('ETHEREUM_RPC_CALLS_PER_MINUTE', 600),
      retryStrategy: 'RELIABLE',
      logger,
    })
    const blockProvider = new BlockProvider(chain, [rpcClient])
    const logsProvider = new LogsProvider(chain, [rpcClient])
    const store = new AnonymitySetFileStore(
      args.file ?? privacy.keyRegistrationAnonymitySetFile,
    )

    const since = Math.min(...configs.map((c) => c.sinceTimestamp))
    const start = args.from
      ? Math.max(UnixTime.fromDate(new Date(args.from)), since)
      : since
    const end = args.to
      ? UnixTime.fromDate(new Date(args.to))
      : UnixTime.toStartOf(UnixTime.now(), 'hour')

    let from = start
    while (from < end) {
      const to = Math.min(from + CHUNK_DAYS * UnixTime.DAY, end)
      const active = configs.filter((c) => c.sinceTimestamp <= to)
      const records = await fetchKeyRegistrationRecords(
        { blockProvider, logsProvider },
        active.map((c) => ({
          id: c.id,
          minHeight: c.sinceTimestamp,
          maxHeight: null,
          properties: c,
        })),
        from,
        to,
      )
      await store.upsertMany(records)
      logger.info('Saved range', {
        from: new Date(from * 1000).toISOString().slice(0, 10),
        to: new Date(to * 1000).toISOString().slice(0, 10),
        records: records.length,
      })
      from = to
    }

    printSummary(await store.getAll(), configs, end, store.filePath)
  },
})

function printSummary(
  records: Awaited<ReturnType<AnonymitySetFileStore['getAll']>>,
  configs: PrivacyKeyRegistrationIndexerConfig[],
  end: UnixTime,
  filePath: string,
) {
  const windowEnd = UnixTime.toStartOf(end, 'day')
  const windowStart = windowEnd - WINDOW_DAYS * UnixTime.DAY
  console.log(`\nWrote ${records.length} records to ${filePath}`)
  console.log(
    `Distinct registrants in the ${WINDOW_DAYS} complete days before ${new Date(windowEnd * 1000).toISOString().slice(0, 10)}:`,
  )
  for (const config of configs) {
    const registrants = new Set(
      records
        .filter(
          (r) =>
            r.configurationId === config.id &&
            r.timestamp >= windowStart &&
            r.timestamp < windowEnd,
        )
        .map((r) => r.sender),
    )
    console.log(`  ${config.bucketId.padEnd(20)} ${registrants.size}`)
  }
}

run(cmd, process.argv.slice(2))
