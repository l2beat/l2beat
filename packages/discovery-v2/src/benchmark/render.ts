/**
 * `benchmark.md`: the report a reviewer reads without opening the JSON.
 *
 * Three levels, coarse to fine: one summary row for the project, one row per
 * contract, then every field that was not `equal` where it matters (V1
 * handler and projection fields, and everything V2 added), each with the
 * attribution and the diff summary, because a total tells you how far V2 is
 * and the list tells you why. Failures are listed in full: a benchmark that
 * hides its crashes is measuring a smaller problem than it claims.
 */
import { describeVerdict } from './compare'
import {
  ATTRIBUTION_KINDS,
  type ContractBenchmark,
  type FieldVerdict,
  type ProjectBenchmark,
  type TokenUsage,
  type VerdictCounts,
} from './types'

export function renderMarkdown(report: ProjectBenchmark): string {
  return [
    `# Benchmark: ${report.project} (${report.chain} @ ${report.blockNumber})`,
    '',
    ...renderSetup(report),
    '',
    '## Summary',
    '',
    ...renderSummaryTable([report]),
    '',
    ...renderConsistency(report),
    '## Contracts',
    '',
    ...renderContractsTable(report.contracts),
    '',
    '## Non-equal V1 handler and projection fields',
    '',
    ...renderNonEqualHandlerFields(report.contracts),
    '',
    '## V2-only fields',
    '',
    ...renderV2Only(report.contracts),
    '',
    '## Entry facts',
    '',
    ...renderFacts(report.contracts),
    '',
    '## Failures',
    '',
    ...renderFailures(report.contracts),
    '',
    '## Cost',
    '',
    ...renderCost(report),
    '',
  ].join('\n')
}

function renderSetup(report: ProjectBenchmark): string[] {
  return [
    `- Model: ${report.model ?? 'none (no model call in this run)'}${report.reasoning === undefined ? '' : ` (reasoning ${report.reasoning})`}`,
    `- Authoring: ${report.author ? 'on' : 'off'}${report.noPlan ? ' (empty plan for every contract: deterministic floor)' : ''}; repeats per contract: ${report.repeat}`,
    `- Started ${report.startedAt}, finished ${report.finishedAt}`,
    `- Plan store before the run: ${report.planStoreBefore.length} plan(s)${report.planStoreBefore.length === 0 ? '' : ` (${report.planStoreBefore.map(shortHash).join(', ')})`}`,
  ]
}

/** One row per project, so several reports can be pasted into one table. */
export function renderSummaryTable(reports: ProjectBenchmark[]): string[] {
  const header = [
    'Project',
    'Contracts (failed)',
    'V1 fields',
    'V2 fields',
    'equal',
    'equal-renamed',
    'equal-by-value',
    'different',
    ...ATTRIBUTION_KINDS.map((kind) => `v1-only ${kind}`),
    'v2-only ignored-by-v1',
    'v2-only new',
  ]
  const rows = reports.map((report) => [
    report.project,
    `${report.totals.contracts} (${report.totals.failed})`,
    ...countCells(report.totals),
  ])
  return table(header, rows)
}

function countCells(counts: VerdictCounts): string[] {
  return [
    String(counts.v1Fields),
    String(counts.v2Fields),
    String(counts.equal),
    String(counts.equalRenamed),
    String(counts.equalByValue),
    String(counts.different),
    ...ATTRIBUTION_KINDS.map((kind) => String(counts.v1Only[kind])),
    String(counts.v2Only['ignored-by-v1']),
    String(counts.v2Only.new),
  ]
}

function renderConsistency(report: ProjectBenchmark): string[] {
  const repeated = report.contracts.filter((c) => c.repeats !== undefined)
  if (repeated.length === 0) {
    return []
  }
  const rows = repeated.map((contract) => {
    const repeats = contract.repeats
    if (repeats === undefined) throw new Error('filtered above')
    const failed = repeats.attempts.filter((a) => a.status === 'failed').length
    return [
      nameOf(contract),
      String(repeats.attempts.length),
      String(failed),
      String(repeats.plans),
      String(repeats.distinctDecisionHashes),
      repeats.attempts
        .map((a) =>
          a.decisionHash === undefined ? 'failed' : shortHash(a.decisionHash),
        )
        .join(', '),
    ]
  })
  return [
    '## Consistency (--repeat)',
    '',
    ...table(
      [
        'Contract',
        'repeats',
        'failed',
        'plans compared',
        'distinct decision hashes',
        'repeat hashes',
      ],
      rows,
    ),
    '',
  ]
}

