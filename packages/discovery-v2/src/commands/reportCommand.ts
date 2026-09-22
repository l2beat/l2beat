/**
 * `report <benchmark.json>...`: one HTML page from several benchmark runs.
 *
 * Runs are labelled from their own setup (floor, model and reasoning) unless
 * the argument is `label=path`, so a page comparing two models of the same
 * project reads as such without renaming files.
 */
import fs from 'fs'
import path from 'path'
import { renderComparisonMarkdown } from '../benchmark/renderComparison'
import { type NamedReport, renderHtml } from '../benchmark/renderHtml'
import type { ProjectBenchmark } from '../benchmark/types'
import type { CommandContext } from './context'

export interface ReportArgs {
  inputs: string[]
  out: string
  /** Also write the cross-run table as Markdown, for BENCHMARK.md. */
  markdown?: string
}

export function reportCommand(ctx: CommandContext, args: ReportArgs): void {
  const reports = args.inputs.flatMap(expandInput).map(readNamedReport)
  fs.writeFileSync(args.out, renderHtml(reports))
  if (args.markdown !== undefined) {
    fs.writeFileSync(args.markdown, `${renderComparisonMarkdown(reports)}\n`)
  }
  ctx.logger.info('Report written', {
    out: args.out,
    runs: reports.map((r) => `${r.report.project}: ${r.label}`),
  })
}

/**
 * A label directory stands for every run in it, `<project>/benchmark.json`
 * under `runs/benchmark/<label>/` or `<project>.json` under
 * `benchmarks/<label>/`, labelled with the directory name, so one argument
 * compares one experiment across projects.
 */
function expandInput(input: string): string[] {
  const [label, file] = splitLabel(input)
  if (!fs.existsSync(file) || !fs.statSync(file).isDirectory()) {
    return [input]
  }
  const name = label ?? path.basename(file)
  return fs
    .readdirSync(file)
    .sort()
    .map((child) =>
      child.endsWith('.json')
        ? path.join(file, child)
        : path.join(file, child, 'benchmark.json'),
    )
    .filter((report) => fs.existsSync(report))
    .map((report) => `${name}=${report}`)
}

export function readNamedReport(input: string): NamedReport {
  const [label, file] = splitLabel(input)
  const report = JSON.parse(fs.readFileSync(file, 'utf8')) as ProjectBenchmark
  return { label: label ?? defaultLabel(report), report }
}

function splitLabel(input: string): [string | undefined, string] {
  const at = input.indexOf('=')
  return at === -1
    ? [undefined, input]
    : [input.slice(0, at), input.slice(at + 1)]
}

function defaultLabel(report: ProjectBenchmark): string {
  if (report.noPlan) {
    return 'floor'
  }
  const model =
    report.model === undefined
      ? report.author
        ? 'model'
        : 'stored plans'
      : report.model
  const parts = [
    report.reasoning === undefined ? model : `${model} (${report.reasoning})`,
    ...(report.review ? ['review'] : []),
    ...(report.facts ? ['facts'] : []),
  ]
  return parts.join(' + ')
}
