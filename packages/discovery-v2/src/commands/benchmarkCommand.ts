/**
 * `benchmark <project>`: V1's committed `discovered.json` against V2, one
 * contract at a time, at V1's block.
 *
 * Writes `benchmark.json` (everything the run recorded) and `benchmark.md`
 * (the tables a reviewer reads) under `--out`, default
 * `runs/benchmark/<project>/`, with each contract's pipeline files under
 * `contracts/<address>/` so any row of the report can be traced to the
 * prompt, the plan and the values that produced it. The plan store is the
 * package's own `plans/`, so accepted plans stay reusable across runs and the
 * report says which shapes were already there.
 */
import fs from 'fs'
import path from 'path'
import type { ReasoningEffort } from '../author/codex/CodexClient'
import { loadV1Project } from '../benchmark/loadProject'
import { renderMarkdown } from '../benchmark/render'
import { runBenchmark } from '../benchmark/runBenchmark'
import type { ProjectBenchmark } from '../benchmark/types'
import { defaultPlansDir, PlanStore } from '../plans/PlanStore'
import type { CommandContext } from './context'
import { packageDir, writeJson } from './files'

export interface BenchmarkArgs {
  project: string
  chain: string
  limit?: number
  addresses?: string[]
  author: boolean
  repeat: number
  out?: string
  model?: string
  reasoning?: ReasoningEffort
  maxRounds?: number
}

export const BENCHMARK_FILES = {
  json: 'benchmark.json',
  markdown: 'benchmark.md',
} as const

export interface BenchmarkFiles {
  report: ProjectBenchmark
  jsonFile: string
  markdownFile: string
}

export async function benchmarkCommand(
  ctx: CommandContext,
  args: BenchmarkArgs,
): Promise<BenchmarkFiles> {
  if (args.repeat > 0 && !args.author) {
    throw new Error('--repeat needs --author: a repeat is an authoring run')
  }
  const project = loadV1Project(args.project, args.chain, {
    limit: args.limit,
    addresses: args.addresses,
  })
  const outDir = args.out ?? defaultBenchmarkDir(args.project)
  ctx.logger.info('Benchmark', {
    project: project.name,
    chain: project.chain,
    blockNumber: project.blockNumber,
    contracts: project.entries.length,
    author: args.author,
    repeat: args.repeat,
    outDir,
  })
  const report = await runBenchmark(
    { ctx, planStoreBefore: storedShapeHashes() },
    project,
    {
      author: args.author,
      repeat: args.repeat,
      outDir,
      model: args.model,
      reasoning: args.reasoning,
      maxRounds: args.maxRounds,
      planStore: new PlanStore(),
    },
  )
  const jsonFile = writeJson(path.join(outDir, BENCHMARK_FILES.json), report)
  const markdownFile = path.join(outDir, BENCHMARK_FILES.markdown)
  fs.writeFileSync(markdownFile, renderMarkdown(report))
  ctx.logger.info('Benchmark written', { jsonFile, markdownFile })
  return { report, jsonFile, markdownFile }
}

export function defaultBenchmarkDir(project: string): string {
  return path.join(packageDir(), 'runs', 'benchmark', project)
}

function storedShapeHashes(): string[] {
  const directory = defaultPlansDir()
  if (!fs.existsSync(directory)) {
    return []
  }
  return fs
    .readdirSync(directory)
    .filter((file) => /^0x[0-9a-fA-F]{64}\.json$/.test(file))
    .map((file) => file.slice(0, -'.json'.length))
    .sort()
}

/** One line for the terminal. */
export function summariseBenchmark(report: ProjectBenchmark): string {
  const { totals } = report
  return [
    `project=${report.project}`,
    `contracts=${totals.contracts}`,
    `failed=${totals.failed}`,
    `equal=${totals.equal}`,
    `renamed=${totals.equalRenamed}`,
    `different=${totals.different}`,
    `v1only=${Object.values(totals.v1Only).reduce((a, b) => a + b, 0)}`,
    `v2only=${totals.v2Only['ignored-by-v1'] + totals.v2Only.new}`,
    `tokens=${totals.tokens.input}+${totals.tokens.output}`,
    `time=${Math.round(totals.wallMs / 1000)}s`,
  ].join(' ')
}
