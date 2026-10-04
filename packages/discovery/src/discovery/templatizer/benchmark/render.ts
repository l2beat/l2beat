/**
 * `benchmark.md`: the report a reviewer reads without opening the JSON.
 *
 * Coarse to fine: one summary row per project and a total, one row per
 * contract, then every handler field that was not `equal` with its verdict
 * and diff, because a total says how far the templatizer is and the list
 * says why. Two numbers lead: reachable handler fields found (the fields
 * the model could have written; the target is all of them) and regressions
 * (committed values that were not the template's work and went missing or
 * changed; the target is none). The older "handler fields found" stays for
 * comparability with earlier runs. Unreachable fields are listed with their
 * reason, so a reader sees what the headline leaves out. Failures are
 * listed in full: a benchmark that hides its crashes is measuring a smaller
 * problem than it claims.
 */
import {
  describeVerdict,
  isHandlerField,
  isReachable,
  isRegression,
} from './compare'
import type {
  BenchmarkReport,
  ContractBenchmark,
  ProjectBenchmark,
  ProjectTotals,
  TokenUsage,
} from './types'

export function renderMarkdown(report: BenchmarkReport): string {
  return [
    '# Templatizer benchmark',
    '',
    ...renderSetup(report),
    '',
    '## Summary',
    '',
    ...renderSummaryTable(report),
    '',
    '## Contracts',
    '',
    ...report.projects.flatMap(renderContractsOfProject),
    '## Regressions',
    '',
    ...renderRegressions(report.projects),
    '',
    '## Non-equal handler fields',
    '',
    ...renderNonEqualHandlerFields(report.projects),
    '',
    '## Unreachable handler fields',
    '',
    ...renderUnreachable(report.projects),
    '',
    '## Failures',
    '',
    ...renderFailures(report.projects),
    '',
    '## Cost',
    '',
    ...renderCost(report.totals),
    '',
  ].join('\n')
}

function renderSetup(report: BenchmarkReport): string[] {
  const reported =
    report.reportedModel === undefined || report.reportedModel === report.model
      ? ''
      : ` (the client reported ${report.reportedModel})`
  return [
    `- Model: ${report.model}${reported}`,
    `- Rounds cap: ${report.maxRounds} model turn(s) per contract`,
    `- Started ${report.startedAt}, finished ${report.finishedAt}`,
    '- Blocks (the committed `usedBlockNumbers`, every value is read there):',
    ...report.projects.map(
      (project) =>
        `  - ${project.project}: ${project.chain} @ ${project.blockNumber ?? 'unknown'}`,
    ),
  ]
}

function renderSummaryTable(report: BenchmarkReport): string[] {
  const header = [
    'Project',
    'Contracts (failed, skipped)',
    'Reachable found',
    'Regressions',
    'Handler fields found',
    'Handler different',
    'Handler missed',
    'V1 fields found',
    'equal',
    'renamed',
    'by value',
    'different',
    'v1-only',
    'v2-only',
    'Authored / matched / failed',
    'Model calls',
    'Tokens in / out',
  ]
  const rows = [
    ...report.projects.map((project) =>
      summaryRow(project.project, project.totals, project.failure),
    ),
    summaryRow('Total', report.totals),
  ]
  return table(header, rows)
}

function summaryRow(
  label: string,
  totals: ProjectTotals,
  failure?: string,
): string[] {
  const handlerMissed = totals.v1Only.handler
  return [
    failure === undefined ? label : `${label} (FAILED)`,
    `${totals.contracts} (${totals.failed}, ${totals.skipped})`,
    ratio(totals.reachableFound, totals.reachableFields),
    String(totals.regressions),
    ratio(totals.handlerFound, totals.handlerFields),
    String(totals.handlerFields - totals.handlerFound - handlerMissed),
    String(handlerMissed),
    ratio(foundOf(totals), extractedOf(totals)),
    String(totals.equal),
    String(totals.equalRenamed),
    String(totals.equalByValue),
    String(totals.different),
    String(sum(Object.values(totals.v1Only))),
    String(sum(Object.values(totals.v2Only))),
    `${totals.authored} / ${totals.matched} / ${totals.authoringFailed}`,
    String(modelCallsOf(totals)),
    `${thousands(totals.tokens.input)} / ${thousands(totals.tokens.output)}`,
  ]
}

/** Found over the fields the templatizer is meant to extract: missed display-only projections are left out of the denominator. */
function foundOf(totals: ProjectTotals): number {
  return totals.equal + totals.equalRenamed + totals.equalByValue
}

function extractedOf(totals: ProjectTotals): number {
  return totals.v1Fields - totals.v1Only['template-projection']
}

function renderContractsOfProject(project: ProjectBenchmark): string[] {
  const heading = `### ${project.project} (${project.chain} @ ${project.blockNumber ?? 'unknown'})`
  if (project.contracts.length === 0) {
    return [heading, '', '(no contracts)', '']
  }
  const header = [
    'Contract',
    'Address',
    'Committed template',
    'Generated template',
    'Rounds',
    'Tokens in / out',
    'Reachable found',
    'Regressions',
    'Handler fields found',
  ]
  const rows = project.contracts.map((contract) => [
    contract.name ?? '-',
    contract.address,
    contract.committedTemplate,
    describeGenerated(contract),
    String(contract.rounds),
    `${contract.tokens.input} / ${contract.tokens.output}`,
    contract.status === 'compared'
      ? `${contract.counts.reachableFound}/${contract.counts.reachableFields}`
      : '-',
    contract.status === 'compared' ? String(contract.counts.regressions) : '-',
    contract.status === 'compared'
      ? `${contract.counts.handlerFound}/${contract.counts.handlerFields}`
      : '-',
  ])
  return [heading, '', ...table(header, rows), '']
}

