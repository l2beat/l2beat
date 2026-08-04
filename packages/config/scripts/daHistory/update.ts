import { getBlockNumberAtOrBefore } from '@l2beat/shared'
import { execSync } from 'child_process'
import dotenv from 'dotenv'
import { providers } from 'ethers'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import { getProjects } from '../../src/processing/getProjects'
import {
  daTrackingHistoryPath,
  getDaTrackingResolutions,
  readDaTrackingHistoryFile,
  serializeDaTrackingHistory,
} from '../../src/templates/daTrackingHistory'
import type {
  EraBoundary,
  ResolveBoundary,
} from '../../src/templates/daTrackingHistoryUpdate'
import {
  dropLastEra,
  updateDaTrackingHistory,
} from '../../src/templates/daTrackingHistoryUpdate'

/**
 * The only writer of src/projects/<name>/daTracking.json - the committed,
 * machine-maintained DA tracking era store the stack templates read.
 *
 * Usage (in packages/config):
 *   pnpm da:history                          update/init every template project
 *   pnpm da:history <project...>             only the given projects
 *   pnpm da:history <project> --drop-last    revert a spurious era (flap)
 *   pnpm da:history <project> --since-block N --until-block N
 *                                            manual boundary (non-ethereum
 *                                            layers, or no RPC available)
 *
 * On a rotation the old era is closed and the new one opened with a
 * deliberately overlapping 'bracketed' boundary derived from the discovery
 * run timestamps (previous run = new era start, current run = old era end).
 * The overlap is safe because era identities are disjoint filters. Needs
 * ETHEREUM_RPC_URL in .env for the timestamp -> block resolution.
 */

dotenv.config()

const CONFIG_DIR = join(__dirname, '../..')
const REPO_ROOT = join(CONFIG_DIR, '../..')

