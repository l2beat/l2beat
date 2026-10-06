import { getDiscoveryPaths } from '@l2beat/discovery'
import { asciiProgressBar, formatJson, UnixTime } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, option, optional, positional, string } from 'cmd-ts'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type { AuditCoverage as Coverage } from '../implementations/audit-coverage/AuditCoverage'
import { buildAuditedCode } from '../implementations/audit-coverage/AuditedCode'
import { AuditIndex } from '../implementations/audit-coverage/AuditIndex'
import { parseAuditObjects } from '../implementations/audit-coverage/AuditObjects'
import { auditCoverageOfProject } from '../implementations/audit-coverage/auditCoverageOfProject'
import { deployedSourceFromCache } from '../implementations/audit-coverage/deployedSource'
import { createCliLogger } from '../implementations/common/CliLogger'
import { File } from './types'

export const AuditCoverage = command({
  name: 'audit-coverage',
  description:
    'Matches the deployed contracts of a project against audited code and writes the coverage as JSON.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    index: option({
      type: File,
      long: 'index',
      description: 'audit-index.json',
    }),
    objects: option({
      type: File,
      long: 'objects',
      description: 'audit-objects.json.zst',
    }),
    datasetCommit: option({
      type: string,
      long: 'dataset-commit',
      description: 'audit dataset commit both files come from',
    }),
    output: option({
      type: optional(string),
      long: 'output',
      short: 'o',
      description: 'defaults to audit-coverage.json in the project directory',
    }),
  },
  handler: async (args) => {
    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const loading = cli.status()
    loading.update('Reading audit index and objects')
    const index = AuditIndex.parse(JSON.parse(readFileSync(args.index, 'utf8')))
    const objects = parseAuditObjects(readFileSync(args.objects), index)
    const code = buildAuditedCode(index, objects, (split, count) =>
      loading.update(progress(split, count, 'Splitting audited files')),
    )
    loading.done(
      `Indexed ${code.declarations.length} audited units from ${objects.size} files, ${code.unparsed.length} do not parse`,
    )

    const covering = cli.status()
    const coverage = await auditCoverageOfProject(
      args.project,
      {
        index,
        code,
        datasetCommit: args.datasetCommit,
        generatedAt: UnixTime.now(),
      },
      deployedSourceFromCache(),
      (address, covered, count) =>
        covering.update(progress(covered, count, `Covering ${address}`)),
    )
    covering.done(summary(coverage))
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
      const added = (unit.added ?? []).reduce(
        (sum, [a, b]) => sum + b - a + 1,
        0,
      )
      lines += unit.lines
      covered += unit.status === 'none' ? 0 : unit.lines - added
    }
  }
  const contracts = Object.keys(coverage.contracts).length
  const percent = lines === 0 ? 0 : (100 * covered) / lines
  return `${contracts} contracts, ${percent.toFixed(1)}% of ${lines} lines in distinct flat sources match audited code`
}