const CELL_FAILURE_CHARS = 80

function describeGenerated(contract: ContractBenchmark): string {
  if (contract.status === 'skipped') {
    return 'SKIPPED'
  }
  if (contract.status === 'failed' || contract.authoring === undefined) {
    return `ERROR: ${truncate(contract.error ?? 'unknown', CELL_FAILURE_CHARS)}`
  }
  switch (contract.authoring.kind) {
    case 'authored':
      return contract.authoring.template
    case 'matched':
      return `matched committed ${contract.authoring.template}`
    case 'failed':
      return `FAILED: ${truncate(contract.authoring.failure, CELL_FAILURE_CHARS)}`
  }
}

function renderRegressions(projects: ProjectBenchmark[]): string[] {
  const lines = projects.flatMap((project) =>
    project.contracts.flatMap((contract) =>
      contract.fields
        .filter(isRegression)
        .map(
          (field) =>
            `- ${project.project}: ${nameOf(contract)} \`${field.name}\`: ${describeVerdict(field)}`,
        ),
    ),
  )
  return lines.length === 0 ? ['(none)'] : lines
}

function renderUnreachable(projects: ProjectBenchmark[]): string[] {
  const lines = projects.flatMap((project) =>
    project.contracts.flatMap((contract) =>
      contract.fields
        .filter((field) => isHandlerField(field) && !isReachable(field))
        .map(
          (field) =>
            `- ${project.project}: ${nameOf(contract)} \`${field.name}\`: ${describeVerdict(field)}`,
        ),
    ),
  )
  return lines.length === 0 ? ['(none)'] : lines
}

function renderNonEqualHandlerFields(projects: ProjectBenchmark[]): string[] {
  const lines = projects.flatMap((project) =>
    project.contracts.flatMap((contract) =>
      contract.fields
        .filter((field) => isHandlerField(field) && field.verdict !== 'equal')
        .map(
          (field) =>
            `- ${project.project}: ${nameOf(contract)} \`${field.name}\`: ${describeVerdict(field)}`,
        ),
    ),
  )
  return lines.length === 0 ? ['(none)'] : lines
}

function renderFailures(projects: ProjectBenchmark[]): string[] {
  const lines = projects.flatMap((project) => [
    ...(project.failure === undefined
      ? []
      : [`- ${project.project}: not benchmarked: ${project.failure}`]),
    ...project.contracts.flatMap((contract) =>
      describeFailure(contract).map(
        (line) => `- ${project.project}: ${nameOf(contract)}: ${line}`,
      ),
    ),
  ])
  return lines.length === 0 ? ['(none)'] : lines
}

function describeFailure(contract: ContractBenchmark): string[] {
  if (contract.status === 'skipped') {
    return [contract.error ?? 'skipped']
  }
  if (contract.status === 'failed') {
    return [`analysis threw: ${contract.error ?? 'unknown'}`]
  }
  if (contract.authoring?.kind === 'failed') {
    return [
      `authoring failed after ${contract.rounds} round(s), analysed untemplatized: ${contract.authoring.failure}`,
    ]
  }
  return []
}

function renderCost(totals: ProjectTotals): string[] {
  const distribution = Object.entries(totals.roundsDistribution)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([rounds, count]) => `${count} contract(s) in ${rounds} round(s)`)
  return [
    `- Tokens: ${describeTokens(totals.tokens)}`,
    `- Model calls: ${modelCallsOf(totals)} contract(s) asked the model; ${distribution.length === 0 ? 'no model calls' : distribution.join(', ')}`,
    `- Time: ${seconds(totals.wallMs)} s across all contracts, of which ${seconds(totals.modelMs)} s inside model turns`,
  ]
}

function modelCallsOf(totals: ProjectTotals): number {
  return sum(Object.values(totals.roundsDistribution))
}

function describeTokens(tokens: TokenUsage): string {
  return `${tokens.input} input (${tokens.cached} cached) + ${tokens.output} output (${tokens.reasoning} reasoning)`
}

export function table(header: string[], rows: string[][]): string[] {
  return [
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(escapeCell).join(' | ')} |`),
  ]
}

function escapeCell(cell: string): string {
  return cell.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function nameOf(contract: ContractBenchmark): string {
  return contract.name === undefined
    ? contract.address
    : `${contract.name} (${shortAddress(contract.address)})`
}

function shortAddress(address: string): string {
  const hex = address.slice(address.indexOf(':') + 1)
  return `${hex.slice(0, 6)}…${hex.slice(-4)}`
}

function ratio(part: number, whole: number): string {
  return whole === 0
    ? '-'
    : `${part}/${whole} (${((100 * part) / whole).toFixed(1)}%)`
}

function truncate(text: string, chars: number): string {
  return text.length <= chars ? text : `${text.slice(0, chars)}…`
}

function thousands(n: number): string {
  return `${Math.round(n / 1000)}k`
}

function seconds(ms: number): string {
  return (ms / 1000).toFixed(1)
}

function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}
