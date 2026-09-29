/**
 * Prototype: backfills Starknet (STRK-20) anonymity set deposits into a JSON
 * file using the same fetch logic as StarknetPrivacyAnonymitySetIndexer,
 * without needing a database.
 *
 * pnpm privacy:starknet-anonymity-set [--from YYYY-MM-DD] [--to YYYY-MM-DD] [--file path]
 *
 * Requires STARKNET_RPC_URL in .env. Re-running is safe: records are upserted.
 */

import { getEnv, Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { BlockProvider, HttpClient, StarknetClient } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { command, option, optional, run, string } from 'cmd-ts'
import { FeatureFlags } from '../src/config/FeatureFlags'
import { getPrivacyConfig } from '../src/config/features/privacy'
import { AnonymitySetFileStore } from '../src/modules/privacy/AnonymitySetFileStore'
import { fetchStarknetAnonymitySetRecords } from '../src/modules/privacy/indexers/StarknetPrivacyAnonymitySetIndexer'
import type { PrivacyConfig } from '../src/modules/privacy/types'

const WINDOW_DAYS = 30

const cmd = command({
  name: 'privacy-starknet-anonymity-set',
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
      new FeatureFlags('privacy.strk20'),
      [],
    )
    assert(privacy, 'STRK-20 privacy config not found')
    const configs = privacy.starknetAnonymitySetConfigs
    assert(configs.length > 0, 'No Starknet anonymity set configs')
    const chain = configs[0]?.chain
    assert(chain && configs.every((c) => c.chain === chain))

    const starknetClient = new StarknetClient({
      sourceName: chain,
      url: env.string('STARKNET_RPC_URL'),
      http: new HttpClient(),
      callsPerMinute: env.integer('STARKNET_RPC_CALLS_PER_MINUTE', 600),
      retryStrategy: 'RELIABLE',
      logger,
    })
    const blockProvider = new BlockProvider(chain, [starknetClient])
    const store = new AnonymitySetFileStore(
      args.file ?? privacy.starknetAnonymitySetFile,
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
      const to = Math.min(UnixTime.toNext(from, 'day'), end)
      const active = configs.filter((c) => c.sinceTimestamp <= to)
      const records = await fetchStarknetAnonymitySetRecords(
        { chain, blockProvider, starknetClient },
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
      logger.info('Saved day', {
        day: new Date(from * 1000).toISOString().slice(0, 10),
        records: records.length,
      })
      from = to
    }

    printSummary(await store.getAll(), privacy.projects, end, store.filePath)
  },
})

function printSummary(
  records: Awaited<ReturnType<AnonymitySetFileStore['getAll']>>,
  projects: PrivacyConfig['projects'],
  end: UnixTime,
  filePath: string,
) {
  const windowStart = end - WINDOW_DAYS * UnixTime.DAY
  console.log(`\nWrote ${records.length} records to ${filePath}`)
  console.log(`Distinct depositors in the ${WINDOW_DAYS} days before end:`)
  for (const project of projects) {
    for (const token of project.privacyInfo.tokens) {
      for (const bucket of token.buckets) {
        if (bucket.anonymitySet === undefined) continue
        const rows = records.filter(
          (r) =>
            r.bucketId === bucket.id &&
            r.timestamp >= windowStart &&
            r.timestamp < end,
        )
        const cohorts = ['0', ...bucket.anonymitySet.minimumAmounts].map(
          (minimum) => {
            const senders = new Set(
              rows
                .filter((r) => r.amount >= BigInt(minimum))
                .map((r) => r.sender),
            )
            return `>=${minimum}: ${senders.size}`
          },
        )
        console.log(`  ${bucket.id.padEnd(16)} ${cohorts.join('  ')}`)
      }
    }
  }
}

run(cmd, process.argv.slice(2))
