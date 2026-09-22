/**
 * The cross-run table for `BENCHMARK.md`: one row per (project, setup),
 * the same numbers the HTML bars draw, so the two never disagree.
 *
 * "Found" counts a V1 field once V2 holds its values under any name or
 * shape (`equal`, `equal-renamed`, `equal-by-value`); V1 display-only
 * fields (template projections) are left out of the denominator by design.
 * The handler columns restrict both to the fields V1 needed a researcher
 * handler for, which is the only part a setup can move.
 */
import type { NamedReport } from './renderHtml'
import type { ContractBenchmark, FieldVerdict, ProjectBenchmark } from './types'

export interface RunSummary {
  project: string
  label: string
  setup: string
  contracts: number
  failed: number
  v1Fields: number
  found: number
  extracted: number
  handlerFields: number
  handlerFound: number
  handlerMissed: number
  different: number
  modelCalls: number
  inputTokens: number
  outputTokens: number
  wallMs: number
}

const FOUND_VERDICTS = new Set(['equal', 'equal-renamed', 'equal-by-value'])

export function summariseRun({ label, report }: NamedReport): RunSummary {
  const t = report.totals
  const handler = report.contracts
    .flatMap((c: ContractBenchmark) => c.fields)
    .filter(
      (f: FieldVerdict) =>
        f.verdict !== 'v2-only' && f.attribution.kind === 'handler',
    )
  return {
    project: report.project,
    label,
    setup: describeSetup(report),
    contracts: t.contracts,
    failed: t.failed,
    v1Fields: t.v1Fields,
    found: t.equal + t.equalRenamed + t.equalByValue,
    extracted: t.v1Fields - t.v1Only['template-projection'],
    handlerFields: handler.length,
    handlerFound: handler.filter((f) => FOUND_VERDICTS.has(f.verdict)).length,
    handlerMissed: handler.filter((f) => f.verdict === 'v1-only').length,
    different: t.different,
    modelCalls: Object.values(t.roundsDistribution).reduce((a, b) => a + b, 0),
    inputTokens: t.tokens.input,
    outputTokens: t.tokens.output,
    wallMs: t.wallMs,
  }
}

export function describeSetup(report: ProjectBenchmark): string {
  if (report.noPlan) return 'no plan (floor)'
  const strategy =
    report.review && report.facts
      ? 'review + facts'
      : report.review
        ? 'review'
        : report.facts
          ? 'facts'
          : 'one shot'
  const model = report.model ?? (report.author ? 'model' : 'stored plans')
  const effort = report.reasoning === undefined ? '' : ` (${report.reasoning})`
  return `${model}${effort}, ${strategy}`
}

export function renderComparisonMarkdown(reports: NamedReport[]): string {
  const rows = reports.map(summariseRun)
  const header = [
    'Project',
    'Run',
    'Setup',
    'Contracts (failed)',
    'V1 fields found',
    'Handler fields found',
    'Handler missed',
    'Different',
    'Model calls',
    'Tokens in / out',
    'Wall',
  ]
  const pct = (a: number, b: number) =>
    b === 0 ? '-' : `${a}/${b} (${((100 * a) / b).toFixed(1)}%)`
  const lines = rows.map((r) =>
    [
      r.project,
      r.label,
      r.setup,
      `${r.contracts}${r.failed > 0 ? ` (${r.failed})` : ''}`,
      pct(r.found, r.extracted),
      pct(r.handlerFound, r.handlerFields),
      String(r.handlerMissed),
      String(r.different),
      String(r.modelCalls),
      `${Math.round(r.inputTokens / 1000)}k / ${Math.round(r.outputTokens / 1000)}k`,
      `${Math.round(r.wallMs / 1000)} s`,
    ].join(' | '),
  )
  return [
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...lines.map((line) => `| ${line} |`),
  ].join('\n')
}
