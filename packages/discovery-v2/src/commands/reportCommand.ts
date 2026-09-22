/**
 * `report <benchmark.json>...`: one HTML page from several benchmark runs.
 *
 * Runs are labelled from their own setup (floor, model and reasoning) unless
 * the argument is `label=path`, so a page comparing two models of the same
 * project reads as such without renaming files.
 */
import fs from 'fs'
import { type NamedReport, renderHtml } from '../benchmark/renderHtml'
import type { ProjectBenchmark } from '../benchmark/types'
import type { CommandContext } from './context'

export interface ReportArgs {
  inputs: string[]
  out: string
}

export function reportCommand(ctx: CommandContext, args: ReportArgs): void {
  const reports = args.inputs.map(readNamedReport)
  fs.writeFileSync(args.out, renderHtml(reports))
  ctx.logger.info('Report written', {
    out: args.out,
    runs: reports.map((r) => `${r.report.project}: ${r.label}`),
  })
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
  if (report.model === undefined) {
    return report.author ? 'model' : 'stored plans'
  }
  return report.reasoning === undefined
    ? report.model
    : `${report.model} (${report.reasoning})`
}