interface CliArgs {
  projects: string[]
  dropLast: boolean
  sinceBlock?: number
  untilBlock?: number
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { projects: [], dropLast: false }
  const queue = [...argv]
  while (queue.length > 0) {
    const arg = queue.shift()
    if (arg === undefined) break
    if (arg === '--drop-last') {
      args.dropLast = true
    } else if (arg === '--since-block') {
      args.sinceBlock = Number(queue.shift())
    } else if (arg === '--until-block') {
      args.untilBlock = Number(queue.shift())
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown flag: ${arg}`)
    } else {
      args.projects.push(arg)
    }
  }
  if (
    (args.sinceBlock === undefined) !== (args.untilBlock === undefined) ||
    Number.isNaN(args.sinceBlock) ||
    Number.isNaN(args.untilBlock)
  ) {
    throw new Error('--since-block and --until-block must be given together')
  }
  const manual = args.sinceBlock !== undefined
  if ((manual || args.dropLast) && args.projects.length !== 1) {
    throw new Error(
      '--drop-last and manual boundaries operate on exactly one project',
    )
  }
  return args
}

function discoveredTimestamp(projectName: string): number {
  const path = join(CONFIG_DIR, 'src/projects', projectName, 'discovered.json')
  const parsed = JSON.parse(readFileSync(path, 'utf8'))
  if (typeof parsed.timestamp !== 'number') {
    throw new Error(`No timestamp in ${path}`)
  }
  return parsed.timestamp
}

function discoveredTimestampOnMain(projectName: string): number | undefined {
  const relative = `packages/config/src/projects/${projectName}/discovered.json`
  for (const ref of ['main', 'origin/main']) {
    try {
      const content = execSync(`git -C ${REPO_ROOT} show ${ref}:${relative}`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        maxBuffer: 64 * 1024 * 1024,
      })
      const timestamp = JSON.parse(content).timestamp
      if (typeof timestamp === 'number') {
        return timestamp
      }
    } catch {
      // ref or file missing - try the next ref
    }
  }
  return undefined
}

function makeEthereumBlockResolver() {
  const rpcUrl = process.env.ETHEREUM_RPC_URL
  if (!rpcUrl) {
    throw new Error(
      'ETHEREUM_RPC_URL not set - add it to packages/config/.env or pass --since-block/--until-block',
    )
  }
  const provider = new providers.StaticJsonRpcProvider(rpcUrl)
  let latest: Promise<number> | undefined
  return async (timestamp: number): Promise<number> => {
    latest ??= provider.getBlockNumber()
    return await getBlockNumberAtOrBefore(timestamp, 1, await latest, (n) =>
      provider.getBlock(n),
    )
  }
}

function makeBoundaryResolver(
  projectName: string,
  args: CliArgs,
  ethereumBlockAt: (timestamp: number) => Promise<number>,
): ResolveBoundary {
  return async (group): Promise<EraBoundary> => {
    if (args.sinceBlock !== undefined && args.untilBlock !== undefined) {
      return {
        sinceBlock: args.sinceBlock,
        untilBlock: args.untilBlock,
        precision: 'manual',
        observedAtTimestamp: discoveredTimestamp(projectName),
      }
    }
    if (group.type !== 'ethereum' || group.daLayer !== 'ethereum') {
      throw new Error(
        `${projectName}: cannot resolve a ${group.type}/${group.daLayer} boundary automatically - ` +
          `rerun with: pnpm da:history ${projectName} --since-block <n> --until-block <n> ` +
          `(blocks on the ${group.daLayer} chain bracketing the change)`,
      )
    }
    const currentTimestamp = discoveredTimestamp(projectName)
    const previousTimestamp = discoveredTimestampOnMain(projectName)
    if (previousTimestamp === undefined) {
      throw new Error(
        `${projectName}: cannot read discovered.json on main to bracket the rotation - ` +
          `rerun with: pnpm da:history ${projectName} --since-block <n> --until-block <n>`,
      )
    }
    // New era starts at the previous run's block (before the rotation), old
    // era ends at the current run's block (after it) - see file header.
    const [sinceBlock, untilBlock] = await Promise.all([
      ethereumBlockAt(Math.min(previousTimestamp, currentTimestamp)),
      ethereumBlockAt(currentTimestamp),
    ])
    return {
      sinceBlock,
      untilBlock,
      precision: 'bracketed',
      observedAtTimestamp: currentTimestamp,
    }
  }
}

function writeResult(
  projectName: string,
  file: ReturnType<typeof readDaTrackingHistoryFile>,
  changes: string[],
): boolean {
  if (changes.length === 0) {
    return false
  }
  const path = daTrackingHistoryPath(projectName)
  if (file === undefined) {
    if (existsSync(path)) {
      unlinkSync(path)
      console.log(`${projectName}: deleted daTracking.json`)
    }
  } else {
    writeFileSync(path, serializeDaTrackingHistory(file))
  }
  for (const change of changes) {
    console.log(`${projectName}: ${change}`)
  }
  return true
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.dropLast) {
    const projectName = args.projects[0]
    const existing = readDaTrackingHistoryFile(projectName)
    if (!existing) {
      throw new Error(`${projectName} has no daTracking.json`)
    }
    const result = dropLastEra(existing)
    if (writeResult(projectName, result.file, result.changes)) {
      regenerateSnapshot()
    }
    return
  }

  // Evaluates all templates and fills the daTracking resolutions registry
  getProjects()
  const resolutions = getDaTrackingResolutions()

  const requested =
    args.projects.length > 0 ? args.projects : [...resolutions.keys()]
  const unknown = requested.filter((name) => !resolutions.has(name))
  if (unknown.length > 0) {
    throw new Error(
      `Not a template project with DA tracking: ${unknown.join(', ')}`,
    )
  }

  let ethereumBlockAt: ((timestamp: number) => Promise<number>) | undefined
  let anythingChanged = false
  let upToDate = 0

  for (const projectName of requested) {
    const resolution = resolutions.get(projectName)
    if (!resolution) continue

    if (resolution.source === 'nonTemplate') {
      if (existsSync(daTrackingHistoryPath(projectName))) {
        console.warn(
          `${projectName}: WARNING - has both nonTemplateDaTracking and a daTracking.json; ` +
            'the file is ignored, delete it or drop the override',
        )
      }
      continue
    }

    const existing = readDaTrackingHistoryFile(projectName)
    if (!existing && (resolution.derived ?? []).length === 0) {
      continue
    }

    const resolveBoundary = makeBoundaryResolver(projectName, args, (ts) => {
      ethereumBlockAt ??= makeEthereumBlockResolver()
      return ethereumBlockAt(ts)
    })
    const result = await updateDaTrackingHistory(
      projectName,
      existing,
      resolution.derived ?? [],
      resolveBoundary,
    )
    if (writeResult(projectName, result.file, result.changes)) {
      anythingChanged = true
      if (result.changes.some((c) => c.includes('closed era'))) {
        console.log(
          `${projectName}: NOTE - closing an era changes that configuration's range; ` +
            'on deploy the backend wipes and resyncs it (DaIndexer has no trimData)',
        )
      }
    } else {
      upToDate++
    }
  }

  console.log(`${upToDate} project(s) already up to date`)
  if (anythingChanged) {
    regenerateSnapshot()
  }
}

function regenerateSnapshot() {
  // Child process on purpose: this process already evaluated the templates
  // with the OLD files (module cache), the snapshot must see the new ones.
  console.log('Regenerating the da-tracking snapshot...')
  execSync('pnpm snapshots:generate da-tracking', {
    cwd: CONFIG_DIR,
    stdio: 'inherit',
  })
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
