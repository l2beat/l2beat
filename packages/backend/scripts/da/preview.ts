import { type Env, getEnv, Logger, type LogLevel } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import {
  diffSnapshots,
  formatRange,
  type SnapshotDiff,
} from '@l2beat/config/build/snapshots/compare'
import { daTrackingDomain } from '@l2beat/config/build/snapshots/daTracking/identities'
import { createDatabase, type DataAvailabilityRecord } from '@l2beat/database'
import { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { command, option, optional, positional, run, string } from 'cmd-ts'
import { config as dotenv } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { getDaTrackingConfig } from '../../src/config/features/da'
import { BlobService } from '../../src/modules/data-availability/services/BlobService'
import {
  createIndexerId,
  INDEXER_NAMES,
} from '../../src/tools/uif/indexerIdentity'
import { type BlobCache, createBlobSource } from './blobSource'
import { previewBlockLayer } from './blockPreview'
import { createPreviewClients } from './clients'
import { previewEigen } from './eigenPreview'
import { type ExpectedCoverage, findRecordGaps } from './gaps'
import { summarizeGaps, summarizeRecords, writePreviewJson } from './output'
import { parseTimeArg, resolveWindow } from './range'

const LAYERS = ['ethereum', 'celestia', 'avail', 'eigenda'] as const

const SNAPSHOT_PATH = path.join(
  __dirname,
  '../../../config/src/snapshots/daTracking/snapshot.json',
)
const OUTPUT_PATH = './scripts/da/preview.json'

/**
 * Injected as ETHEREUM_BEACON_API_URL when only DA_PREVIEW_DB_URL is set, so
 * getDaTrackingConfig still assembles ethereum configurations. The beacon
 * client is never constructed in that mode (see ethereumFromDbOnly).
 */
const DB_CACHE_URL = 'db-cache'

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

    const dbUrl = env.optionalString('DA_PREVIEW_DB_URL')
    const ethereumFromDbOnly =
      !!dbUrl && !env.optionalString('ETHEREUM_BEACON_API_URL')
    if (ethereumFromDbOnly) {
      env = getEnv({ ETHEREUM_BEACON_API_URL: DB_CACHE_URL })
    }

    const ps = new ProjectService()
    const daConfig = await getDaTrackingConfig(ps, env)

    const enabledLayers = new Set(
      [...daConfig.blockLayers, ...daConfig.timestampLayers].map((l) => l.name),
    )
    for (const layer of LAYERS.filter((l) => !enabledLayers.has(l))) {
      logger.warn(`Layer ${layer} disabled - missing env url, skipping it`)
    }

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
    const clients = await createPreviewClients(
      daConfig,
      ps,
      env,
      logger,
      http,
      {
        ethereumFromDbOnly,
      },
    )
    const blobCache = dbUrl ? createBlobCache(dbUrl) : undefined

    const records: DataAvailabilityRecord[] = []
    const expected: ExpectedCoverage[] = []

    for (const layer of clients.blockLayers) {
      const layerConfigs = blockConfigs.filter((c) => c.daLayer === layer.name)
      if (layerConfigs.length === 0) {
        continue
      }

      if (
        layer.name === 'ethereum' &&
        !blobCache &&
        window.to - window.from > 6 * UnixTime.HOUR
      ) {
        logger.warn(
          'Previewing more than 6h of ethereum blobs without DA_PREVIEW_DB_URL will be slow',
        )
      }

      const source = createBlobSource(layer, blobCache, logger)
      const result = await previewBlockLayer(
        layer,
        layerConfigs,
        window,
        source,
        logger,
      )
      records.push(...result.records)
      expected.push(...result.expected)
    }

    if (clients.eigen && timestampConfigs.length > 0) {
      const result = await previewEigen(
        clients.eigen,
        timestampConfigs,
        window,
        logger,
      )
      records.push(...result.records)
      expected.push(...result.expected)
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
  const diff = diffSnapshots(committed, current)

  for (const entry of diff.added) {
    logger.info(`+ ${entry.projectId}: ${entry.label} (${entry.id})`)
  }
  for (const entry of diff.missing) {
    logger.warn(`- ${entry.projectId}: ${entry.label} (${entry.id})`)
  }
  if (diff.missing.length > 0) {
    logger.warn(daTrackingDomain.wipeWarning)
  }
  for (const change of diff.rangeChanges) {
    logger.warn(
      `~ ${change.projectId}: ${change.label} (${change.id}) ${formatRange(change.old)} => ${formatRange(change.new)}`,
    )
  }
  logger.info(
    `Identity diff vs committed snapshot: ${diff.added.length} added, ${diff.missing.length} removed, ${diff.rangeChanges.length} range changes, ${diff.unchanged} unchanged`,
  )
  if (
    diff.added.length > 0 ||
    diff.missing.length > 0 ||
    diff.rangeChanges.length > 0
  ) {
    logger.info(
      "Run 'pnpm snapshots:generate' in packages/config to accept these changes",
    )
  }

  return diff
}

function createBlobCache(dbUrl: string): BlobCache {
  const db = createDatabase({
    connectionString: dbUrl,
    application_name: 'DA-PREVIEW',
    ssl: { rejectUnauthorized: false },
    min: 2,
    max: 5,
    keepAlive: false,
  })
  const blobService = new BlobService(db)
  return {
    get: (daLayer, from, to) => blobService.get(daLayer, from, to),
    getSyncedHeight: async (daLayer) =>
      (
        await db.indexerState.findByIndexerId(
          createIndexerId(INDEXER_NAMES.BLOB, daLayer),
        )
      )?.safeHeight,
  }
}
