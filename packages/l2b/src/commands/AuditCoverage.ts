import { ProjectService } from '@l2beat/config'
import { getDiscoveryPaths } from '@l2beat/discovery'
import { measureOssification } from '@l2beat/shared'
import {
  asciiProgressBar,
  assert,
  formatJson,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import {
  boolean,
  command,
  flag,
  option,
  optional,
  positional,
  string,
} from 'cmd-ts'
import { writeFileSync } from 'fs'
import path from 'path'
import type { AuditCoverage as Coverage } from '../implementations/audit-coverage/AuditCoverage'
import { buildAuditedCode } from '../implementations/audit-coverage/AuditedCode'
import { AuditIndex } from '../implementations/audit-coverage/AuditIndex'
import { parseAuditObjects } from '../implementations/audit-coverage/AuditObjects'
import {
  type AuditCoverageHistoryOptions,
  auditCoverageOfProject,
} from '../implementations/audit-coverage/auditCoverageOfProject'
import {
  type AuditDatasetFiles,
  fetchAuditDataset,
  readAuditDataset,
} from '../implementations/audit-coverage/auditDataset'
import { deployedSourceFromDiscovery } from '../implementations/audit-coverage/deployedSource'
import { createCliLogger } from '../implementations/common/CliLogger'
import { File, HttpUrl } from './types'

const DEFAULT_DATASET = 'https://github.com/sergeyshemyakov/audit-dataset'

export const AuditCoverage = command({
  name: 'audit-coverage',
  description:
    'Matches the deployed contracts of a project against audited code and writes the coverage as JSON.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    github: option({
      type: optional(HttpUrl),
      long: 'github',
      description: `audit dataset repository to read main from, defaults to ${DEFAULT_DATASET}`,
    }),
    index: option({
      type: optional(File),
      long: 'index',
      description: 'local audit-index.json of the --github repository',
    }),
    objects: option({
      type: optional(File),
      long: 'objects',
      description: 'local audit-objects.json.zst of the --github repository',
    }),
    datasetCommit: option({
      type: optional(string),
      long: 'dataset-commit',
      description: 'audit dataset commit the local files come from',
    }),
    output: option({
      type: optional(string),
      long: 'output',
      short: 'o',
      description: 'defaults to audit-coverage.json in the project directory',
    }),
    history: flag({
      type: boolean,
      long: 'history',
      description:
        'also cover the perimeter at every point of its history, from the launch known to the built packages/config',
    }),
  },
  handler: async (args) => {
    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const loading = cli.status()
    loading.update('Reading audit index and objects')
    const dataset = await loadDataset(args)
    const index = AuditIndex.parse(JSON.parse(dataset.index))
    const objects = parseAuditObjects(dataset.objects, index)
    const code = buildAuditedCode(index, objects, (split, count) =>
      loading.update(progress(split, count, 'Splitting audited files')),
    )
    loading.done(
      `Indexed ${code.declarations.length} audited units from ${objects.size} files, ${code.unparsed.length} do not parse`,
    )
    if (code.unparsed.length > 0) {
      cli.log(`Do not parse: ${code.unparsed.join(', ')}`)
    }

    const covering = cli.status()
    const launch = args.history ? await getLaunch(args.project) : undefined
    const warnings: string[] = []
    const history: AuditCoverageHistoryOptions | undefined = args.history
      ? {
          launch: launch?.timestamp,
          log: {
            progress: (point, count, status) =>
              covering.update(progress(point, count, status)),
            warn: (message) => warnings.push(message),
            done: (stats) =>
              cli.log(
                `History: ${stats.retained} of ${stats.points} points retained, ${stats.covered} flats covered, ${stats.reused} reused, ${stats.fetched} sources read`,
              ),
          },
        }
      : undefined
    const coverage = await auditCoverageOfProject(
      args.project,
      {
        index,
        objects,
        code,
        dataset: { repository: dataset.repository, commit: dataset.commit },
      },
      deployedSourceFromDiscovery(),
      (address, covered, count) =>
        covering.update(progress(covered, count, `Covering ${address}`)),
      history,
    )
    covering.done(summary(coverage))
    for (const warning of warnings) {
      cli.log(chalk.yellow(`Warning: ${warning}`))
    }
    if (coverage.history !== undefined && launch !== undefined) {
      for (const line of alignment(coverage.history, launch.criticalChanges)) {
        cli.log(chalk.yellow(line))
      }
    }
    const output =
      args.output ??
      path.join(
        getDiscoveryPaths().discovery,
        args.project,
        'audit-coverage.json',
      )
    writeFileSync(output, formatJson(coverage))
    cli.log(`Wrote ${output}`)
  },
})

