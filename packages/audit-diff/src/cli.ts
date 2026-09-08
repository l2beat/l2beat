import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ProjectAuditCoverage } from './contract/schema.js'
import { generateProject, type ProjectConfig } from './generate.js'
import { loadLibraryIndexes } from './libraries.js'

interface Config {
  /** Base URL used to link audit report files, e.g. .../blob/main */
  datasetRepoUrl?: string
  projects?: Record<string, ProjectConfig>
}

function main() {
  const [command, ...rest] = process.argv.slice(2)
  if (command !== 'generate') {
    console.error(
      'Usage: audit-diff generate --dataset <path> --out <dir> [--project <id>]... [--no-libs]',
    )
    process.exit(1)
  }
  const args = parseArgs(rest)
  const datasetDir = path.resolve(requireArg(args, 'dataset'))
  const outDir = path.resolve(requireArg(args, 'out'))
  const projectIds = args.project ?? []
  if (projectIds.length === 0) {
    console.error('At least one --project is required')
    process.exit(1)
  }

  const config = readConfig()
  const datasetRevision = getDatasetRevision(datasetDir)
  const log = (message: string) => console.log(message)

  const libraries = args['no-libs'] ? [] : loadLibraryIndexes(datasetDir, log)

  mkdirSync(outDir, { recursive: true })

  for (const projectId of projectIds) {
    console.log(`\n== ${projectId}`)
    const report = generateProject({
      datasetDir,
      projectId,
      libraries,
      config: config.projects?.[projectId],
      datasetRevision,
      datasetRepoUrl: config.datasetRepoUrl,
      log,
    })
    // Validate what we wrote against the contract, so consumers can trust it.
    ProjectAuditCoverage.parse(JSON.parse(JSON.stringify(report)))
    writeFileSync(
      path.join(outDir, `${projectId}.json`),
      JSON.stringify(report, null, 2),
    )
    const s = report.summary
    console.log(
      `units: identical ${s.units.identical}, library ${s.units.library}, differs ${s.units.differs}, unaudited ${s.units.unaudited}; lines covered ${s.lines.covered}/${s.lines.total}`,
    )
  }

  console.log(`\nWrote ${projectIds.length} project(s) to ${outDir}`)
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
    console.error(`Missing --${key}`)
    process.exit(1)
  }
  return value
}

function readConfig(): Config {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const file = path.resolve(here, '..', 'audit-diff.config.json')
  if (!existsSync(file)) return {}
  return JSON.parse(readFileSync(file, 'utf8')) as Config
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

main()