function renderContractsTable(contracts: ContractBenchmark[]): string[] {
  const header = [
    'Contract',
    'template',
    'plan',
    'source',
    'rounds',
    'tokens in+out',
    'wall s',
    'equal',
    'renamed',
    'by value',
    'different',
    'v1-only',
    'v2-only',
    'distinct',
  ]
  const rows = contracts.map((contract) => [
    nameOf(contract),
    contract.template ?? '-',
    contract.status === 'failed' ? 'FAILED' : (contract.planStatus ?? '-'),
    contract.planSource,
    String(contract.rounds),
    `${contract.tokens.input}+${contract.tokens.output}`,
    seconds(contract.wallMs),
    String(contract.counts.equal),
    String(contract.counts.equalRenamed),
    String(contract.counts.equalByValue),
    String(contract.counts.different),
    String(sum(Object.values(contract.counts.v1Only))),
    String(sum(Object.values(contract.counts.v2Only))),
    contract.repeats === undefined
      ? '-'
      : `${contract.repeats.distinctDecisionHashes}/${contract.repeats.plans}`,
  ])
  return table(header, rows)
}

function renderNonEqualHandlerFields(contracts: ContractBenchmark[]): string[] {
  const lines = contracts.flatMap((contract) =>
    contract.fields
      .filter(isNonEqualHandlerField)
      .map(
        (field) =>
          `- ${nameOf(contract)} \`${field.name}\`: ${describeVerdict(field)}`,
      ),
  )
  return lines.length === 0 ? ['(none)'] : lines
}

function isNonEqualHandlerField(field: FieldVerdict): boolean {
  if (field.verdict === 'equal' || field.verdict === 'v2-only') {
    return false
  }
  return (
    field.attribution.kind === 'handler' ||
    field.attribution.kind === 'template-projection'
  )
}

function renderV2Only(contracts: ContractBenchmark[]): string[] {
  const lines = contracts.flatMap((contract) =>
    contract.fields
      .filter((field) => field.verdict === 'v2-only')
      .map(
        (field) =>
          `- ${nameOf(contract)} \`${field.name}\`: ${describeVerdict(field)}`,
      ),
  )
  return lines.length === 0 ? ['(none)'] : lines
}

function renderFacts(contracts: ContractBenchmark[]): string[] {
  const unequal = contracts.flatMap((contract) =>
    contract.facts
      .filter((fact) => !fact.equal)
      .map(
        (fact) =>
          `- ${nameOf(contract)} \`${fact.fact}\`: V1 ${JSON.stringify(fact.v1)} vs V2 ${JSON.stringify(fact.v2)}`,
      ),
  )
  const compared = contracts.filter((c) => c.status === 'compared').length
  return [
    `${compared} contract(s) compared on proxyType, sourceHashes, sinceBlock and implementationNames; ${unequal.length} fact(s) differ.`,
    ...(unequal.length === 0 ? [] : ['', ...unequal]),
  ]
}

function renderFailures(contracts: ContractBenchmark[]): string[] {
  const lines = contracts.flatMap((contract) => {
    const out: string[] = []
    if (contract.status === 'failed') {
      out.push(
        `- ${nameOf(contract)}: pipeline threw: ${contract.error ?? 'unknown'}`,
      )
    }
    if (contract.planStatus === 'failed') {
      out.push(
        `- ${nameOf(contract)}: authoring failed after ${contract.rounds} round(s): ${contract.authoringFailure ?? 'no acceptable plan'}`,
      )
    }
    if (contract.planStatus === 'partial') {
      out.push(
        `- ${nameOf(contract)}: plan executed with step errors (partial)`,
      )
    }
    for (const attempt of contract.repeats?.attempts ?? []) {
      if (attempt.status === 'failed') {
        out.push(
          `- ${nameOf(contract)}: a repeat failed: ${attempt.failure ?? 'unknown'}`,
        )
      }
    }
    return out
  })
  return lines.length === 0 ? ['(none)'] : lines
}

function renderCost(report: ProjectBenchmark): string[] {
  const { totals } = report
  const distribution = Object.entries(totals.roundsDistribution)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([rounds, count]) => `${count} contract(s) in ${rounds} round(s)`)
  return [
    `- Tokens: ${describeTokens(totals.tokens)}`,
    `- Wall time: ${seconds(totals.wallMs)} s across all pipelines, of which ${seconds(totals.modelMs)} s inside model turns (repeats included)`,
    `- Rounds: ${distribution.length === 0 ? 'no model calls' : distribution.join(', ')}`,
    `- Failures: ${totals.failed} pipeline(s) threw; ${report.contracts.filter((c) => c.planStatus === 'failed').length} authoring(s) failed`,
  ]
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

function shortHash(hash: string): string {
  return hash.slice(0, 10)
}

function seconds(ms: number): string {
  return (ms / 1000).toFixed(1)
}

function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}
