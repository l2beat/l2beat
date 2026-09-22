/**
 * Accepted plans on disk, keyed by shape hash.
 *
 * A plan describes code, not an address: two contracts with the same
 * flattened source (V1's template-matching hash) have the same getters,
 * mappings and events, so one plan serves both and a shape we have already
 * seen never goes back to the model. The store is plain JSON in the
 * repository so plans are reviewed and versioned like V1 templates.
 *
 * Every file carries provenance (who authored it, when, in how many repair
 * rounds) because a manually written plan and a model plan are held to
 * different standards in the benchmark, and a stored file must say which it
 * is. Loading validates against the plan schema: a hand-edited store must
 * fail here, not inside the executor.
 */
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import fs from 'fs'
import path from 'path'
import { validateSchema } from '../library/validateSchema'
import type { Plan } from '../plan/Plan'
import { planSchema } from '../plan/planSchema'

export const PLAN_SOURCES = ['model', 'manual'] as const
export type PlanSource = (typeof PLAN_SOURCES)[number]

export const PlanProvenance = v.object({
  source: v.enum(PLAN_SOURCES),
  /** ISO-8601 instant of acceptance. */
  createdAt: v.string(),
  model: v.string().optional(),
  rounds: v.number().optional(),
  /** `decisionHash(plan)` at acceptance, so consistency across runs is a file diff. */
  decisionHash: v.string().optional(),
})
export type PlanProvenance = v.infer<typeof PlanProvenance>

export interface StoredPlan {
  plan: Plan
  provenance: PlanProvenance
}

const StoredPlanFile = v.object({
  plan: v.unknown(),
  provenance: PlanProvenance,
})

export class PlanStore {
  constructor(private readonly directory: string = defaultPlansDir()) {}

  pathFor(shapeHash: string): string {
    assertShapeHash(shapeHash)
    return path.join(this.directory, `${shapeHash}.json`)
  }

  load(shapeHash: string): StoredPlan | undefined {
    const file = this.pathFor(shapeHash)
    if (!fs.existsSync(file)) {
      return undefined
    }
    const parsed = StoredPlanFile.parse(
      JSON.parse(fs.readFileSync(file, 'utf8')),
    )
    const plan = parsePlan(parsed.plan, file)
    assert(
      plan.shapeHash === shapeHash,
      `${file}: stored plan is for shape ${plan.shapeHash}, not ${shapeHash}`,
    )
    return { plan, provenance: parsed.provenance }
  }

  /** Writes the plan under its own `shapeHash` and returns the file path. */
  save(plan: Plan, provenance: PlanProvenance): string {
    assert(
      plan.shapeHash !== undefined,
      'A plan without a shapeHash cannot be stored: nothing would match it',
    )
    parsePlan(plan, 'plan to save')
    const file = this.pathFor(plan.shapeHash)
    fs.mkdirSync(this.directory, { recursive: true })
    const stored: StoredPlan = { plan, provenance }
    fs.writeFileSync(file, `${JSON.stringify(stored, null, 2)}\n`)
    return file
  }
}

export function defaultPlansDir(): string {
  return path.join(__dirname, '..', '..', 'plans')
}

/** Schema check with the file named in the error, for either a stored wrapper or a bare plan. */
export function parsePlan(plan: unknown, source: string): Plan {
  const findings = validateSchema(planSchema, plan, '$')
  if (findings.length > 0) {
    throw new Error(`${source}: invalid plan: ${findings.join('; ')}`)
  }
  return plan as Plan
}

function assertShapeHash(shapeHash: string): void {
  assert(
    /^0x[0-9a-fA-F]{64}$/.test(shapeHash),
    `Not a shape hash: "${shapeHash}"`,
  )
}