function loadDataset(args: {
  github: string | undefined
  index: string | undefined
  objects: string | undefined
  datasetCommit: string | undefined
}): Promise<AuditDatasetFiles> {
  const github = args.github ?? DEFAULT_DATASET
  const local = [args.index, args.objects, args.datasetCommit]
  if (local.every((arg) => arg === undefined)) {
    return fetchAuditDataset(github)
  }
  assert(
    args.index !== undefined &&
      args.objects !== undefined &&
      args.datasetCommit !== undefined,
    'Local dataset files need --index, --objects and --dataset-commit',
  )
  return Promise.resolve(
    readAuditDataset(github, args.index, args.objects, args.datasetCommit),
  )
}

function progress(done: number, count: number, status: string): string {
  const bar = chalk.cyan(asciiProgressBar(done, count))
  const counter = `[${(done + 1).toString().padStart(count.toString().length)}/${count}]`
  return `${bar} ${counter} ${status}`
}

function summary(coverage: Coverage): string {
  let lines = 0
  let covered = 0
  for (const flat of Object.values(coverage.flats)) {
    for (const [id] of flat) {
      const unit = coverage.units[id] as Coverage['units'][string]
      lines += unit.lines
      if (unit.status === 'identical') {
        covered += unit.lines
      } else if (unit.status === 'differs') {
        covered += unit.covered ?? 0
      }
    }
  }
  const contracts = Object.keys(coverage.contracts).length
  const percent = lines === 0 ? 0 : (100 * covered) / lines
  return `${contracts} contracts, ${percent.toFixed(1)}% of ${lines} lines in distinct flat sources match audited code`
}

/**
 * Where the timeline's launch marker sits, as the frontend's getAuditsLaunch
 * finds it, and the critical code changes ossification counts, for the
 * alignment report. Needs packages/config built.
 */
async function getLaunch(
  project: string,
): Promise<{ timestamp: number; criticalChanges: number[] } | undefined> {
  const config = await new ProjectService().getProject({
    id: ProjectId(project),
    optional: ['ossificationHistory', 'chainConfig'],
  })
  if (config === undefined) return undefined
  const timestamp =
    config.ossificationHistory?.observedSince ??
    config.chainConfig?.sinceTimestamp
  if (timestamp === undefined) return undefined
  const history = config.ossificationHistory
  const criticalChanges =
    history === undefined
      ? []
      : measureOssification(
          {
            ...history,
            changes: history.changes.filter((c) => c.type === 'code'),
          },
          UnixTime.now(),
        ).criticalChanges
  return { timestamp, criticalChanges }
}

const ALIGNMENT_WINDOW = UnixTime.DAY

/**
 * The code points of the history next to ossification's critical code
 * changes: the two come from different sources, see the spec, and the
 * differences are what the evaluation looks at.
 */
function alignment(
  history: NonNullable<Coverage['history']>,
  criticalChanges: number[],
): string[] {
  const codePoints = history.points
    .filter((point) => (point.changes ?? []).length > 0)
    .map((point) => point.timestamp)
  const near = (a: number, bs: number[]) =>
    bs.some((b) => Math.abs(a - b) <= ALIGNMENT_WINDOW)
  const iso = (t: number) => new Date(t * 1000).toISOString()
  return [
    ...criticalChanges
      .filter((change) => !near(change, codePoints))
      .map((change) => `Critical change at ${iso(change)} has no code point`),
    ...codePoints
      .filter((point) => !near(point, criticalChanges))
      .map((point) => `Code point at ${iso(point)} has no critical change`),
  ]
}
