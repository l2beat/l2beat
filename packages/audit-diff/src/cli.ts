import { execSync } from 'child_process'
import path from 'path'
import { packageDir, readConfig } from './config.js'
import { readDataset } from './dataset/read.js'
import { Formatter } from './deployed/format.js'
import { hasDiscovery, listDiscoveredProjects } from './deployed/read.js'
import { EvidenceIndex } from './evidence/index.js'
import { PreparedUnitCache } from './evidence/units.js'
import { generateProject } from './generate.js'
import { UnitStore } from './store/store.js'
import { fetchZkSources } from './zk/fetch.js'

const USAGE = `Usage:
  audit-diff generate --dataset <path> --out <dir> (--project <id>... | --all) [--all-contracts] [--projects-dir <dir>]
  audit-diff fetch-zk (--project <id>... | --all) [--projects-dir <dir>]
  audit-diff gc --out <dir>`

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  const args = parseArgs(rest)
  const log = (message: string) => console.log(message)
  const cacheDir = path.join(packageDir(), '.cache')
  const zkCacheDir = path.join(cacheDir, 'zk')
  const projectsDir = path.resolve(
    args['projects-dir']?.[0] ??
      path.join(packageDir(), '..', 'config', 'src', 'projects'),
  )

  switch (command) {
    case 'generate': {
      const datasetDir = path.resolve(requireArg(args, 'dataset'))
      const outDir = path.resolve(requireArg(args, 'out'))
      const projectIds = selectProjects(args, projectsDir)
      const config = readConfig()
      const datasetRevision = getDatasetRevision(datasetDir)

      const dataset = readDataset(datasetDir)
      log(
        `dataset: ${dataset.collections.length} collections, ${Object.keys(dataset.registry.repositories).length} registered repositories`,
      )
      const evidence = new EvidenceIndex(
        dataset,
        new PreparedUnitCache(path.join(cacheDir, 'audited-units')),
      )
      for (const line of evidence.log.parseErrors) log(`parse error: ${line}`)
      log(
        `evidence: ${evidence.hashIndex.size} unique audited units, ${evidence.nameIndex.size} unit names, ${evidence.log.skippedVersions.length} versions without sources`,
      )

      const store = new UnitStore(outDir, datasetRevision)
      const formatter = new Formatter(
        datasetDir,
        path.join(cacheDir, 'formatted'),
        log,
      )
      for (const projectId of projectIds) {
        console.log(`\n== ${projectId}`)
        const report = generateProject({
          projectId,
          projectsDir,
          zkCacheDir,
          evidence,
          store,
          formatter,
          collectionHints: config.collectionHints ?? {},
          config: config.projects?.[projectId],
          allContracts: Boolean(args['all-contracts']),
          datasetRevision,
          datasetRepoUrl: config.datasetRepoUrl,
          log,
        })
        store.writeProject(report)
        const s = report.summary
        console.log(
          `units: identical ${s.units.identical}, library ${s.units.library}, differs ${s.units.differs}, unaudited ${s.units.unaudited}; lines covered ${s.lines.covered}/${s.lines.total}`,
        )
      }
      store.flush(
        dataset.collections.map((c) => ({
          id: c.id,
          name: c.name,
          kind: c.kind,
        })),
      )
      console.log(`\nWrote ${projectIds.length} project(s) to ${outDir}`)
      return
    }
    case 'fetch-zk': {
      const projectIds = selectProjects(args, projectsDir)
      for (const projectId of projectIds) {
        await fetchZkSources({ projectId, projectsDir, zkCacheDir, log })
      }
      return
    }
    case 'gc': {
      const outDir = path.resolve(requireArg(args, 'out'))
      const removed = UnitStore.gc(outDir)
      console.log(`removed ${removed} unreferenced unit record(s)`)
      return
    }
    default:
      console.error(USAGE)
      process.exit(1)
  }
}

function selectProjects(
  args: Record<string, string[]>,
  projectsDir: string,
): string[] {
  if (args.all) return listDiscoveredProjects(projectsDir)
  const ids = args.project ?? []
  if (ids.length === 0) {
    console.error('At least one --project or --all is required')
    process.exit(1)
  }
  for (const id of ids) {
    if (!hasDiscovery(projectsDir, id)) {
      console.error(`no discovered.json for project ${id} in ${projectsDir}`)
      process.exit(1)
    }
  }
  return ids
}

function parseArgs(argv: string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg?.startsWith('--')) continue
    const key = arg.slice(2)
    const next = argv[i + 1]
    if (next !== undefined && !next.startsWith('--')) {
      ;(out[key] ??= []).push(next)
      i++
    } else {
      ;(out[key] ??= []).push('true')
    }
  }
  return out
}

function requireArg(args: Record<string, string[]>, key: string): string {
  const value = args[key]?.[0]
  if (!value) {
    console.error(`Missing --${key}\n${USAGE}`)
    process.exit(1)
  }
  return value
}

function getDatasetRevision(datasetDir: string): string | undefined {
  try {
    const head = execSync('git rev-parse HEAD', { cwd: datasetDir })
      .toString()
      .trim()
    const dirty = execSync('git status --porcelain', { cwd: datasetDir })
      .toString()
      .trim()
    return dirty ? `${head}-dirty` : head
  } catch {
    return undefined
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
