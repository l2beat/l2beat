import type { ProjectAuditScope } from '@l2beat/config'
import { getDiscoveryPaths } from '@l2beat/discovery'
import { formatJson } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { execFileSync } from 'child_process'
import { command, option, optional, positional, string } from 'cmd-ts'
import { writeFileSync } from 'fs'
import path from 'path'
import { parseAuditIndex } from '../implementations/audit-coverage/AuditIndex'
import { parseAuditObjects } from '../implementations/audit-coverage/AuditObjects'
import { readAuditDataset } from '../implementations/audit-coverage/auditDataset'
import { deployedSourceFromDiscovery } from '../implementations/audit-coverage/deployedSource'
import {
  auditScopeOfProject,
  coveredLines,
} from '../implementations/audit-coverage/scope/auditScopeOfProject'
import { GitRepos } from '../implementations/audit-coverage/scope/GitRepos'
import { createCliLogger } from '../implementations/common/CliLogger'

const DEFAULT_DATASET = 'https://github.com/sergeyshemyakov/audit-dataset'

export const AuditScope = command({
  name: 'audit-scope',
  description:
    'Builds the scope graph of each audit report of a project and covers its deployed code under the strict and the relaxed reading. See docs/superpowers/specs/2026-11-17-audit-scope-explicitness-design.md.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    dataset: option({
      type: string,
      long: 'dataset',
      description: 'path to a checkout of the audit dataset',
    }),
    github: option({
      type: optional(string),
      long: 'github',
      description: `repository the checkout is of, defaults to ${DEFAULT_DATASET}`,
    }),
    cache: option({
      type: optional(string),
      long: 'cache',
      description:
        'where audited repositories are cloned, defaults to ~/.cache/l2b-audit-scope',
    }),
    output: option({
      type: optional(string),
      long: 'output',
      short: 'o',
      description: 'defaults to audit-scope.json in the project directory',
    }),
  },
  handler: async (args) => {
    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const loading = cli.status()
    loading.update('Reading audit index and objects')
    const commit = execFileSync(
      'git',
      ['-C', args.dataset, 'rev-parse', 'HEAD'],
      { encoding: 'utf8' },
    ).trim()
    const files = readAuditDataset(
      args.github ?? DEFAULT_DATASET,
      path.join(args.dataset, 'audit-index.json'),
      path.join(args.dataset, 'audit-objects.json.zst'),
      commit,
    )
    const index = parseAuditIndex(JSON.parse(files.index))
    const objects = parseAuditObjects(files.objects, index)
    const warnings: string[] = []
    const scope = await auditScopeOfProject(
      args.project,
      {
        index,
        objects,
        dataset: { repository: files.repository, commit },
        datasetDir: args.dataset,
        repos: new GitRepos(args.cache),
      },
      deployedSourceFromDiscovery(),
      {
        status: (message) => loading.update(message),
        warn: (message) => warnings.push(message),
      },
    )
    loading.done(`Scoped ${Object.keys(scope.reports).length} reports`)
    for (const warning of warnings) {
      cli.log(chalk.yellow(`Warning: ${warning}`))
    }
    for (const line of describe(scope)) {
      cli.log(line)
    }
    const output =
      args.output ??
      path.join(getDiscoveryPaths().discovery, args.project, 'audit-scope.json')
    writeFileSync(output, formatJson(scope))
    cli.log(`Wrote ${output}`)
  },
})

function describe(scope: ProjectAuditScope): string[] {
  const lines: string[] = []
  for (const [id, report] of Object.entries(scope.reports)) {
    if (report.status !== 'graph') {
      lines.push(`${id}: no graph (${report.status})`)
      continue
    }
    for (const snapshot of report.snapshots) {
      const { own, external } = snapshot.explicitness
      const unavailable = snapshot.nodes.filter(
        (node) => node.state === 'unavailable',
      ).length
      lines.push(
        `${id} ${snapshot.repository}@${snapshot.commit.slice(0, 8)}: own ${own.named}/${own.total}, external ${external.named}/${external.total} named; ${snapshot.edges.length} edges, ${snapshot.interfaces} interfaces, ${unavailable} unavailable (unlisted: ${report.unlisted})`,
      )
    }
  }
  for (const reading of ['strict', 'relaxed'] as const) {
    const { total, covered } = coveredLines(scope, reading)
    const percent = total === 0 ? 0 : (100 * covered) / total
    lines.push(
      `${reading}: ${percent.toFixed(1)}% of ${total} lines in distinct units match audited code`,
    )
  }
  return lines
}
