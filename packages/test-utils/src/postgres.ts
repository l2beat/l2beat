import { execFile } from 'node:child_process'
import { availableParallelism } from 'node:os'
import { join } from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { promisify } from 'node:util'
import { config as dotenv } from 'dotenv'

/**
 * Runs a package's database suites against one real Postgres without the suites
 * deleting each other's rows.
 *
 * Database suites truncate the tables they touch before each test, so a schema
 * may only ever be in use by one test file at a time. Vitest runs files in
 * parallel, so each worker process gets a schema of its own - the files inside
 * one worker run one after another, which is what makes that hold.
 *
 * Schemas survive the run on purpose: re-migrating an already migrated schema
 * is the fast path, and dropping them would make every run pay the full
 * migration cost again.
 */
export function postgresHarness(
  options: PostgresHarnessOptions,
): PostgresHarness {
  const schema = (worker: number) => `${options.schemaPrefix}_${worker}`

  return {
    vitestConfig: (globalSetupPath) => ({
      test: {
        globalSetup: [globalSetupPath],
        maxWorkers: WORKERS,
        minWorkers: 1,
        // Opening a connection and truncating tables is slower than Vitest's
        // 5s default allows for.
        testTimeout: TIMEOUT_MS,
        hookTimeout: TIMEOUT_MS,
      },
    }),

    globalSetup: async ({ config }) => {
      const base = baseUrl()
      if (!base) {
        return
      }
      const prismaDir = options.prismaDir ?? config.root
      // Sequential because Prisma takes a database-wide advisory lock for the
      // length of a deploy, so asking for them at once only risks its timeout.
      for (let worker = 1; worker <= workerCount(config); worker++) {
        await migrate(prismaDir, `${base}?schema=${schema(worker)}`)
      }
    },

    connectionString: () => {
      const base = baseUrl()
      return base && searchPath(base, schema(currentWorker()))
    },
  }
}

export interface PostgresHarnessOptions {
  /** Schemas are named `<prefix>_<worker>`. One prefix per package. */
  schemaPrefix: string
  /**
   * Directory holding `prisma/schema.prisma` and a `prisma` binary. Defaults to
   * the Vitest project root, which is right for the package that owns the
   * schema and has to be given by anyone else reusing it.
   */
  prismaDir?: string
}

export interface PostgresHarness {
  /**
   * The Vitest options the harness needs. `globalSetupPath` is a package-local
   * file that default-exports `globalSetup`; Vitest only accepts paths there.
   */
  vitestConfig(globalSetupPath: string): PostgresHarnessConfig
  /** Migrates one schema per worker. Point a `globalSetup` file at this. */
  globalSetup(project: { config: VitestProjectConfig }): Promise<void>
  /**
   * The connection string for the schema belonging to the current worker, or
   * undefined when `TEST_DB_URL` is unset and the suites should skip.
   */
  connectionString(): string | undefined
}

export interface PostgresHarnessConfig {
  test: {
    globalSetup: string[]
    maxWorkers: number
    minWorkers: number
    testTimeout: number
    hookTimeout: number
  }
}

export interface VitestProjectConfig {
  root: string
  maxWorkers?: number | string
}

/**
 * Pinned rather than left to Vitest's default because the schemas are migrated
 * before the first worker starts, so how many there are has to be known up
 * front. Four is where another worker stops paying for the migration it costs.
 */
const WORKERS = Math.min(4, availableParallelism())

const TIMEOUT_MS = 10_000

/**
 * Vitest numbers worker processes from 1 and never hands out an id above the
 * pool size, so the id doubles as a schema index.
 */
function currentWorker(): number {
  return Number(process.env.VITEST_POOL_ID ?? 1)
}

function workerCount(config: VitestProjectConfig): number {
  if (config.maxWorkers !== WORKERS) {
    throw new Error(
      `The database harness prepares ${WORKERS} schemas but Vitest is configured for ${config.maxWorkers} workers. Build the config with postgresHarness().vitestConfig().`,
    )
  }
  return WORKERS
}

/**
 * `TEST_DB_URL` normally comes from the package's `.env`, which nothing else in
 * a Vitest run loads, so the harness loads it itself. An already exported value
 * wins, which is how CI supplies one without an `.env` file at all.
 */
function baseUrl(): string | undefined {
  dotenv()
  const url = process.env.TEST_DB_URL
  if (!url && process.env.CI !== undefined) {
    throw new Error('TEST_DB_URL is required in CI')
  }
  return url || undefined
}

/**
 * Percent-encoded by hand: libpq reads `+` in a query parameter as a literal
 * plus, so `URLSearchParams` would hand Postgres a search path that does not
 * exist.
 */
function searchPath(base: string, schema: string): string {
  return `${base}?options=-c%20search_path%3D${schema}`
}

/**
 * Deploys are serialised inside one package, but two packages migrating the
 * same server at once - which is what `turbo run test` does - still race:
 * Prisma takes a database-wide advisory lock for a deploy, and contending for
 * it while creating `_prisma_migrations` deadlocks the two deploys against each
 * other. Postgres then kills one, which by then has applied nothing, so simply
 * asking again once the other is done is enough.
 */
async function migrate(prismaDir: string, url: string): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      await promisify(execFile)(
        join(prismaDir, 'node_modules', '.bin', 'prisma'),
        ['migrate', 'deploy'],
        { cwd: prismaDir, env: { ...process.env, PRISMA_DB_URL: url } },
      )
      return
    } catch (error) {
      if (attempt === MIGRATE_ATTEMPTS || !lostTheRace(error)) {
        throw error
      }
      await setTimeout(attempt * RETRY_DELAY_MS)
    }
  }
}

const MIGRATE_ATTEMPTS = 5
const RETRY_DELAY_MS = 500

function lostTheRace(error: unknown): boolean {
  const output = String((error as { stderr?: string })?.stderr ?? error)
  return (
    output.includes('deadlock detected') || output.includes('advisory lock')
  )
}
