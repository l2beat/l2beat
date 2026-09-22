/**
 * How the tools exchange files.
 *
 * Every tool is a function from JSON files to JSON files so any stage can
 * be replayed and diffed offline. Files are parsed through their schemas on
 * the way in, never trusted: a hand-edited `prepared.json` or a plan from
 * another version must fail here with a path, not deep inside the executor.
 * The default run directory groups one address's files together so a whole
 * run can be inspected or deleted as a unit.
 */
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import fs from 'fs'
import path from 'path'
import type { Plan } from '../plan/Plan'
import { parsePlan } from '../plans/PlanStore'
import { Baseline } from '../types/Baseline'
import { ExecutedSchema } from '../types/Executed'
import { Prepared } from '../types/Prepared'
import { Worklist } from '../types/Worklist'

export const FILE_NAMES = {
  prepared: 'prepared.json',
  baseline: 'baseline.json',
  worklist: 'worklist.json',
  facts: 'facts.json',
  plan: 'plan.json',
  findings: 'findings.json',
  values: 'values.json',
  entry: 'entry.json',
  entryMeta: 'entry.meta.json',
} as const

export function packageDir(): string {
  return path.join(__dirname, '..', '..')
}

export function defaultRunDir(chain: string, address: ChainSpecificAddress) {
  return path.join(
    packageDir(),
    'runs',
    chain,
    ChainSpecificAddress.address(address).toString(),
  )
}

/** `0x…` on the given chain, or an already prefixed `eth:0x…` that must be on that chain. */
export function parseAddress(chain: string, raw: string): ChainSpecificAddress {
  if (!raw.includes(':')) {
    return ChainSpecificAddress.fromLong(chain, raw)
  }
  const address = ChainSpecificAddress(raw)
  assert(
    ChainSpecificAddress.longChain(address) === chain,
    `Address ${raw} is not on ${chain}`,
  )
  return address
}

export function readPrepared(file: string): Prepared {
  return Prepared.parse(readJson(file))
}

export function readBaseline(file: string): Baseline {
  return Baseline.parse(readJson(file))
}

export function readWorklist(file: string): Worklist {
  return Worklist.parse(readJson(file))
}

export function readExecuted(file: string) {
  return ExecutedSchema.parse(readJson(file))
}

/** A bare plan, or a stored `{ plan, provenance }` file straight from the plan store. */
export function readPlan(file: string): Plan {
  const content = readJson(file)
  const bare =
    isRecord(content) && 'plan' in content && 'provenance' in content
      ? content.plan
      : content
  return parsePlan(bare, file)
}

export function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function writeJson(file: string, value: unknown): string {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
  return file
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
