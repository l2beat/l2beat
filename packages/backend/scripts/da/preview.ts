import { type Env, getEnv, Logger, type LogLevel } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { daTrackingDomain } from '@l2beat/config/build/snapshots/daTracking/identities'
import { createDatabase, type DataAvailabilityRecord } from '@l2beat/database'
import { getBlockNumberAtOrBefore, HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import {
  boolean,
  command,
  flag,
  option,
  optional,
  positional,
  run,
  string,
} from 'cmd-ts'
import { config as dotenv } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { getDaTrackingConfig } from '../../src/config/features/da'
import { BlobService } from '../../src/modules/data-availability/services/BlobService'
import { DaService } from '../../src/modules/data-availability/services/DaService'
import { createBlobSource } from './blobSource'
import { createPreviewClients, DB_CACHE_URL } from './clients'
import { diffSnapshots, type SnapshotDiff } from './diffSnapshot'
import { previewEigen } from './eigenPreview'
import { type ExpectedCoverage, findRecordGaps } from './gaps'
import { summarizeGaps, summarizeRecords, writePreviewJson } from './output'
import {
  ceilToHour,
  clampBlockRange,
  hoursInWindow,
  parseTimeArg,
  resolveWindow,
} from './range'

const LAYERS = ['ethereum', 'celestia', 'avail', 'eigenda'] as const

const SNAPSHOT_PATH = path.join(
  __dirname,
  '../../../config/src/snapshots/daTracking/snapshot.json',
)
const OUTPUT_PATH = './scripts/da/preview.json'

const args = {
  project: positional({
    type: optional(string),
    displayName: 'projectId',
    description: 'Project for which DA tracking will be previewed',
  }),
  from: option({
    type: optional(string),
    long: 'from',
    short: 'f',
    description: 'Window start - unix seconds or ISO date (default: to - 3h)',
  }),
  to: option({
    type: optional(string),
    long: 'to',
    short: 't',
    description: 'Window end - unix seconds or ISO date (default: now)',
  }),
  layer: option({
    type: optional(string),
    long: 'layer',
    short: 'l',
    description: `Only preview a single DA layer (${LAYERS.join('|')})`,
  }),
  diffOnly: flag({
    type: boolean,
    long: 'diff-only',
    description: 'Only print the configuration identity diff (no network)',
  }),
}

const cmd = command({
  name: 'da:preview',
  args,
  handler: async (args) => {
    // Loaded before getEnv() so scripts/da/.env takes precedence over
    // packages/backend/.env (dotenv never overwrites already-set variables)
    dotenv({ path: path.join(__dirname, '.env') })
    let env = getEnv()
    const logger = initLogger(env)
    const start = Date.now()

    if (args.layer && !LAYERS.includes(args.layer as (typeof LAYERS)[number])) {
      logger.error(
        `Unknown layer '${args.layer}' - use one of: ${LAYERS.join(', ')}`,
      )
      process.exit(1)
    }

    const snapshotDiff = printSnapshotDiff(logger)
    if (args.diffOnly) {
      process.exit(0)
    }

    const dbUrl = env.optionalString('DA_PREVIEW_DB_URL')
    if (dbUrl && !env.optionalString('ETHEREUM_BEACON_API_URL')) {
      // Keep ethereum configs assembled even without a beacon url - blobs
      // will come exclusively from the database cache.
      env = getEnv({ ETHEREUM_BEACON_API_URL: DB_CACHE_URL })
    }
    warnAboutDisabledLayers(env, logger)

    const ps = new ProjectService()
    const daConfig = await getDaTrackingConfig(ps, env)

    const projectFilter = (c: { projectId: string }) =>
      !args.project || c.projectId === args.project
    const layerFilter = (c: { daLayer: string }) =>
      !args.layer || c.daLayer === args.layer

    const blockConfigs = daConfig.blockProjects
      .filter(projectFilter)
      .filter(layerFilter)
    const timestampConfigs = daConfig.timestampProjects
      .filter(projectFilter)
      .filter(layerFilter)

    if (blockConfigs.length === 0 && timestampConfigs.length === 0) {
      logger.error(
        'No matching DA tracking configurations - check the project id, layer filter and env urls',
      )
      process.exit(1)
    }

    const window = resolveWindow(
      args.from ? parseTimeArg(args.from) : undefined,
      args.to ? parseTimeArg(args.to) : undefined,
    )
    logger.info('Preview window', {
      from: UnixTime.toDate(window.from).toISOString(),
      to: UnixTime.toDate(window.to).toISOString(),
    })

    const http = new HttpClient()
    const clients = await createPreviewClients(daConfig, ps, env, logger, http)
    const blobService = dbUrl ? createBlobService(dbUrl) : undefined

    const daService = new DaService()
    const records: DataAvailabilityRecord[] = []
    const expected: ExpectedCoverage[] = []

    for (const layer of clients.blockLayers) {
      const layerConfigs = blockConfigs.filter((c) => c.daLayer === layer.name)
      if (layerConfigs.length === 0) {
        continue
      }

      if (
        layer.type === 'ethereum' &&
        !blobService &&
        window.to - window.from > 6 * UnixTime.HOUR
      ) {
        logger.warn(
          'Previewing more than 6h of ethereum blobs without DA_PREVIEW_DB_URL will be slow',
        )
      }

      logger.info(`Resolving ${layer.name} block range for the window`)
      const latest = await layer.blockClient.getLatestBlockNumber()
      const getBlock = (n: number) =>
        layer.blockClient.getBlockWithTransactions(n)
      const fromBlock = await getBlockNumberAtOrBefore(
        window.from,
        layer.startingBlock,
        latest,
        getBlock,
      )
      const toBlock = await getBlockNumberAtOrBefore(
        window.to - 1,
        fromBlock,
        latest,
        getBlock,
      )
      logger.info(`Using ${layer.name} blocks`, { fromBlock, toBlock })

      const source = createBlobSource(layer, blobService, logger)
      const blobs = (await source.getBlobs(fromBlock, toBlock)).filter(
        (b) => b.blockTimestamp >= window.from && b.blockTimestamp < window.to,
      )
      logger.info(`Fetched ${blobs.length} ${layer.name} blobs`)

      // Hours where the layer produced any data at all - hours outside this
      // set are a source problem (e.g. lagging blob cache), not a config gap
      const layerHours = new Set(
        blobs.map((b) => UnixTime.toStartOf(b.blockTimestamp, 'hour')),
      )
      const hoursWithoutLayerData = hoursInWindow(window).filter(
        (h) => !layerHours.has(h),
      )
      if (hoursWithoutLayerData.length > 0) {
        logger.warn(
          `No ${layer.name} blobs at all in ${hoursWithoutLayerData.length} hour(s) of the window - the blob source may be lagging; these hours are excluded from gap detection`,
          {
            hours: hoursWithoutLayerData.map((h) =>
              UnixTime.toDate(h).toISOString(),
            ),
          },
        )
      }

      for (const config of layerConfigs) {
        const range = clampBlockRange(config, fromBlock, toBlock)
        if (!range) {
          logger.warn('Configuration inactive in window - skipping', {
            projectId: config.projectId,
            configurationId: config.configurationId,
          })
          continue
        }

        // Active time bounds within the window: only resolve boundary block
        // timestamps when the config starts or ends inside the fetched range
        const activeFrom =
          range.from > fromBlock
            ? ceilToHour((await getBlock(range.from)).timestamp)
            : window.from
        const activeTo =
          range.to < toBlock
            ? UnixTime.toStartOf((await getBlock(range.to)).timestamp, 'hour')
            : window.to
        expected.push({
          projectId: config.projectId,
          daLayer: config.daLayer,
          configurationId: config.configurationId,
          hours: hoursInWindow({ from: activeFrom, to: activeTo }).filter((h) =>
            layerHours.has(h),
          ),
        })

        const blobsInRange = blobs.filter(
          (b) => b.blockNumber >= range.from && b.blockNumber <= range.to,
        )
        if (blobsInRange.length === 0) {
          continue
        }
        const result = daService.generateRecords(blobsInRange, [], [config])
        records.push(...result.records)
      }
    }

    if (clients.eigen && timestampConfigs.length > 0) {
      const eigenResult = await previewEigen(
        clients.eigen,
        timestampConfigs,
        window,
        logger,
      )
      records.push(...eigenResult.records)
      expected.push(...eigenResult.expected)
    }

    records.sort(
      (a, b) =>
        a.projectId.localeCompare(b.projectId) ||
        a.timestamp - b.timestamp ||
        a.daLayer.localeCompare(b.daLayer),
    )

    const gaps = findRecordGaps(records, expected)

    summarizeRecords(records, logger)
    summarizeGaps(gaps, logger)
    writePreviewJson(OUTPUT_PATH, {
      window: {
        from: UnixTime.toDate(window.from).toISOString(),
        to: UnixTime.toDate(window.to).toISOString(),
      },
      snapshotDiff,
      gaps: gaps.map((gap) => ({
        ...gap,
        missingHours: gap.missingHours.map((h) =>
          UnixTime.toDate(h).toISOString(),
        ),
      })),
      records,
    })
    logger.info(`Go to ${OUTPUT_PATH} for the full hourly records`)

    const duration = (Date.now() - start) / 1000
    logger.info(`DA preview completed in ${duration.toFixed(2)}s`)

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

function initLogger(env: Env) {
  return new Logger({
    level: env.string('LOG_LEVEL', 'INFO') as LogLevel,
  })
}

function printSnapshotDiff(logger: Logger): SnapshotDiff {
  const current = daTrackingDomain.generate()
  const committed = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf-8'))
  const diff = diffSnapshots(current, committed)

  for (const entry of diff.added) {
    logger.info(`+ ${entry.projectId}: ${entry.label} (${entry.id})`)
  }
  for (const entry of diff.removed) {
    logger.warn(`- ${entry.projectId}: ${entry.label} (${entry.id})`)
  }
  if (diff.removed.length > 0) {
    logger.warn(daTrackingDomain.wipeWarning)
  }
  logger.info(
    `Identity diff vs committed snapshot: ${diff.added.length} added, ${diff.removed.length} removed, ${diff.unchanged} unchanged`,
  )
  if (diff.added.length > 0 || diff.removed.length > 0) {
    logger.info(
      "Run 'pnpm snapshots:generate' in packages/config to accept these changes",
    )
  }

  return diff
}

function warnAboutDisabledLayers(env: Env, logger: Logger) {
  const gates: [string, boolean][] = [
    ['ethereum', !!env.optionalString('ETHEREUM_BEACON_API_URL')],
    ['celestia', !!env.optionalString('CELESTIA_BLOBS_API_URL')],
    ['avail', !!env.optionalString('AVAIL_BLOBS_API_URL')],
    [
      'eigenda',
      !!env.optionalString('EIGEN_DA_API_URL') &&
        !!env.optionalString('EIGEN_DA_PER_PROJECT_API_URL'),
    ],
  ]
  for (const [layer, enabled] of gates) {
    if (!enabled) {
      logger.warn(`Layer ${layer} disabled - missing env url, skipping it`)
    }
  }
}

function createBlobService(dbUrl: string): BlobService {
  const db = createDatabase({
    connectionString: dbUrl,
    application_name: 'DA-PREVIEW',
    ssl: { rejectUnauthorized: false },
    min: 2,
    max: 5,
    keepAlive: false,
  })
  return new BlobService(db)
}
