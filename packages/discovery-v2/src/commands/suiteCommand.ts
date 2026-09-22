/**
 * `suite <label>`: the whole benchmark suite under one setup.
 *
 * An experiment is one setup (provider, model, reasoning, strategy, or no
 * plan at all) applied to the same projects and contracts as every other
 * experiment, so the suite file is the single place that says what "the
 * same" means, and the label is the only thing a run adds. Outputs go to
 * `runs/benchmark/<label>/<project>/`, and accepted plans to
 * `plans/experiments/<label>/`, a store of its own, so one experiment never
 * inherits another's decisions. `report` takes the label directory whole.
 */

import { v } from '@l2beat/validate'
import fs from 'fs'
import path from 'path'
import {
  type BenchmarkArgs,
  type BenchmarkFiles,
  benchmarkCommand,
} from './benchmarkCommand'
import type { CommandContext } from './context'
import { packageDir } from './files'

export const SuiteProject = v.object({
  name: v.string(),
  chain: v.string(),
  /** Missing means every verified `Contract` entry of the project on `chain`. */
  addresses: v.array(v.string()).optional(),
})

export const Suite = v.object({
  description: v.string().optional(),
  projects: v.array(SuiteProject),
})
export type Suite = v.infer<typeof Suite>

export type SuiteArgs = Omit<
  BenchmarkArgs,
  'project' | 'chain' | 'addresses' | 'limit' | 'out' | 'plansDir'
> & {
  label: string
  suiteFile?: string
  /** Run only these projects of the suite. */
  projects?: string[]
}

export async function suiteCommand(
  ctx: CommandContext,
  args: SuiteArgs,
): Promise<BenchmarkFiles[]> {
  const suite = readSuite(args.suiteFile ?? defaultSuiteFile())
  const selected = suite.projects.filter(
    (p) => args.projects === undefined || args.projects.includes(p.name),
  )
  if (selected.length === 0) {
    throw new Error(`no suite project matches ${args.projects?.join(', ')}`)
  }
  const labelDir = path.join(packageDir(), 'runs', 'benchmark', args.label)
  const plansDir = path.join(packageDir(), 'plans', 'experiments', args.label)
  ctx.logger.info('Suite', {
    label: args.label,
    projects: selected.map((p) => p.name),
    labelDir,
    plansDir,
  })
  const results: BenchmarkFiles[] = []
  for (const project of selected) {
    results.push(
      await benchmarkCommand(ctx, {
        ...args,
        project: project.name,
        chain: project.chain,
        addresses: project.addresses,
        out: path.join(labelDir, project.name),
        plansDir,
      }),
    )
  }
  return results
}

export function readSuite(file: string): Suite {
  return Suite.parse(JSON.parse(fs.readFileSync(file, 'utf8')))
}

export function defaultSuiteFile(): string {
  return path.join(packageDir(), 'benchmarks', 'suite.json')
}
